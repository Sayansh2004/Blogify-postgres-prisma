import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { userProfile } from "../controllers/profileController.js";

export const profileRouter=express.Router()

profileRouter.get("/view",verifyToken,userProfile)