import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Theme, UiState } from "../../types";

// Tema disimpan sebagai teks biasa di kunci "theme" karena skrip anti-kedip di
// index.html membacanya sebelum React berjalan. Karena itu tema tidak ikut
// `persist` (yang menyimpan JSON), melainkan ditulis langsung saat diganti.
const THEME_KEY = "theme";
// Kunci preferensi sidebar dari versi sebelum zustand.
const LEGACY_SIDEBAR_KEY = "sidebar_collapsed";

// Tema awal sudah dipasang di <html data-theme> oleh skrip di index.html.
function initialTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Penyimpanan diblokir: tema tetap berlaku sampai halaman dimuat ulang.
  }
}

function legacySidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(LEGACY_SIDEBAR_KEY) === "1";
  } catch {
    return false;
  }
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: initialTheme(),
      toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyTheme(next);
        set({ theme: next });
      },
      // Ciut/lebar sidebar hanya kenyamanan per peramban; bawaannya lebar.
      sidebarCollapsed: legacySidebarCollapsed(),
      toggleSidebar: () => {
        try {
          localStorage.removeItem(LEGACY_SIDEBAR_KEY);
        } catch {
          // abaikan: penyimpanan diblokir
        }
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }));
      },
    }),
    {
      name: "ui_prefs",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ sidebarCollapsed }) => ({ sidebarCollapsed }),
    },
  ),
);
