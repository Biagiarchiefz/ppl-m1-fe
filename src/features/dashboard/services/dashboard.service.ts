import { listAuditLogs } from "../../audit/services/audit.service";
import { listDivisions } from "../../divisions/services/divisions.service";
import { listRoles } from "../../roles/services/roles.service";
import { listUsers } from "../../users/services/users.service";
import type { DashboardAccess, DashboardStats } from "../../../types";

async function totalOf(enabled: boolean, request: () => Promise<{ meta: { total: number } }>): Promise<number | null> {
  if (!enabled) return null;
  try {
    return (await request()).meta?.total ?? null;
  } catch {
    return null;
  }
}

// Ringkasan dashboard dihitung dari `meta.total` endpoint daftar (per_page=1),
// jadi tidak butuh endpoint statistik khusus di backend.
export async function fetchDashboardStats(access: DashboardAccess): Promise<DashboardStats> {
  const [totalUsers, activeUsers, activeRoles, activeDivisions, recentLogs] = await Promise.all([
    totalOf(access.users, () => listUsers({ page: 1, per_page: 1 })),
    totalOf(access.users, () => listUsers({ page: 1, per_page: 1, is_active: true })),
    totalOf(access.roles, () => listRoles({ page: 1, per_page: 1, is_active: true })),
    totalOf(access.divisions, () => listDivisions({ page: 1, per_page: 1, is_active: true })),
    access.audit
      ? listAuditLogs({ page: 1, per_page: 6 })
          .then((r) => r.data)
          .catch(() => null)
      : Promise.resolve(null),
  ]);
  return { totalUsers, activeUsers, activeRoles, activeDivisions, recentLogs };
}

export const dashboardKeys = {
  stats: (access: DashboardAccess) => ["dashboard", "stats", access] as const,
};
