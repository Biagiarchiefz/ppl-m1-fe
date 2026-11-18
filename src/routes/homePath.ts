import { isSuperAdmin, useAuthStore } from "../store";
import type { Me } from "../types";

// Rute yang hanya boleh dibuka super admin (sama dengan grup ProtectedRoute superAdminOnly).
const SUPER_ADMIN_PREFIXES = ["/admin", "/platform"];
// Halaman yang tidak masuk akal dijadikan tujuan setelah login.
const NON_TARGETS = ["/login", "/forbidden"];

// Halaman awal: super admin ke dashboard pengelolaan, pengguna lain ke profil.
export function homePath(): string {
  const { user } = useAuthStore.getState();
  if (!user) return "/login";
  return isSuperAdmin(user) ? "/admin" : "/profile";
}

const matches = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

/**
 * Mengambil path tujuan dari history state/URL. state bisa berupa string atau
 * objek location (sesi lama atau halaman lain), jadi tipenya diperiksa dulu.
 */
export function targetFrom(state: unknown, next: string | null): string | null {
  const from = (state as { from?: unknown } | null)?.from;
  if (typeof from === "string") return from;
  if (from && typeof from === "object" && typeof (from as { pathname?: unknown }).pathname === "string") {
    const { pathname, search } = from as { pathname: string; search?: unknown };
    return pathname + (typeof search === "string" ? search : "");
  }
  return next;
}

/**
 * Tujuan setelah login: halaman yang tadi ingin dibuka, bila aman dan boleh
 * diakses akun ini; selain itu halaman awal (bukan 403).
 * Hanya path internal ("/..."), bukan "//host" atau URL lain (open redirect).
 */
export function redirectAfterLogin(target: string | null | undefined, user: Me): string {
  const home = isSuperAdmin(user) ? "/admin" : "/profile";
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.includes("\\")) return home;
  const path = target.split(/[?#]/)[0];
  if (NON_TARGETS.some((p) => matches(path, p)) || path === "/") return home;
  if (!isSuperAdmin(user) && SUPER_ADMIN_PREFIXES.some((p) => matches(path, p))) return home;
  return target;
}
