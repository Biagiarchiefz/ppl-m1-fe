import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditKeys, listPlatformAuditLogs } from "../services/audit.service";
import { errorMessage } from "../../../services/api";
import type { AuditLog } from "../../../types";
import { PAGE_SIZE } from "../../../utils/pagination";

export function describeChange(log: AuditLog): string {
  const fmt = (v: Record<string, unknown> | null) =>
    v ? Object.entries(v).map(([k, val]) => `${k}: ${val === null ? "null" : String(val)}`).join(", ") : "";
  const before = fmt(log.old_value);
  const after = fmt(log.new_value);
  if (before && after) return `${before} → ${after}`;
  return after || before || "-";
}

// Audit log seluruh platform (super admin). Backend hanya mendukung
// paginasi, tanpa filter.
export function useAuditLogs() {
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Audit Log";
  }, []);

  const filter = { page, per_page: PAGE_SIZE };
  const { data, error, isFetching } = useQuery({
    queryKey: auditKeys.list(filter),
    queryFn: () => listPlatformAuditLogs(filter),
    placeholderData: keepPreviousData,
  });

  return {
    setPage,
    data,
    logs: data?.data ?? [],
    error: errorMessage(error),
    loading: isFetching,
  };
}
