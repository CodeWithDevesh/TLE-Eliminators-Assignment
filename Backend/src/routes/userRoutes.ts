import { Router } from "express";
import checkAuthentication from "../middlewares/checkAuthentication";
import { getProfile, updateProfile } from "../controllers/user.controller";

const userRouter = Router();

userRouter.use(checkAuthentication);

// projectsRouter.post("/requests", projectRedquest);//
userRouter.get("/", getProfile); //
userRouter.post("/", updateProfile); //

export default userRouter;
