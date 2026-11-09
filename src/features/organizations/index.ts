import { apiList, apiRequest } from "../../services/api";

export interface Organization {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateOrganizationInput {
  code: string;
  name: string;
  admin: { name: string; email: string; password: string };
}

export function listOrganizations(params: { page: number; q?: string; is_active?: boolean }) {
  return apiList<Organization>("/organizations", { ...params });
}

export function createOrganization(input: CreateOrganizationInput) {
  return apiRequest<Organization & { admin: { id: number; email: string } }>("/organizations", {
    method: "POST",
    body: input,
  });
}

export function renameOrganization(id: number, name: string) {
  return apiRequest<Organization>(`/organizations/${id}`, { method: "PATCH", body: { name } });
}

export function deactivateOrganization(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/organizations/${id}`, { method: "DELETE" });
}

export function activateOrganization(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/organizations/${id}/status`, { method: "PATCH", body: { is_active: true } });
}

// Hapus permanen organisasi nonaktif beserta pengguna, peran, dan divisinya.
// Audit log organisasi tetap tersimpan dan tampil di audit log platform.
export function deleteOrganization(id: number) {
  return apiRequest<{ id: number; deleted: boolean }>(`/organizations/${id}/permanent`, { method: "DELETE" });
}
