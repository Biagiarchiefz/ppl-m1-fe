import type { AuthState, SessionUser } from "../../types";

// Selector untuk useAuthStore, mis. `useAuthStore(selectUser)`, agar komponen
// hanya render ulang saat bagian state yang dipakai berubah.
export const selectUser = (s: AuthState) => s.user;
export const selectToken = (s: AuthState) => s.token;
export const selectLogin = (s: AuthState) => s.login;
export const selectLogout = (s: AuthState) => s.logout;

// Semua menu pengelolaan M1 khusus super admin (role admin biasa sudah
// dihapus). Hanya untuk menyembunyikan menu; hak akses tetap dijaga backend.
export function isSuperAdmin(user: SessionUser | null): boolean {
  return user?.is_super_admin === true;
}
