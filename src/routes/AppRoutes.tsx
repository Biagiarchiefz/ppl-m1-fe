import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SignInPage from "../pages/Auth/SignInPage";
import Forbidden from "../pages/Auth/Forbidden";
import NotFound from "../pages/Auth/NotFound";
import ProfilePage from "../pages/User/ProfilePage";
import AdminDashboardPage from "../pages/Admin/DashboardPage";
import UsersPage from "../pages/Admin/UsersPage";
import RolesPage from "../pages/Admin/RolesPage";
import DivisionsPage from "../pages/Admin/DivisionsPage";
import AuditLogsPage from "../pages/Admin/AuditLogsPage";
import OrganizationsPage from "../pages/Platform/OrganizationsPage";
import ProtectedRoute from "./ProtectedRoute";
import { homePath } from "./homePath";
import { ADMIN_AREA_PERMS, PERM } from "../config/env";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={homePath()} replace />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        {/* Alamat lama, supaya tautan yang tersimpan tetap berfungsi. */}
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
        <Route path="/change-password" element={<Navigate to="/profile" replace />} />
      </Route>
      <Route element={<ProtectedRoute anyPermission={[PERM.organizationsManage]} />}>
        <Route path="/platform/organizations" element={<OrganizationsPage />} />
        <Route path="/platform/audit-logs" element={<AuditLogsPage scope="platform" />} />
      </Route>
      <Route element={<ProtectedRoute anyPermission={ADMIN_AREA_PERMS} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute anyPermission={[PERM.usersRead, PERM.usersManage]} />}>
        <Route path="/admin/users" element={<UsersPage />} />
      </Route>
      <Route element={<ProtectedRoute anyPermission={[PERM.rolesManage]} />}>
        <Route path="/admin/roles" element={<RolesPage />} />
      </Route>
      <Route element={<ProtectedRoute anyPermission={[PERM.divisionsManage]} />}>
        <Route path="/admin/divisions" element={<DivisionsPage />} />
      </Route>
      <Route element={<ProtectedRoute anyPermission={[PERM.auditRead]} />}>
        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
