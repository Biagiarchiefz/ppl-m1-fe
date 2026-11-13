import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardKeys, fetchDashboardStats } from "../services/dashboard.service";
import { can, useAuthStore } from "../../auth/stores/auth.store";
import { PERM } from "../../../config/env";
import type { DashboardAccess } from "../../../types";

const today = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

// Ringkasan dashboard: kartu yang tampil mengikuti izin pengguna.
export function useDashboard() {
  const user = useAuthStore((s) => s.user);
  const access: DashboardAccess = {
    users: can(user, PERM.usersRead, PERM.usersManage),
    roles: can(user, PERM.rolesManage),
    divisions: can(user, PERM.divisionsManage),
    audit: can(user, PERM.auditRead),
  };
  const { data, isPending } = useQuery({
    queryKey: dashboardKeys.stats(access),
    queryFn: () => fetchDashboardStats(access),
  });

  useEffect(() => {
    document.title = "Dashboard — Araya Business Hub";
  }, []);

  const firstName = user?.name.trim().split(/\s+/)[0] ?? "Administrator";
  const todayLabel = today.format(new Date());

  return { access, data, loading: isPending, firstName, todayLabel };
}
