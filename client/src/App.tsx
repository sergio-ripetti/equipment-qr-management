import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MachineList from "./pages/MachineList";
import MachineDetail from "./pages/MachineDetail";
import CreateMachine from "./pages/CreateMachine";
import EditMachine from "./pages/EditMachine";
import PublicMachineDetail from "./pages/PublicMachineDetail";
import NotFound from "./pages/NotFound";
import ActivityLog from "./pages/ActivityLog";
import UserManagement from "./pages/UserManagement";

import { USER_ROLES } from "./constants/userRoles";

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hides the main private navbar on public QR pages
  const isPublicRoute = location.pathname.startsWith("/public");
  // Hide navbar and sidebar on login page
  const isLoginPage = location.pathname === "/login";

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen">
      {/* Sidebar - overlay on mobile only, hidden on desktop */}
      {!isPublicRoute && !isLoginPage && (
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        {!isPublicRoute && !isLoginPage && (
          <Navbar sidebarOpen={sidebarOpen} onMenuToggle={toggleSidebar} />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Public QR route */}
            <Route
              path="/public/machine/:id"
              element={<PublicMachineDetail />}
            />

            {/* Private routes */}
            <Route
              path="/"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.ADMIN,
                    USER_ROLES.TECHNICIAN,
                    USER_ROLES.VIEWER,
                  ]}>
                  <Home />
                </RoleRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.ADMIN,
                    USER_ROLES.TECHNICIAN,
                    USER_ROLES.VIEWER,
                  ]}>
                  <Dashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/machines"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.ADMIN,
                    USER_ROLES.TECHNICIAN,
                    USER_ROLES.VIEWER,
                  ]}>
                  <MachineList />
                </RoleRoute>
              }
            />

            <Route
              path="/machine/:id"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.ADMIN,
                    USER_ROLES.TECHNICIAN,
                    USER_ROLES.VIEWER,
                  ]}>
                  <MachineDetail />
                </RoleRoute>
              }
            />

            <Route
              path="/machine/:id/edit"
              element={
                <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <EditMachine />
                </RoleRoute>
              }
            />

            <Route
              path="/create"
              element={
                <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <CreateMachine />
                </RoleRoute>
              }
            />

            <Route
              path="/users"
              element={
                <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <UserManagement />
                </RoleRoute>
              }
            />

            <Route
              path="/activity-log"
              element={
                <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <ActivityLog />
                </RoleRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
