import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { queryClient } from "../../config/queryClient";
import type { AuthState } from "../../types";

const STORAGE_KEY = "auth_session";

// Penyimpanan sesi di sisi klien [ASUMSI PRD 11]. "Ingat saya" memakai
// localStorage; tanpa itu sessionStorage (hilang saat browser ditutup).
const rememberAwareStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const remember = (JSON.parse(value) as { state?: { remember?: boolean } }).state?.remember === true;
    (remember ? sessionStorage : localStorage).removeItem(name);
    (remember ? localStorage : sessionStorage).setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      remember: false,
      login: (token, user, remember) => {
        // Data milik akun sebelumnya tidak boleh terbawa ke akun baru.
        queryClient.clear();
        set({ token, user, remember });
      },
      logout: () => {
        set({ token: null, user: null, remember: false });
        useAuthStore.persist.clearStorage();
        queryClient.clear();
      },
    }),
    {
      name: STORAGE_KEY,
      // Versi 1: profil sesi kini dari GET /me (is_super_admin, tanpa daftar
      // izin). Sesi versi lama dibuang sehingga pengguna diminta login ulang.
      version: 1,
      migrate: () => ({ token: null, user: null, remember: false }),
      storage: createJSONStorage(() => rememberAwareStorage),
      partialize: ({ token, user, remember }) => ({ token, user, remember }),
    },
  ),
);
