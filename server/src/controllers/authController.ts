import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User = require("../models/User");

type AuthRequest = Request & {
  user?: unknown;
};

type AuthBody = {
  name?: string;
  email?: string;
  password?: string;
};

// Generates JWT token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: "24h",
  });
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (
  req: Request<unknown, unknown, AuthBody>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !password || !(await user.matchPassword(password))) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(String(user._id)),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Login error:", error);
    }
    res.status(500).json({
      message: "Error logging in"
    });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
export const registerUser = async (
  req: Request<unknown, unknown, AuthBody>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "viewer",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(String(user._id)),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Register error:", error);
    }
    res.status(400).json({
      message: "Error registering user"
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  res.status(200).json(req.user);
};
