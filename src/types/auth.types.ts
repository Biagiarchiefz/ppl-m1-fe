// Sesi, akun yang sedang login, dan form ubah kata sandi.

// Profil dari GET /me (klaim JWT). Backend tidak mengirim daftar izin;
// akses menu ditentukan dari `is_super_admin`.
export interface SessionUser {
  user_id: number;
  name: string;
  role: string;
  division: string | null;
  partner_id: number | null;
  unit_usaha_id: number | null;
  is_super_admin: boolean;
}

// POST /auth/login hanya mengembalikan token; profil diambil lewat GET /me.
export interface LoginResult {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export type Me = SessionUser;

export interface ChangePasswordForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

// Isi store zustand `useAuthStore`.
export interface AuthState {
  token: string | null;
  user: SessionUser | null;
  remember: boolean;
  login: (token: string, user: SessionUser, remember: boolean) => void;
  logout: () => void;
}
