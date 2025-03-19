import express from "express";
import dotenv from "dotenv";
import { change_password, logout, login, reset_password, signup } from "../controllers/auth.controller";
import authenticateToken from "../middlewares/checkAuthentication";
dotenv.config();

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post('/logout', logout);
authRouter.post('/reset-password', reset_password)
authRouter.post('/change-password',authenticateToken,change_password)

export default authRouter;
