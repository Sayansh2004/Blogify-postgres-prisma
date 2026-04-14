import express from "express";
import { loginController, signupController, logoutController } from "../controllers/authController.js";

const authRouter=express.Router()

authRouter.post("/signup",signupController);
authRouter.post("/login",loginController);
authRouter.post("/logout",logoutController)
export default authRouter;