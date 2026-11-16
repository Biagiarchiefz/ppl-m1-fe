import { apiList, apiRequest } from "../../../services/api";
import type { CreateUserInput, UpdateUserInput, User, UserFilter } from "../../../types";

export function listUsers(filter: UserFilter) {
  return apiList<User>("/users", { ...filter });
}

export function createUser(input: CreateUserInput) {
  return apiRequest<User>("/users", { method: "POST", body: input });
}

export function updateUser(id: number, input: UpdateUserInput) {
  return apiRequest<User>(`/users/${id}`, { method: "PATCH", body: input });
}

// Soft delete: akun dinonaktifkan, data historis tetap tersimpan.
export function deactivateUser(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/users/${id}`, { method: "DELETE" });
}

export function activateUser(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/users/${id}/status`, { method: "PATCH", body: { is_active: true } });
}

export const userKeys = {
  all: ["users"] as const,
  list: (filter: UserFilter) => ["users", "list", filter] as const,
};
