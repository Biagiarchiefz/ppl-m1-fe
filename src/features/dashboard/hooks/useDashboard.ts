import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardKeys, fetchDashboardStats } from "../services/dashboard.service";
import { selectUser, useAuthStore } from "../../../store";

const today = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

// Ringkasan dashboard super admin.
export function useDashboard() {
  const user = useAuthStore(selectUser);
  const { data, isPending } = useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: fetchDashboardStats,
  });

  useEffect(() => {
    document.title = "Dashboard — Araya Business Hub";
  }, []);

  const firstName = user?.name.trim().split(/\s+/)[0] ?? "Administrator";
  const todayLabel = today.format(new Date());

  return { data, loading: isPending, firstName, todayLabel };
}
