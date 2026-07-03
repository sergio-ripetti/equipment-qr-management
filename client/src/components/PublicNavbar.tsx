import { Link, useNavigate } from "react-router-dom";

import { getSavedUser, removeSavedUser } from "../utils/authStorage";
import { canAccessPrivateApp } from "../utils/permissionHelpers";

type PublicNavbarProps = {
  privateMachinePath?: string;
};

export default function PublicNavbar({
  privateMachinePath = "/dashboard",
}: PublicNavbarProps) {
  const navigate = useNavigate();

  // Gets logged user from sessionStorage
  const user = getSavedUser();

  const canOpenPrivateView = user && canAccessPrivateApp(user);

  // Logs out the current user
  const handleLogout = () => {
    removeSavedUser();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 text-white shadow-md">
      <div className="w-[92%] max-w-6xl mx-auto py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Public app logo */}
          <Link
            to="/login"
            className="flex items-center gap-3 hover:opacity-90 transition">
            <img
              src="/logo-ripe.png"
              alt="Ripe Deli Equipment logo"
              className="h-9 sm:h-10 max-w-[190px] sm:max-w-[240px] object-contain"
            />
          </Link>

          {/* If user is logged in, show private access */}
          {canOpenPrivateView ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold leading-none">
                  {user.name}
                </p>

                <p className="text-xs text-blue-200 capitalize mt-1">
                  {user.role}
                </p>
              </div>

              <Link
                to={privateMachinePath}
                className="rounded-lg bg-white/10 border border-white/20 px-3 sm:px-4 py-2 text-sm font-medium hover:bg-white/20 transition">
                Open app
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex rounded-lg bg-white/10 border border-white/20 px-3 sm:px-4 py-2 text-sm font-medium hover:bg-white/20 transition">
                Logout
              </button>
            </div>
          ) : (
            <Link
              to={`/login?redirect=${encodeURIComponent(privateMachinePath)}`}
              className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
