import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import PageLoader from "../components/common/PageLoader/PageLoader";
import ProtectedRoute from "./ProtectedRoute";
import { homePath } from "./homePath";
import { ADMIN_AREA_PERMS, PERM } from "../config/env";

// Lazy-load per halaman: kode tiap halaman diunduh saat pertama kali dibuka,
// jadi halaman login tidak ikut memuat kode dashboard, tabel, dan form admin.
const SignInPage = lazy(() => import("../pages/Auth/SignInPage"));
const Forbidden = lazy(() => import("../pages/Auth/Forbidden"));
const NotFound = lazy(() => import("../pages/Auth/NotFound"));
const ProfilePage = lazy(() => import("../pages/User/ProfilePage"));
const AdminDashboardPage = lazy(() => import("../pages/Admin/DashboardPage"));
const UsersPage = lazy(() => import("../pages/Admin/UsersPage"));
const RolesPage = lazy(() => import("../pages/Admin/RolesPage"));
const DivisionsPage = lazy(() => import("../pages/Admin/DivisionsPage"));
const AuditLogsPage = lazy(() => import("../pages/Admin/AuditLogsPage"));
const OrganizationsPage = lazy(() => import("../pages/Platform/OrganizationsPage"));

const AppRoutes = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  </BrowserRouter>
);

export default AppRoutes;
