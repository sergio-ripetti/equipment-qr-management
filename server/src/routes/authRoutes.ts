import express from "express";

import {
  loginUser,
  registerUser,
  getUserProfile,
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";
import { authLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post(
  "/login",
  authLimiter,
  validate([
    { field: "email", required: true, isEmail: true },
    { field: "password", required: true, minLength: 6, maxLength: 12 },
  ]),
  loginUser,
);

router.post(
  "/register",
  authLimiter,
  validate([
    { field: "name", required: true, minLength: 2, maxLength: 50 },
    { field: "email", required: true, isEmail: true, maxLength: 254 },
    { field: "password", required: true, minLength: 6, maxLength: 12 },
  ]),
  registerUser,
);
router.get("/profile", protect, getUserProfile);

export default router;
