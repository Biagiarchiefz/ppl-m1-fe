import { useState } from "react";
import { useNavigate } from "react-router";
import { logout as logoutRequest } from "../services/auth.service";
import { selectLogout, toast, useAuthStore } from "../../../store";

// Keluar dari sesi: token dicabut dulu di server (POST /auth/sessions/logout,
// masuk denylist sampai kedaluwarsa), baru sesi lokal dihapus dan pengguna
// diarahkan ke /login. Bila server gagal dihubungi, sesi lokal tetap dihapus.
export function useLogout() {
  const navigate = useNavigate();
  const clearSession = useAuthStore(selectLogout);
  const [pending, setPending] = useState(false);

  async function signOut(message?: string) {
    if (pending) return;
    setPending(true);
    const token = useAuthStore.getState().token;
    if (token) await logoutRequest(token).catch(() => undefined);
    clearSession();
    navigate("/login", { replace: true });
    if (message) toast.success(message);
  }

  return { signOut, pending };
}
