import { apiList, apiRequest } from "../../services/api";

export interface Role {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_system: boolean;
  is_active: boolean;
  permissions: string[];
  created_at: string;
}

export interface Permission {
  code: string;
  module: string;
  description: string;
}

export interface RoleInput {
  code?: string;
  name: string;
  description: string | null;
  permissions: string[];
}

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
