import { listAuditLogs, type AuditLog } from "../audit";
import { listDivisions } from "../divisions";
import { listRoles } from "../roles";
import { listUsers } from "../users";

export interface DashboardAccess {
  users: boolean;
  roles: boolean;
  divisions: boolean;
  audit: boolean;
}

// null = tidak punya izin atau permintaan gagal; kartunya menampilkan "—".
export interface DashboardStats {
  totalUsers: number | null;
  activeUsers: number | null;
  activeRoles: number | null;
  activeDivisions: number | null;
  recentLogs: AuditLog[] | null;
}

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
