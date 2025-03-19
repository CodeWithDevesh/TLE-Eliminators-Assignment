import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/user.model";
dotenv.config();
interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}
const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.auth_token;
  if (!token) {
    res.status(403).json({ message: "Invalid Token", ok: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as {
      userId: string;
      role: string;
    };
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      res.status(403).json({
        message: "No such winner exists!",
        ok: false,
      });
      return;
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token!", ok: false });
    return;
  }
};

export default authenticateToken;
