import { memo } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = memo(function ThemeToggle({
  isDark,
  onToggle,
}: ThemeToggleProps) {
  return (
    <button
      className={`theme-toggle${isDark ? " dark" : ""}`}
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FiSun className="toggle-icon sun" />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <FiMoon className="toggle-icon moon" />
    </button>
  );
});

export default ThemeToggle;
