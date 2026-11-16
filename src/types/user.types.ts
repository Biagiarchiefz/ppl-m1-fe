// Akun pengguna: data dari backend, filter, input, dan state halaman.

export interface User {
  id: number;
  name: string;
  email: string;
  role: string | null;
  division: string | null;
  partner_id: number | null;
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
  partner_id?: number;
  is_active?: boolean;
  sort?: string;
}

export interface CreateUserInput {
  partner_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  division: string;
  unit_usaha_id: number | null;
}

// Email dan partner_id tidak bisa diubah. unit_usaha_id tidak boleh null
// di endpoint ubah, jadi field kosong tidak dikirim.
export interface UpdateUserInput {
  name?: string;
  role?: string;
  division?: string;
  unit_usaha_id?: number;
}

export interface UserFormState {
  partner_id: string;
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
  | null;
