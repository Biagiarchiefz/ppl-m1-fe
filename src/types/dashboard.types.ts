import type { AuditLog } from "./audit.types";

// Ringkasan dashboard super admin.

// null = permintaan gagal; kartunya menampilkan "—".
export interface DashboardStats {
  totalUsers: number | null;
  activeUsers: number | null;
  activeRoles: number | null;
  activeDivisions: number | null;
  recentLogs: AuditLog[] | null;
}
