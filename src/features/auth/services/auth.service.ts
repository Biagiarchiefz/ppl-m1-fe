import { apiRequest } from "../../../services/api";
import type { LoginResult, Me } from "../../../types";

export function login(email: string, password: string) {
  return apiRequest<LoginResult>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

// token diisi saat dipanggil tepat setelah login, sebelum sesi disimpan.
export function getMe(token?: string) {
  return apiRequest<Me>("/me", token ? { token } : {});
}

// Token dikirim eksplisit karena sesi lokal langsung dihapus; auth: false agar
// 401 (token kedaluwarsa) tidak memicu logout/redirect ganda.
export function logout(token: string) {
  return apiRequest<null>("/auth/sessions/logout", { method: "POST", auth: false, token });
}

export function changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
  return apiRequest<{ changed_at: string }>("/auth/change-password", {
    method: "POST",
    body: { old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword },
  });
}

export const authKeys = {
  me: ["auth", "me"] as const,
};
