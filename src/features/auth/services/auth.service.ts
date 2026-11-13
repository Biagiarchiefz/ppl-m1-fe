import { apiRequest } from "../../../services/api";
import type { LoginResult, Me } from "../../../types";

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

export const authKeys = {
  me: ["auth", "me"] as const,
};
