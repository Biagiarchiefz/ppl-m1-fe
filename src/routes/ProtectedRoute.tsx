import { Navigate, Outlet, useLocation } from "react-router";
import { can, getSessionUser, getToken } from "../features/auth/auth.Slice";

interface ProtectedRouteProps {
  // Lolos bila pengguna memiliki salah satu izin ini.
  anyPermission?: string[];
}

// Menu dan rute disembunyikan di UI berdasarkan izin di token, tetapi hak
// akses tetap dijaga backend (403 FORBIDDEN).
const ProtectedRoute = ({ anyPermission }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = getSessionUser();

  if (!getToken() || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (anyPermission && !can(user, ...anyPermission)) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
