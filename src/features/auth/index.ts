import { apiRequest } from "../../services/api";
import type { SessionUser } from "./auth.Slice";

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

export function login(email: string, password: string) {
  return apiRequest<LoginResult>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function getMe() {
  return apiRequest<Me>("/me");
}

export function changePassword(oldPassword: string, newPassword: string) {
  return apiRequest<{ changed_at: string }>("/auth/change-password", {
    method: "POST",
    body: { old_password: oldPassword, new_password: newPassword },
  });
}
