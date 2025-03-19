import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "../models/user.model";
dotenv.config();


const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const present = await userModel.findOne({ email });
    if (present) {
      return res.status(403).json({
        message: "User already exists! Try Signing in.",
        ok: false,
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT!);
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const id = newUser._id;
    const token = jwt.sign(
      { userId: id, role: "user" },
      process.env.JWT_TOKEN!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // TODO: aim for https... so set it true later
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
    });

    return res.json({
      message: "Sign-up successful",
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Sign-Up Failed!",
      error: err instanceof Error ? err.message : String(err),
      ok: false,
    });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "User Not Found",
        ok: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        message: "Invalid Credentials",
        ok: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_TOKEN!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // TODO: aim for https... so set it true later
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
    });

    return res.status(200).json({
      message: "Login Successful!",
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Login Failed!",
      error: err instanceof Error ? err.message : String(err),
      ok: false,
    });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  res.clearCookie("auth_token");
  return res.status(200).json({
    message: "Logout Successful!",
    ok: true,
  });
};

// const forgot_password = async (req: Request, res: Response): Promise<any> => {
//   const { email } = req.body;
//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User not found", ok: false });
//   }
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   user.resetToken = resetToken;
//   user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour validity
//   await user.save();
//   const mailOptions = {
//     from: process.env.AUTH_EMAIL,
//     to: user.email,
//     subject: "Password Reset",
//     text: `Your password reset token is: ${resetToken}. It expires in 1 hour.`,
//   };
//   await transporter.sendMail(mailOptions);
//   res.json({ message: "Password reset email sent", ok: true });
// };

const reset_password = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
        ok: false,
      });
    }

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", ok: false });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT!);
    user.password = await bcrypt.hash(newPassword, saltRounds);

    await user.save();

    res.json({ message: "Password reset successful!", ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some Error occurred",
      error: err,
      ok: false,
    });
  }
};
interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}
const change_password = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { old_pass, new_pass } = req.body;
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        ok: false,
      });
    }
    const verifypass = await bcrypt.compare(old_pass, user.password);
    if (!verifypass) {
      return res.status(403).json({
        message: "Current Password is incorrect",
        ok: false,
      });
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT!);
    const hashedPassword = await bcrypt.hash(new_pass, saltRounds);
    user.password = hashedPassword;
    await user.save();
    return res.status(201).json({
      message: "Password Changed Successfully!",
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some Error occurred",
      error: err,
      ok: false,
    });
  }
};

export { signup, login, logout, reset_password, change_password };
