import express, { Request, Response } from "express";
import Contest from "../models/contest.model";
import Bookmark from "../models/bookmark.model";
import {
  fetchContests,
  getContests,
  getContestWithId,
} from "../controllers/contest.controller";
import authenticateToken from "../middlewares/checkAuthentication";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

/*
@queryParam {string} platform
@queryParam {string} status
@queryParam {string} search
@queryParam {string} sort
@queryParam {number} page
@queryParam {number} limit */
router.get("/", getContests);
router.get("/:id", async (req: Request, res: Response, next) => {
  try {
    await getContestWithId(req, res);
  } catch (error) {
    next(error);
  }
});

// Add solution link
router.post(
  "/solution",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (req.role !== "admin") {
        res.status(403).json({ message: "Unauthorized", ok: false });
        return;
      }
      const { contestId, solution_link } = req.body;
      await Contest.findByIdAndUpdate(contestId, { solution_link });
      res.json({ ok: true, message: "Solution link added!" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", ok: false });
    }
  }
);

export default router;
