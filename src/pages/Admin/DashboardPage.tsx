import { useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getSessionUser } from "../../features/auth/auth.Slice";

const DashboardPage = () => {
  const user = getSessionUser();

  useEffect(() => {
    document.title = "Dashboard Admin";
  }, []);

  return (
    <AdminLayout>
      <div className="p-7">
        <h1 className="font-body text-[32px] font-semibold leading-10 text-text-default">
          Dashboard - Admin
        </h1>
        <p className="mt-1 text-sm leading-[22px] text-text-muted">
          Selamat datang, {user?.name ?? "Administrator"}.
        </p>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
