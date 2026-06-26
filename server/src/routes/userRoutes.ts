import express from "express";

import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController";

import { protect, authorizeRoles } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";

const router = express.Router();

// Only admin can manage users
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validate([
    { field: "name", required: true, minLength: 2, maxLength: 100 },
    { field: "email", required: true, isEmail: true, maxLength: 254 },
    { field: "password", required: true, minLength: 6, maxLength: 128 },
    { field: "role", required: true, allowedValues: ["admin", "technician", "viewer"] },
  ]),
  createUser,
);
router.put(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  validate([
    { field: "role", required: true, allowedValues: ["admin", "technician", "viewer"] },
  ]),
  updateUserRole,
);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
