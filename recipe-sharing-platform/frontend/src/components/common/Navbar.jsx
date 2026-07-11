import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiPlus } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-primary-600" : "text-gray-600 dark:text-gray-300 hover:text-primary-600"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
            <span className="text-2xl">🍲</span>
            <span>
              Recipe<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>

            <ThemeSwitcher />

            {isAuthenticated ? (
              <>
                <Link
                  to="/recipes/create"
                  className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  <FiPlus size={16} /> New Recipe
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-600 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium">{user?.name?.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 transition"
                  title="Logout"
                >
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeSwitcher />
            <button
              className="text-gray-600 dark:text-gray-300 text-2xl"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 pt-4 animate-fadeIn">
            <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)} end>
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <Link
                  to="/recipes/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-600"
                >
                  <FiPlus size={16} /> New Recipe
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  <FiUser size={16} /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 text-left"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-primary-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
