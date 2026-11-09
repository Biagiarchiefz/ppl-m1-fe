import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "text-text-muted hover:bg-neutral-soft" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button type="button" onClick={toggleTheme} aria-label={label} title={label} className={`flex size-9 items-center justify-center rounded-field ${className}`}>
      <Icon size={18} strokeWidth={1.8} aria-hidden />
    </button>
  );
};

export default ThemeToggle;
