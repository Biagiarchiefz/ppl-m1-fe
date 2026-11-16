import type { Theme } from "./theme.types";

// Preferensi tampilan dan notifikasi toast (store zustand global).

// Isi store `useUiStore`.
export interface UiState {
  theme: Theme;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export type ToastTone = "success" | "error";

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

// Isi store `useToastStore`.
export interface ToastState {
  toasts: Toast[];
  show: (tone: ToastTone, message: string) => void;
  dismiss: (id: number) => void;
}
