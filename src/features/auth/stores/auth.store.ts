import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { queryClient } from "../../../config/queryClient";
import type { AuthState, SessionUser } from "../../../types";

const STORAGE_KEY = "auth_session";

// Kunci dari versi sebelum zustand. Dibaca bila sesi baru belum ada, agar
// pengguna yang sudah login tidak tiba-tiba keluar setelah pembaruan.
const LEGACY_KEYS = { token: "auth_token", user: "auth_user", role: "auth_role" };

function readLegacySession(): string | null {
  for (const [storage, remember] of [[localStorage, true], [sessionStorage, false]] as const) {
    const token = storage.getItem(LEGACY_KEYS.token);
    const user = storage.getItem(LEGACY_KEYS.user);
    if (!token || !user) continue;
    try {
      return JSON.stringify({ state: { token, user: JSON.parse(user), remember }, version: 0 });
    } catch {
      return null;
    }
  }
  return null;
}

function clearLegacySession() {
  for (const storage of [localStorage, sessionStorage]) {
    Object.values(LEGACY_KEYS).forEach((key) => storage.removeItem(key));
  }
}

// Penyimpanan sesi di sisi klien [ASUMSI PRD 11]. "Ingat saya" memakai
// localStorage; tanpa itu sessionStorage (hilang saat browser ditutup).
const rememberAwareStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name) ?? readLegacySession(),
  setItem: (name, value) => {
    const remember = (JSON.parse(value) as { state?: { remember?: boolean } }).state?.remember === true;
    (remember ? sessionStorage : localStorage).removeItem(name);
    (remember ? localStorage : sessionStorage).setItem(name, value);
    clearLegacySession();
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
    clearLegacySession();
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
      storage: createJSONStorage(() => rememberAwareStorage),
      partialize: ({ token, user, remember }) => ({ token, user, remember }),
    },
  ),
);

// can: true bila pengguna memiliki salah satu izin `perms`. Hanya untuk
// menyembunyikan menu; hak akses tetap dijaga backend.
export function can(user: SessionUser | null, ...perms: string[]): boolean {
  return Boolean(user?.permissions?.some((p) => perms.includes(p)));
}
