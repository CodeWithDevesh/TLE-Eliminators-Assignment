import express, { Request, Response } from "express";
import Contest from "../models/contest.model";
import Bookmark from "../models/bookmark.model";
import { fetchContests, getContests } from "../controllers/contest.controller";

const router = express.Router();

/*
@queryParam {string} platform
@queryParam {string} status
@queryParam {string} search
@queryParam {string} sort
@queryParam {number} page
@queryParam {number} limit */
router.get("/", getContests);

// Get past contests
router.get("/past", async (req: Request, res: Response) => {
  const contests = await Contest.find({ status: "past" });
  res.json(contests);
});

// Bookmark a contest
router.post("/bookmark", async (req: Request, res: Response) => {
  const { userId, contestId } = req.body;
  await new Bookmark({ userId, contestId }).save();
  res.json({ message: "Bookmarked successfully!" });
});

// Add solution link
router.post("/solution", async (req: Request, res: Response) => {
  const { contestId, solution_link } = req.body;
  await Contest.findByIdAndUpdate(contestId, { solution_link });
  res.json({ message: "Solution link added!" });
});

export default router;
