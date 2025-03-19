import requests
import logging
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
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
        logging.FileHandler("codeforces.log", mode="a"),
    ],
)

# Codeforces API URL
CODEFORCES_API_URL = "https://codeforces.com/api/contest.list"


def fetch_codeforces_contests():
    logging.info("Fetching contests from Codeforces...")
    try:
        response = requests.get(CODEFORCES_API_URL)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()

        if data["status"] != "OK":
            logging.error(f"Codeforces API returned an error: {data['comment']}")
            return []

        contests = []
        for contest in data["result"]:
            # Only include upcoming contests
            if contest["phase"] == "BEFORE":
                contests.append(
                    {
                        "name": contest["name"],
                        "platform": "Codeforces",
                        "url": f"https://codeforces.com/contest/{contest['id']}",
                        "start_time": datetime.utcfromtimestamp(
                            contest["startTimeSeconds"]
                        ),
                        "end_time": datetime.utcfromtimestamp(
                            contest["startTimeSeconds"] + contest["durationSeconds"]
                        ),
                    }
                )
        logging.info(f"Fetched {len(contests)} upcoming contests from Codeforces.")
        return contests
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching contests from Codeforces: {e}")
        return []


def save_to_mongo(contests):
    logging.info("Connecting to MongoDB...")
    try:
        client = MongoClient(MONGO_URI)
        db = client["test"]
        collection = db["contests"]

        for contest in contests:
            # Check if the contest already exists in the database
            existing = collection.find_one(
                {"name": contest["name"], "start_time": contest["start_time"]}
            )
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
    logging.info("Starting Codeforces contest scraper...")
    contests = fetch_codeforces_contests()
    if contests:
        save_to_mongo(contests)
    logging.info("Codeforces contest scraper finished.")


if __name__ == "__main__":
    main()
