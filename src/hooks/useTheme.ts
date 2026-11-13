import { useState } from "react";
import type { Theme } from "../types";

// Tema awal dipasang oleh skrip di index.html: pilihan tersimpan, atau setelan
// sistem bila belum pernah memilih.
function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function saveTheme(theme: Theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Penyimpanan diblokir: tema tetap berlaku sampai halaman dimuat ulang.
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    saveTheme(next);
    setTheme(next);
  }

  return { theme, toggleTheme };
}
