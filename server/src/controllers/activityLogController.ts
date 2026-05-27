import type { Request, Response } from "express";

import ActivityLog = require("../models/ActivityLog");

// @desc    Get activity logs
// @route   GET /api/activity-logs
export const getActivityLogs = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Error getting activity logs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
