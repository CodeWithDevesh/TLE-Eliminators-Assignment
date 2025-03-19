import puppeteer, { Browser, Page } from "puppeteer";

const CODECHEF_URL = "https://www.codechef.com/contests";

async function fetchUpcommingChefContests() {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Navigating to ${CODECHEF_URL}...`);
  await page.goto(CODECHEF_URL, { waitUntil: "networkidle2" });

  console.log("Scrolling to load all contests...");
  await autoScroll(page);

  console.log("Extracting contest details...");
  const contests = await page.evaluate(() => {
    const contestList: any[] = [];
    const contestDivs = document.querySelectorAll(
      "div._data__container_7s2sw_533"
    );

    contestDivs.forEach((contest) => {
      const nameElement = contest.querySelector("a");
      if (nameElement) {
        contestList.push({
          name: nameElement.innerText.trim(),
          url: nameElement.getAttribute("href"),
        });
      }
    });

    return contestList;
  });

  console.log(
    `Found ${contests.length} contests. Fetching additional details...`
  );

  
  for (let i = 0; i < contests.length; i++) {
    const contest = contests[i];
    console.log(`Fetching details for contest: ${contest.name}`);
    const { start_date, end_date } = await fetchContestDetails(
      browser,
      contest.url
    );
    if (!start_date || !end_date) {
      console.log(`Skipping contest: ${contest.name} due to missing dates.`);
      contests.splice(i, 1);
      i--;
      continue;
    }
    contest.start_time = start_date;
    contest.end_time = end_date;
    console.log(`Fetched details for contest: ${contest.name}`);
  }

  console.log("Closing Puppeteer...");
  await browser.close();

  console.log("Contests fetched successfully:", contests);
  return contests;
}

async function fetchContestDetails(browser: Browser, contestUrl: string) {
  console.log(`Opening new page for contest URL: ${contestUrl}`);
  const page = await browser.newPage();
  await page.goto(contestUrl, { waitUntil: "networkidle2" });

  console.log("Extracting start and end dates...");
  const contestDetails = await page.evaluate(() => {
    const startDateElem = Array.from(document.querySelectorAll("li")).find(
      (li) => li.innerText.includes("Start Date")
    );
    const endDateElem = Array.from(document.querySelectorAll("li")).find((li) =>
      li.innerText.includes("End Date")
    );

    return {
      start_date_text: startDateElem
        ? startDateElem.innerText.replace("Start Date: ", "").trim()
        : null,
      end_date_text: endDateElem
        ? endDateElem.innerText.replace("End Date: ", "").trim()
        : null,
    };
  });

  await page.close();

  console.log("Parsing date strings...");
  const start_date = contestDetails.start_date_text
    ? parseDate(contestDetails.start_date_text)
    : null;
  const end_date = contestDetails.end_date_text
    ? parseDate(contestDetails.end_date_text)
    : null;

  console.log("Parsed dates:", { start_date, end_date });
  return { start_date, end_date };
}

function parseDate(dateString: string): Date | null {
  console.log(`Parsing date string: ${dateString}`);
  dateString = dateString.replace(/\s+/g, "").trim();
  const match = dateString.match(
    /(\d{1,2})(?:st|nd|rd|th)?(\w+),?(\d{4})at(\d{1,2}):(\d{2})HRS/
  );

  if (!match) {
    console.error("Failed to parse date string:", dateString);
    return null;
  }

  const [, day, month, year, hours, minutes] = match;
  const date = new Date(
    `${month} ${day}, ${year} ${hours}:${minutes}:00 GMT+0530`
  );
  if (isNaN(date.getTime())) {
    console.error("Invalid date parsed:", dateString);
    return null;
  }

  console.log("Parsed date successfully:", date);
  return date;
}

async function autoScroll(page: Page) {
  console.log("Starting auto-scroll...");
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  });
  console.log("Auto-scroll completed.");
}

export default fetchUpcommingChefContests;
