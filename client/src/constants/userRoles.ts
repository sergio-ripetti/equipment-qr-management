import type { UserRole } from "../types";

export const USER_ROLES = {
  ADMIN: "admin",
  TECHNICIAN: "technician",
  VIEWER: "viewer",
} as const satisfies Record<string, UserRole>;
