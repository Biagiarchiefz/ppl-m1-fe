import { apiList, apiRequest } from "../../../services/api";
import type { Division } from "../../../types";

export function listDivisions(params: { page?: number; per_page?: number; is_active?: boolean }) {
  return apiList<Division>("/divisions", { ...params });
}

export function createDivision(code: string, name: string) {
  return apiRequest<Division>("/divisions", { method: "POST", body: { code, name } });
}

export function renameDivision(id: number, name: string) {
  return apiRequest<Division>(`/divisions/${id}`, { method: "PATCH", body: { name } });
}

export function activateDivision(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/divisions/${id}/status`, { method: "PATCH", body: { is_active: true } });
}

export function deactivateDivision(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/divisions/${id}`, { method: "DELETE" });
}

export const divisionKeys = {
  all: ["divisions"] as const,
  list: (params: Parameters<typeof listDivisions>[0]) => ["divisions", "list", params] as const,
};
