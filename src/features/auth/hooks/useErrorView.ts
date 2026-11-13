import { useNavigate } from "react-router";
import { homePath } from "../../../routes/homePath";

// Tombol "Kembali" di halaman galat: kembali ke halaman awal sesuai izin.
export function useErrorView() {
  const navigate = useNavigate();

  const goHome = () => navigate(homePath(), { replace: true });

  return { goHome };
}
