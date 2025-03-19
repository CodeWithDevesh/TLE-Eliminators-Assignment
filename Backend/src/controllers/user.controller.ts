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
    const user = await userModel.findById(req.userId).select("-password");
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

export { getProfile, updateProfile };
