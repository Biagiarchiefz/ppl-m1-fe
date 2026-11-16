import { apiList, apiRequest } from "../../../services/api";
import type { Division } from "../../../types";

export function listDivisions(params: { page?: number; per_page?: number; is_active?: boolean }) {
  return apiList<Division>("/divisions", { ...params });
}

export function createDivision(code: string, name: string) {
  return apiRequest<Division>("/divisions", { method: "POST", body: { code, name } });
}

export const divisionKeys = {
  all: ["divisions"] as const,
  list: (params: Parameters<typeof listDivisions>[0]) => ["divisions", "list", params] as const,
};
