import { create } from "zustand";
import type { ToastState } from "../../types";

const DURATION_MS = 4000;
let nextId = 0;

// Notifikasi singkat di pojok layar; tetap terlihat walau pengguna pindah halaman.
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (tone, message) => {
    const id = ++nextId;
    set((s) => ({ toasts: [...s.toasts, { id, tone, message }] }));
    setTimeout(() => get().dismiss(id), DURATION_MS);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Bisa dipanggil dari mana saja, termasuk di luar komponen React:
// toast.success("Pengguna baru berhasil ditambahkan.")
export const toast = {
  success: (message: string) => useToastStore.getState().show("success", message),
  error: (message: string) => useToastStore.getState().show("error", message),
};
