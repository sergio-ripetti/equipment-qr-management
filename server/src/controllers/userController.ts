import type { Request, Response } from "express";

import User = require("../models/User");
import { createActivityLog } from "../utils/activityLogger";

type UserRole = "admin" | "technician" | "viewer";

type AuthRequest = Request & {
  user?: {
    _id: string;
    name?: string;
    role?: string;
  };
};

type UserBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
};

const allowedRoles: UserRole[] = ["admin", "technician", "viewer"];

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error getting users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Create a new user
// @route   POST /api/users
export const createUser = async (
  req: AuthRequest & Request<unknown, unknown, UserBody>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

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
      role,
    });

    await createActivityLog({
      req,
      action: "USER_CREATED",
      entityType: "user",
      entityId: String(user._id),
      description: `Created user ${user.name} (${user.role}).`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
export const updateUserRole = async (
  req: AuthRequest & Request<{ id: string }, unknown, { role?: UserRole }>,
  res: Response,
): Promise<void> => {
  try {
    const { role } = req.body;

    if (!role || !allowedRoles.includes(role)) {
      res.status(400).json({
        message: "Invalid role",
      });
      return;
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const oldRole = user.role;

    user.role = role;

    await user.save();

    await createActivityLog({
      req,
      action: "USER_ROLE_UPDATED",
      entityType: "user",
      entityId: String(user._id),
      description: `Updated user ${user.name} role from ${oldRole} to ${role}.`,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating user role",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async (
  req: AuthRequest & Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    if (String(req.user._id) === req.params.id) {
      res.status(400).json({
        message: "You cannot delete your own user account",
      });
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    await createActivityLog({
      req,
      action: "USER_DELETED",
      entityType: "user",
      entityId: String(user._id),
      description: `Deleted user ${user.name} (${user.role}).`,
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
