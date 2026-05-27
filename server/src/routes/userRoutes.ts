import express from "express";

import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController";

import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// Only admin can manage users
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.post("/", protect, authorizeRoles("admin"), createUser);
router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
