import { USER_ROLES } from "../constants/userRoles";
import type { AuthUser } from "../types";

type OptionalUser = AuthUser | null | undefined;

// Checks if the user is admin
export function isAdmin(user: OptionalUser): boolean {
  return user?.role === USER_ROLES.ADMIN;
}

// Checks if the user is technician
export function isTechnician(user: OptionalUser): boolean {
  return user?.role === USER_ROLES.TECHNICIAN;
}

// Checks if the user is viewer
export function isViewer(user: OptionalUser): boolean {
  return user?.role === USER_ROLES.VIEWER;
}

// Admin, technician, and viewer can access the internal app.
// Viewer has read-only access.
export function canAccessPrivateApp(user: OptionalUser): boolean {
  if (!user?.role) return false;
  return [USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.VIEWER].includes(
    user.role,
  );
}

// Admin can create equipment
export function canCreateEquipment(user: OptionalUser): boolean {
  return isAdmin(user);
}

// Admin can edit equipment
export function canEditEquipment(user: OptionalUser): boolean {
  return isAdmin(user);
}

// Only admin can delete equipment
export function canDeleteEquipment(user: OptionalUser): boolean {
  return isAdmin(user);
}

// Admin and technician can add maintenance
export function canAddMaintenance(user: OptionalUser): boolean {
  return isAdmin(user) || isTechnician(user);
}

// Admin and technician can edit maintenance
export function canEditMaintenance(user: OptionalUser): boolean {
  return isAdmin(user) || isTechnician(user);
}

// Only admin can delete maintenance
export function canDeleteMaintenance(user: OptionalUser): boolean {
  return isAdmin(user);
}

// Admin and technician can download or print QR codes
export function canManageQr(user: OptionalUser): boolean {
  return isAdmin(user) || isTechnician(user);
}

// Only admin can access admin tools
export function canAccessAdminTools(user: OptionalUser): boolean {
  return isAdmin(user);
}

