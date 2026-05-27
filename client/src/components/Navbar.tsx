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

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Gets logged user from localStorage
  const user = getSavedUser();

  const navLinkClass = ({ isActive }: NavLinkState) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/15 text-white"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Logs out the current user
  const handleLogout = () => {
    removeSavedUser();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 text-white shadow-lg">
      <div className="w-[92%] max-w-6xl mx-auto">
        <div className="flex min-h-16 items-center justify-between gap-4">
          {/* App logo / title */}
          <Link
            to={user ? "/" : "/login"}
            onClick={closeMenu}
            className="flex items-center gap-3 hover:opacity-90 transition"
          >
            <img
              src="/logo-ripe.png"
              alt="Ripe Deli Equipment logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop navigation */}
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

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg bg-white/10 p-2 hover:bg-white/20 transition"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            {user ? (
              <div className="space-y-4">
                {/* Compact user row */}
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>

                    <p className="text-xs text-blue-200 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 transition"
                  >
                    Logout
                  </button>
                </div>

                {/* Mobile links */}
                {canAccessPrivateApp(user) && (
                  <div className="grid gap-1">
                    <NavLink
                      to="/"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Home
                    </NavLink>

                    <NavLink
                      to="/dashboard"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/machines"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Equipment List
                    </NavLink>

                    {canCreateEquipment(user) && (
                      <NavLink
                        to="/create"
                        onClick={closeMenu}
                        className={navLinkClass}
                      >
                        New Equipment
                      </NavLink>
                    )}

                    {canAccessAdminTools(user) && (
                      <NavLink
                        to="/activity-log"
                        onClick={closeMenu}
                        className={navLinkClass}
                      >
                        Activity Log
                      </NavLink>
                    )}

                    {canAccessAdminTools(user) && (
                      <NavLink
                        to="/users"
                        onClick={closeMenu}
                        className={navLinkClass}
                      >
                        Users
                      </NavLink>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" onClick={closeMenu} className={navLinkClass}>
                Login
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}