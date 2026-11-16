import { apiList, apiRequest } from "../../../services/api";
import type { CreateRoleInput, Permission, Role, RolePermissions } from "../../../types";

export function listRoles(params: { page?: number; per_page?: number; is_active?: boolean }) {
  return apiList<Role>("/roles", { ...params });
}

// Katalog izin; per_page maksimal 100.
export function listPermissions() {
  return apiList<Permission>("/permissions", { per_page: 100 });
}

export function createRole(input: CreateRoleInput) {
  return apiRequest<Role>("/roles", { method: "POST", body: input });
}

export function getRolePermissions(id: number) {
  return apiRequest<RolePermissions>(`/roles/${id}/permissions`);
}

// Mengganti seluruh daftar izin peran; array kosong menghapus semua izin.
export function setRolePermissions(id: number, permissionCodes: string[]) {
  return apiRequest<RolePermissions>(`/roles/${id}/permissions`, {
    method: "PUT",
    body: { permission_codes: permissionCodes },
  });
}

export const roleKeys = {
  all: ["roles"] as const,
  list: (params: Parameters<typeof listRoles>[0]) => ["roles", "list", params] as const,
  permissions: ["roles", "permissions"] as const,
  rolePermissions: (id: number) => ["roles", "permissions", id] as const,
};
