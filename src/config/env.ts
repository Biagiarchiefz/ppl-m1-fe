// Base URL API M1. Saat development, Vite mem-proxy `/api` ke backend
// (lihat vite.config.ts), jadi nilai bawaan cukup path relatif.
// Untuk deploy, isi VITE_API_BASE_URL, misalnya https://server/api/m1/v1
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "/api/m1/v1";

export const SUPER_ADMIN_ROLE = "superadmin";

// Kode izin M1 (sama dengan backend internal/usecase/utils/permissions.go).
export const PERM = {
  organizationsManage: "platform.organizations.manage",
  usersRead: "m1.users.read",
  usersManage: "m1.users.manage",
  rolesManage: "m1.roles.manage",
  divisionsManage: "m1.divisions.manage",
  auditRead: "m1.audit.read",
} as const;

// Izin yang membuka area pengelolaan organisasi (/admin).
export const ADMIN_AREA_PERMS: string[] = [
  PERM.usersRead,
  PERM.usersManage,
  PERM.rolesManage,
  PERM.divisionsManage,
  PERM.auditRead,
];
