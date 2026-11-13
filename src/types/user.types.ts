// Pengguna organisasi: data dari backend, filter, input, dan state halaman.

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

export interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: string;
  division: string;
  unit_usaha_id: string;
}

export type UserDialog =
  | { kind: "create" }
  | { kind: "edit"; user: User }
  | { kind: "deactivate"; user: User }
  | { kind: "activate"; user: User }
  | { kind: "delete"; user: User }
  | null;
