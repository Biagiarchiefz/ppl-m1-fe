import type { AuditLog } from "./audit.types";

// Ringkasan dashboard admin.

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
