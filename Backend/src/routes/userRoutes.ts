import { Router } from "express";
import checkAuthentication from "../middlewares/checkAuthentication";
import { bookmark, getProfile, updateProfile } from "../controllers/user.controller";

const userRouter = Router();

userRouter.use(checkAuthentication);

// projectsRouter.post("/requests", projectRedquest);//
userRouter.get("/", getProfile); //
userRouter.post("/", updateProfile); //
userRouter.post('/bookmark', bookmark);
userRouter.get('/bookmarks', getProfile);

export default userRouter;
