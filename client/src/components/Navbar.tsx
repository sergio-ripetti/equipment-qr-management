import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

import { getSavedUser, removeSavedUser } from "../utils/authStorage";
import {
  canAccessPrivateApp,
  canCreateEquipment,
  canAccessAdminTools,
} from "../utils/permissionHelpers";

type NavLinkState = {
  isActive: boolean;
};

type NavbarProps = {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
};

export default function Navbar({ sidebarOpen, onMenuToggle }: NavbarProps) {
  const navigate = useNavigate();
  const user = getSavedUser();

  const navLinkClass = ({ isActive }: NavLinkState) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/15 text-white"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  const handleLogout = () => {
    removeSavedUser();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 text-white shadow-lg">
      <div className="w-[92%] max-w-6xl mx-auto">
        <div className="flex min-h-16 items-center justify-between gap-4">
          {/* Mobile: Hamburger button on LEFT */}
          {user && canAccessPrivateApp(user) && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Toggle sidebar menu"
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Logo: on RIGHT in mobile, LEFT in desktop */}
          <Link
            to={user ? "/" : "/login"}
            className="flex items-center gap-3 hover:opacity-90 transition lg:order-none"
          >
            <img
              src="/logo-ripe.png"
              alt="Ripe Deli Equipment logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop navigation (hidden on mobile) */}
          {user && canAccessPrivateApp(user) && (
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/machines" className={navLinkClass}>
                Equipment List
              </NavLink>

              {canCreateEquipment(user) && (
                <NavLink to="/create" className={navLinkClass}>
                  New Equipment
                </NavLink>
              )}

              {canAccessAdminTools(user) && (
                <NavLink to="/activity-log" className={navLinkClass}>
                  Activity Log
                </NavLink>
              )}

              {canAccessAdminTools(user) && (
                <NavLink to="/users" className={navLinkClass}>
                  Users
                </NavLink>
              )}
            </div>
          )}

          {/* Desktop user info and logout */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              <div className="rounded-full bg-white/10 px-4 py-2 text-right">
                <p className="text-sm font-semibold leading-none">
                  {user.name}
                </p>

                <p className="text-xs text-blue-200 capitalize mt-1">
                  {user.role}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}