import express from "express";

import { getActivityLogs } from "../controllers/activityLogController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// Only admin can view activity logs
router.get("/", protect, authorizeRoles("admin"), getActivityLogs);

export default router;
