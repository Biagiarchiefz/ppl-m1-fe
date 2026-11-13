import { apiList, apiRequest } from "../../../services/api";
import type { Permission, Role, RoleInput } from "../../../types";

export function listRoles(params: { page?: number; per_page?: number; is_active?: boolean }) {
  return apiList<Role>("/roles", { ...params });
}

export function listPermissions() {
  return apiList<Permission>("/permissions");
}

export function createRole(input: RoleInput) {
  return apiRequest<Role>("/roles", { method: "POST", body: input });
}

// Kode peran tidak bisa diubah setelah dibuat.
export function updateRole(id: number, input: Omit<RoleInput, "code">) {
  return apiRequest<Role>(`/roles/${id}`, { method: "PATCH", body: input });
}

export function activateRole(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/roles/${id}/status`, { method: "PATCH", body: { is_active: true } });
}

export function deactivateRole(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/roles/${id}`, { method: "DELETE" });
}

export const roleKeys = {
  all: ["roles"] as const,
  list: (params: Parameters<typeof listRoles>[0]) => ["roles", "list", params] as const,
  permissions: ["roles", "permissions"] as const,
};
