import { apiList } from "../../../services/api";
import type { AuditFilter, AuditLog } from "../../../types";

// Audit log seluruh platform (super admin), terbaru lebih dahulu.
export function listPlatformAuditLogs(filter: AuditFilter) {
  return apiList<AuditLog>("/platform/audit-logs", { ...filter });
}

export const auditKeys = {
  all: ["audit"] as const,
  list: (filter: AuditFilter) => ["audit", "platform", filter] as const,
};
