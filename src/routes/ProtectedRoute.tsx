import { Navigate, Outlet, useLocation } from "react-router";
import { isSuperAdmin, selectToken, selectUser, useAuthStore } from "../store";

interface ProtectedRouteProps {
  // true: hanya super admin yang boleh membuka rute ini.
  superAdminOnly?: boolean;
}

// Rute disembunyikan di UI berdasarkan `is_super_admin` dari GET /me, tetapi
// hak akses tetap dijaga backend (403 FORBIDDEN).
const ProtectedRoute = ({ superAdminOnly = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = useAuthStore(selectToken);
  const user = useAuthStore(selectUser);

  if (!token || !user) {
    // Belum login (atau sesi sudah dihapus): ke halaman login, bukan 403.
    // Alamat tujuan disimpan agar setelah login pengguna kembali ke sini.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (superAdminOnly && !isSuperAdmin(user)) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
