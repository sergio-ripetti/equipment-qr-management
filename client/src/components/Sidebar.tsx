import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";
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
  const navigate = useNavigate();
  const user = getSavedUser();
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state

  const navLinkClass = ({ isActive }: NavLinkState) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/15 text-white"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  const handleLogout = () => {
    removeSavedUser();
    if (window.innerWidth < 1024) {
      onToggle(); // Close mobile menu
    }
    window.location.href = "/login";
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onToggle(); // Close menu on mobile after clicking a link
    }
  };

  const menuItems = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/machines", label: "Equipment List", icon: "📋" },
    ...(canCreateEquipment(user)
      ? [{ to: "/create", label: "New Equipment", icon: "➕" }]
      : []),
    ...(canAccessAdminTools(user)
      ? [{ to: "/activity-log", label: "Activity Log", icon: "📝" }]
      : []),
    ...(canAccessAdminTools(user)
      ? [{ to: "/users", label: "Users", icon: "👥" }]
      : []),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed
    left-0
    top-16
    h-[calc(100vh-4rem)]
    w-64
    bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-900
    text-white
    shadow-lg
    transform transition-transform duration-300 ease-in-out
    z-40
    flex flex-col
    lg:hidden
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}>
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-white/10 h-20">
          <img
            src="/logo-ripe.png"
            alt="Ripe Deli Equipment logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {user && canAccessPrivateApp(user) && (
            <>
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={navLinkClass}>
                  <span className="text-lg flex-shrink-0">{item.icon}</span>

                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User Card */}
        {user && canAccessPrivateApp(user) && (
          <div className="border-t border-white/10 p-3">
            <div className="rounded-lg bg-white/10 px-3 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold truncate">{user.name}</p>

                  <p className="text-xs text-blue-200 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/20 transition">
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
