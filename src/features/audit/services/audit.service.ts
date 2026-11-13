import { apiList } from "../../../services/api";
import type { AuditFilter, AuditLog } from "../../../types";

// Audit log organisasi pemanggil.
export function listAuditLogs(filter: AuditFilter) {
  return apiList<AuditLog>("/audit-logs", { ...filter });
}

// Audit log semua organisasi (super admin), termasuk organisasi yang sudah
// dihapus permanen.
export function listPlatformAuditLogs(filter: AuditFilter) {
  return apiList<AuditLog>("/platform/audit-logs", { ...filter });
}

export const auditKeys = {
  all: ["audit"] as const,
  list: (scope: "organization" | "platform", filter: AuditFilter) => ["audit", scope, filter] as const,
};
