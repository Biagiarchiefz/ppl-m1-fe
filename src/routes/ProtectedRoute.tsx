import { Navigate, Outlet, useLocation } from "react-router";
import { can, useAuthStore } from "../features/auth/stores/auth.store";

interface ProtectedRouteProps {
  // Lolos bila pengguna memiliki salah satu izin ini.
  anyPermission?: string[];
}

// Menu dan rute disembunyikan di UI berdasarkan izin di token, tetapi hak
// akses tetap dijaga backend (403 FORBIDDEN).
const ProtectedRoute = ({ anyPermission }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (anyPermission && !can(user, ...anyPermission)) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
