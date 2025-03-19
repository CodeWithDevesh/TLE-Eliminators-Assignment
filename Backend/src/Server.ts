import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contestRoutes from "./routes/contestRoutes";
import cookieParser from "cookie-parser";
import fetchCodeChefContests from "./services/chefScraper";
import contestModel from "./models/contest.model";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://127.0.0.1:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  exposedHeaders: ["Set-Cookie"],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection
const MONGO_URI =
  (process.env.MONGO_URI as string) ||
  "mongodb://localhost:27017/contest-tracker";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/contests", contestRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Contest Tracker API is running...");
});

app.get("/chef", async (req: Request, res: Response) => {
  try {
    const contests = await fetchCodeChefContests();

    const contestsWithPlatform = contests.map((contest) => ({
      ...contest,
      platform: "CodeChef",
    }));

    for (const contest of contestsWithPlatform) {
      const exists = await contestModel.findOne({
        name: contest.name,
        start_time: contest.start_time,
      });
      if (!exists) {
        console.log(`Uploading contest: ${contest.name}`);
        await contestModel.create(contest);
      }
    }

    res.send("Contests fetched successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
