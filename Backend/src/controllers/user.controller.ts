import mongoose from "mongoose";
import userModel from "../models/user.model";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}
interface UpdateProfileRequestBody {
  name?: string;
  email?: string;
}

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await userModel.findById(req.userId).populate('bookmarks').select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        ok: false,
      });
    }
    return res.status(200).json({
      response: user,
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occured.",
      error: err,
      ok: false,
    });
  }
};

const updateProfile = async (
  req: AuthenticatedRequest & { body: UpdateProfileRequestBody },
  res: Response
): Promise<any> => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        ok: false,
      });
    }

    const { name, email } = req.body;

    const updateObj: Partial<typeof user> = {};
    if (name) updateObj.name = name;
    if (email) updateObj.email = email;

    try {
      await userModel.findByIdAndUpdate(
        req.userId,
        { $set: updateObj },
        { new: true, runValidators: true }
      );
    } catch (err) {
      return res.json(500).json({
        message: "Unable to update user. Please try again.",
        error: err,
        ok: false,
      });
    }
    return res.status(200).json({
      message: "Profile Updated Successfully",
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occurred.",
      error: err,
      ok: false,
    });
  }
};

const bookmark = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { contestId } = req.body;
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        ok: false,
      });
    }

    if (user.bookmarks && user.bookmarks.includes(contestId)) {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark != contestId
      );
      await user.save();
      return res.status(200).json({
        message: "Bookmark removed successfully!",
        ok: true,
      });
    }

    const mongoose = require("mongoose");
    const contestObjectId: mongoose.Types.ObjectId =
      new mongoose.Types.ObjectId(contestId);
    user.bookmarks = user.bookmarks
      ? [...user.bookmarks, contestObjectId]
      : [contestObjectId];
    await user.save();

    return res.status(200).json({
      message: "Bookmarked successfully!",
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occurred.",
      error: err,
      ok: false,
    });
  }
};

const getBookmarkedProjects = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = await userModel.findById(req.userId).populate("bookmarks");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        ok: false,
      });
    }
    return res.status(200).json({
      response: user.bookmarks,
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occurred.",
      error: err,
      ok: false,
    });
  }
};

export { getProfile, updateProfile, bookmark, getBookmarkedProjects };
