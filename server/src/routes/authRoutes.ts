import express from "express";

import {
  loginUser,
  registerUser,
  getUserProfile,
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";
import { authLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/login", authLimiter, loginUser);
router.post("/register", authLimiter, registerUser);
router.get("/profile", protect, getUserProfile);

export default router;
