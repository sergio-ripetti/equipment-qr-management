import { useState } from "react";
import { NavLink } from "react-router-dom";
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

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const user = getSavedUser();

  const navLinkClass = ({ isActive }: NavLinkState) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/15 text-white"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  const handleLogout = () => {
    removeSavedUser();
    onToggle();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Backdrop/Overlay - mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-900 text-white shadow-lg transform transition-transform duration-700 ease-in-out z-40 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:h-screen lg:w-56 lg:transform-none lg:transition-none`}
      >
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-white/10">
          <img
            src="/logo-ripe.png"
            alt="Ripe Deli Equipment logo"
            className="h-8 w-auto object-contain"
          />
          <button
            type="button"
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {/* Top line */}
              <line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
                className="rotate-45 translate-y-2 transition-transform duration-700"
                style={{ transformOrigin: "center" }}
              />
              {/* Middle line */}
              <line x1="4" y1="12" x2="20" y2="12" className="opacity-0 transition-opacity duration-700" />
              {/* Bottom line */}
              <line
                x1="4"
                y1="18"
                x2="20"
                y2="18"
                className="-rotate-45 -translate-y-2 transition-transform duration-700"
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {user && canAccessPrivateApp(user) && (
            <>
              <NavLink to="/" onClick={onToggle} className={navLinkClass}>
                <span>🏠</span>
                <span>Home</span>
              </NavLink>

              <NavLink to="/dashboard" onClick={onToggle} className={navLinkClass}>
                <span>📊</span>
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/machines" onClick={onToggle} className={navLinkClass}>
                <span>📋</span>
                <span>Equipment List</span>
              </NavLink>

              {canCreateEquipment(user) && (
                <NavLink to="/create" onClick={onToggle} className={navLinkClass}>
                  <span>➕</span>
                  <span>New Equipment</span>
                </NavLink>
              )}

              {canAccessAdminTools(user) && (
                <NavLink to="/activity-log" onClick={onToggle} className={navLinkClass}>
                  <span>📝</span>
                  <span>Activity Log</span>
                </NavLink>
              )}

              {canAccessAdminTools(user) && (
                <NavLink to="/users" onClick={onToggle} className={navLinkClass}>
                  <span>👥</span>
                  <span>Users</span>
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* User card - sticky to bottom */}
        {user && canAccessPrivateApp(user) && (
          <div className="border-t border-white/10 p-4">
            <div className="rounded-lg bg-white/10 px-3 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-blue-200 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
