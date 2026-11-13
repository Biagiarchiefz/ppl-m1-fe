import { apiList, apiRequest } from "../../../services/api";
import type { CreateOrganizationInput, Organization } from "../../../types";

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

export const organizationKeys = {
  all: ["organizations"] as const,
  list: (params: Parameters<typeof listOrganizations>[0]) => ["organizations", "list", params] as const,
};
