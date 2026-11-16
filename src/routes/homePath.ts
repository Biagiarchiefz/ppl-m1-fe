import { isSuperAdmin, useAuthStore } from "../store";

// Halaman awal: super admin ke dashboard pengelolaan, pengguna lain ke profil.
export function homePath(): string {
  const { user } = useAuthStore.getState();
  if (!user) return "/login";
  return isSuperAdmin(user) ? "/admin" : "/profile";
}
