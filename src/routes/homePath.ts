import { ADMIN_AREA_PERMS, PERM } from "../config/env";
import { can, getSessionUser } from "../features/auth/auth.Slice";

// Halaman awal sesuai izin: super admin ke daftar organisasi, pengelola
// organisasi ke /admin, pengguna lain ke profil.
export function homePath(): string {
  const user = getSessionUser();
  if (!user) return "/login";
  if (can(user, PERM.organizationsManage)) return "/platform/organizations";
  if (can(user, ...ADMIN_AREA_PERMS)) return "/admin";
  return "/profile";
}
