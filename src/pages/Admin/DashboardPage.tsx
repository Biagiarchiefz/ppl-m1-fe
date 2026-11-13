import { useEffect } from "react";
import { ArrowRight, FolderTree, Shield, UserCheck, Users } from "lucide-react";
import { Link } from "react-router";
import AdminLayout from "./AdminLayout";
import hubBanner from "../../assets/dashboard/hub-banner.svg";
import StatCard from "../../features/dashboard/components/StatCard";
import RecentActivity from "../../features/dashboard/components/RecentActivity";
import UserStatusBar from "../../features/dashboard/components/UserStatusBar";
import QuickLinks from "../../features/dashboard/components/QuickLinks";
import { fetchDashboardStats, type DashboardAccess } from "../../features/dashboard";
import { can, getSessionUser } from "../../features/auth/auth.Slice";
import { PERM } from "../../config/env";
import { useAsync } from "../../hooks/useAsync";

const today = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const DashboardPage = () => {
  const user = getSessionUser();
  const access: DashboardAccess = {
    users: can(user, PERM.usersRead, PERM.usersManage),
    roles: can(user, PERM.rolesManage),
    divisions: can(user, PERM.divisionsManage),
    audit: can(user, PERM.auditRead),
  };
  const { data, loading } = useAsync(fetchDashboardStats, access);

  useEffect(() => {
    document.title = "Dashboard — Araya Business Hub";
  }, []);

  const firstName = user?.name.trim().split(/\s+/)[0] ?? "Administrator";

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Pita biru tua: satu-satunya momen gelap di halaman ini. */}
        <section className="relative overflow-hidden rounded-card bg-band px-5 py-6 sm:px-7 sm:py-7">
          <img
            src={hubBanner}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-10 -bottom-6 hidden w-[340px] max-w-none opacity-90 sm:block"
          />
          <div className="relative max-w-xl">
            <p className="text-xs font-semibold tracking-[0.06em] text-brand-light uppercase">{today.format(new Date())}</p>
            <h1 className="mt-2 text-2xl leading-tight font-medium text-text-on-dark sm:text-[28px]">
              Selamat datang, {firstName}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-text-on-dark-muted">
              Ringkasan pengguna, peran, dan aktivitas akses di organisasi Anda.
            </p>
            {access.users && (
              <Link
                to="/admin/users"
                className="group mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-neutral-surface px-5 text-sm font-medium text-band efek-tekan hover:bg-brand-primary-soft dark:text-text-strong"
              >
                Kelola pengguna
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            )}
          </div>
        </section>

        <section aria-label="Ringkasan" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Users} label="Total pengguna" value={data?.totalUsers ?? null} loading={loading && access.users} />
          <StatCard icon={UserCheck} label="Pengguna aktif" value={data?.activeUsers ?? null} loading={loading && access.users} />
          <StatCard icon={Shield} label="Peran aktif" value={data?.activeRoles ?? null} loading={loading && access.roles} />
          <StatCard icon={FolderTree} label="Divisi aktif" value={data?.activeDivisions ?? null} loading={loading && access.divisions} />
        </section>

        {/* grid-cols-1 + min-w-0: kolom di ponsel tidak melebar mengikuti teks terpanjang. */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {access.audit ? (
            <RecentActivity logs={data?.recentLogs ?? null} loading={loading} />
          ) : (
            <UserStatusBar total={data?.totalUsers ?? null} active={data?.activeUsers ?? null} />
          )}
          <div className="flex min-w-0 flex-col gap-3">
            {access.audit && <UserStatusBar total={data?.totalUsers ?? null} active={data?.activeUsers ?? null} />}
            <QuickLinks access={access} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
