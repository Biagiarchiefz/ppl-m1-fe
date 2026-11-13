// Sesi, akun yang sedang login, dan form ubah kata sandi.

export interface SessionUser {
  user_id: number;
  name: string;
  organization_id: number | null;
  role: string;
  permissions: string[];
  division: string | null;
  unit_usaha_id: number | null;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: SessionUser;
}

export interface Me extends SessionUser {
  email: string;
  organization_name: string | null;
  is_active: boolean;
}

export interface ChangePasswordForm {
  old_password: string;
  new_password: string;
  confirmation: string;
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
