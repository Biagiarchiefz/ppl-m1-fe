import { apiList, apiRequest } from "../../services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  division: string | null;
  unit_usaha_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Reference {
  code: string;
  name: string;
}

export interface UserFilter {
  page: number;
  per_page?: number;
  q?: string;
  role?: string;
  division?: string;
  is_active?: boolean;
  sort?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  division: string | null;
  unit_usaha_id: number | null;
}

export type UpdateUserInput = Partial<Omit<CreateUserInput, "email" | "password">>;

export function listUsers(filter: UserFilter) {
  return apiList<User>("/users", { ...filter });
}

export function createUser(input: CreateUserInput) {
  return apiRequest<User>("/users", { method: "POST", body: input });
}

export function updateUser(id: number, input: UpdateUserInput) {
  return apiRequest<User>(`/users/${id}`, { method: "PATCH", body: input });
}

export function deactivateUser(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/users/${id}`, { method: "DELETE" });
}

export function activateUser(id: number) {
  return apiRequest<{ id: number; is_active: boolean }>(`/users/${id}/status`, { method: "PATCH", body: { is_active: true } });
}

// Hapus permanen akun yang sudah nonaktif. Audit log akun tetap tersimpan.
export function deleteUser(id: number) {
  return apiRequest<{ id: number; deleted: boolean }>(`/users/${id}/permanent`, { method: "DELETE" });
}
