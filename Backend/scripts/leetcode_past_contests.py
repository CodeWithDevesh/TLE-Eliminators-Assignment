import requests
import logging
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file
MONGO_URI = os.getenv("MONGO_URI") 
# MONGO_URI = "mongodb://localhost:27017/"
if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in the .env file.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("leetcode.log", mode="a"),
    ],
)

URL = "https://leetcode.com/graphql"

HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com/contest/",
    "User-Agent": "Mozilla/5.0",
}


def fetch_past_contests(page_no=1):
    logging.info(f"Fetching past contests from LeetCode (Page: {page_no})...")
    query = {
        "query": """
        query pastContests($pageNo: Int, $numPerPage: Int) {
          pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
            currentPage
            totalNum
            numPerPage
            data {
              title
              startTime
              duration
            }
          }
        }
        """,
        "variables": {"pageNo": page_no, "numPerPage": 10},
    }

    try:
        response = requests.post(URL, json=query, headers=HEADERS)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()
        logging.info(f"Successfully fetched contests for page {page_no}.")
        return data["data"]["pastContests"]["data"]
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching contests: {e}")
        return []
    except KeyError as e:
        logging.error(f"Unexpected response structure: {e}")
        return []


def save_to_mongo(contests):
    logging.info("Connecting to MongoDB...")
    try:
        client = MongoClient(MONGO_URI)
        db = client["test"]
        collection = db["contests"]

        for contest in contests:
            # Convert start_time and end_time to datetime objects
            contest["start_time"] = datetime.fromisoformat(contest["start_time"].replace("Z", "+00:00"))
            contest["end_time"] = datetime.fromisoformat(contest["end_time"].replace("Z", "+00:00"))

            existing = collection.find_one({"name": contest["name"], "start_time": contest["start_time"]})
            if not existing:
                logging.info(f"Inserting contest: {contest['name']}")
                collection.insert_one(contest)
            else:
                logging.info(f"Contest already exists: {contest['name']}")

        logging.info("All contests have been processed.")
    except Exception as e:
        logging.error(f"Error saving contests to MongoDB: {e}")
    finally:
        client.close()
        logging.info("MongoDB connection closed.")


def main():
    logging.info("Starting LeetCode contest scraper...")
    page_no = 1
    while True:
        contests = fetch_past_contests(page_no)
        for contest in contests:
            start_time = int(contest["startTime"])
            duration = int(contest["duration"])
            
            # Convert start_time and end_time to ISO 8601 format
            contest["start_time"] = datetime.utcfromtimestamp(start_time).isoformat() + "Z"
            contest["end_time"] = datetime.utcfromtimestamp(start_time + duration).isoformat() + "Z"
            contest["platform"] = "leetcode"
        
        if not contests:
            logging.info("No more contests to fetch. Exiting.")
            break
        
        filtered_contests = [
            {
                "name": contest["title"],
                "start_time": contest["start_time"],
                "end_time": contest["end_time"],
                "platform": contest["platform"],
            }
            for contest in contests
        ]
        save_to_mongo(filtered_contests)
        page_no += 1
    logging.info("LeetCode contest scraper finished.")


if __name__ == "__main__":
    main()
