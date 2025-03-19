import axios from "axios";
import Contest, { IContest } from "../models/contest.model";
import { Request, Response } from "express";

export const fetchContests = async (): Promise<void> => {
  try {
    const [codeforces, leetcode, codechef] = await Promise.all([
      axios.get("https://codeforces.com/api/contest.list"),
      axios.get("https://kontests.net/api/v1/leet_code"),
      axios.get("https://kontests.net/api/v1/code_chef"),
    ]);

    const contests: IContest[] = [];

    codeforces.data.result.forEach((c: any) => {
      if (c.phase === "BEFORE") {
        contests.push({
          name: c.name,
          platform: "Codeforces",
          url: `https://codeforces.com/contest/${c.id}`,
          start_time: new Date(c.startTimeSeconds * 1000),
          end_time: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
        } as IContest);
      }
    });

    leetcode.data.forEach((c: any) => {
      contests.push({
        name: c.name,
        platform: "Leetcode",
        url: c.url,
        start_time: new Date(c.start_time),
        end_time: new Date(c.end_time),
      } as IContest);
    });

    codechef.data.forEach((c: any) => {
      contests.push({
        name: c.name,
        platform: "CodeChef",
        url: c.url,
        start_time: new Date(c.start_time),
        end_time: new Date(c.end_time),
      } as IContest);
    });

    await Contest.deleteMany({ status: "upcoming" });
    await Contest.insertMany(contests);
    console.log("Contests updated successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching contests:", error.message);
    } else {
      console.error("Error fetching contests:", error);
    }
  }
};

export const getContests = async (req: Request, res: Response) => {
  try {
    const {
      platform,
      page = 1,
      limit = 10,
      search,
      sort = "-start_time",
      startDate,
      endDate,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    let query: any = {};

    if (platform) {
      if (Array.isArray(platform)) {
        query.platform = { $in: platform };
      } else if (typeof platform === "string") {
        query.platform = { $in: platform.split(",") };
      }
    }

    if (search) query.name = { $regex: search, $options: "i" };

    if (startDate || endDate) {
      query.start_time = {};
      if (startDate) query.start_time.$gte = new Date(startDate as string);
      if (endDate) query.start_time.$lte = new Date(endDate as string);
    }

    const contests = await Contest.find(query)
      .sort(sort as string)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalContests = await Contest.countDocuments(query);

    res.json({
      ok: true,
      data: contests,
      pagination: {
        total: totalContests,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalContests / limitNumber),
      },
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};



export const getContestWithId = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ ok: false, message: "Contest not found" });
    }
    res.json({ ok: true, data: contest });
  } catch (error) {
    console.error("Error fetching contest:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
}