import { useState, useRef, useEffect } from "react";
import { FiDroplet, FiCheck, FiSun, FiMoon } from "react-icons/fi";
import useTheme from "../../hooks/useTheme";
import { THEMES } from "../../utils/constants";

const ThemeSwitcher = () => {
  const { theme, setTheme, isDark, toggleDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="flex items-center gap-2" ref={dropdownRef}>
      {/* Quick dark/light toggle */}
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 transition"
        aria-label="Toggle dark mode"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
      </button>

      {/* Color theme dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 transition text-sm font-medium"
          aria-label="Change color theme"
          title="Change color theme"
        >
          <FiDroplet size={16} />
          <span
            className="w-3.5 h-3.5 rounded-full border border-white dark:border-gray-800 shadow-sm shrink-0"
            style={{ backgroundColor: activeTheme.swatch }}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-fadeIn">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 py-1.5">
              Color Theme
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 shrink-0"
                  style={{ backgroundColor: t.swatch }}
                />
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">{t.name}</span>
                {theme === t.id && <FiCheck className="text-primary-600" size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
