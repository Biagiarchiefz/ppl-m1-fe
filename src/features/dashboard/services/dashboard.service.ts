import { listPlatformAuditLogs } from "../../audit/services/audit.service";
import { listDivisions } from "../../divisions/services/divisions.service";
import { listRoles } from "../../roles/services/roles.service";
import { listUsers } from "../../users/services/users.service";
import type { DashboardStats } from "../../../types";

async function totalOf(request: () => Promise<{ meta: { total: number } }>): Promise<number | null> {
  try {
    return (await request()).meta?.total ?? null;
  } catch {
    return null;
  }
}

// Ringkasan dashboard dihitung dari `meta.total` endpoint daftar (per_page=1),
// jadi tidak butuh endpoint statistik khusus di backend.
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [totalUsers, activeUsers, activeRoles, activeDivisions, recentLogs] = await Promise.all([
    totalOf(() => listUsers({ page: 1, per_page: 1 })),
    totalOf(() => listUsers({ page: 1, per_page: 1, is_active: true })),
    totalOf(() => listRoles({ page: 1, per_page: 1, is_active: true })),
    totalOf(() => listDivisions({ page: 1, per_page: 1, is_active: true })),
    listPlatformAuditLogs({ page: 1, per_page: 6 })
      .then((r) => r.data)
      .catch(() => null),
  ]);
  return { totalUsers, activeUsers, activeRoles, activeDivisions, recentLogs };
}

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
};
