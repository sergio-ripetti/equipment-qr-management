import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { getSavedUser } from "../utils/authStorage";
import type { UserRole } from "../types";

type RoleRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

export default function RoleRoute({
  children,
  allowedRoles = [],
}: RoleRouteProps) {
  const user = getSavedUser();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}