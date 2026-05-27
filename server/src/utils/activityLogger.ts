import type { Request } from "express";

import ActivityLog = require("../models/ActivityLog");

type AuthRequest = Request & {
  user?: {
    _id?: string;
    name?: string;
    role?: string;
  };
};

type CreateActivityLogParams = {
  req: AuthRequest;
  action: string;
  entityType: "machine" | "maintenance" | "auth" | "user";
  entityId?: string;
  machineCode?: string;
  machineName?: string;
  description: string;
};

// Creates an activity log record
export async function createActivityLog({
  req,
  action,
  entityType,
  entityId = "",
  machineCode = "",
  machineName = "",
  description,
}: CreateActivityLogParams): Promise<void> {
  try {
    await ActivityLog.create({
      user: req.user?._id || null,
      userName: req.user?.name || "System",
      userRole: req.user?.role || "system",
      action,
      entityType,
      entityId,
      machineCode,
      machineName,
      description,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Activity log error:", error.message);
    } else {
      console.error("Activity log error:", error);
    }
  }
}
