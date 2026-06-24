import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/solid";

import { getSavedUser } from "../utils/authStorage";
import { canAccessPrivateApp } from "../utils/permissionHelpers";

type NavbarProps = {
  onMenuOpen: () => void;
};

export default function Navbar({ onMenuOpen }: NavbarProps) {
  const navigate = useNavigate();
  const user = getSavedUser();

  return (
    <nav className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 text-white shadow-lg">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link
          to={user ? "/" : "/login"}
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <img
            src="/logo-ripe.png"
            alt="Ripe Deli Equipment logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Hamburger menu button (mobile) */}
        {user && canAccessPrivateApp(user) && (
          <button
            type="button"
            onClick={onMenuOpen}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Open sidebar menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        )}

        {/* Desktop login link - for non-authenticated users */}
        {!user && (
          <Link
            to="/login"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}