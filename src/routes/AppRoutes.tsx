import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import Forbidden from "../pages/Auth/Forbidden";
import AdminDashboardPage from "../pages/Admin/DashboardPage";
import UsersPage from "../pages/Admin/UsersPage";
import ProtectedRoute from "./ProtectedRoute";

const DashboardPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-neutral-bg">
    <h1 className="text-2xl font-bold text-text-default">Dashboard</h1>
  </main>
);

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<SignInPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;