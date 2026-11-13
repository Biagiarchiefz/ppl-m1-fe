import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditKeys, listAuditLogs, listPlatformAuditLogs } from "../services/audit.service";
import { errorMessage } from "../../../services/api";
import { useDebounce } from "../../../hooks/useDebounce";
import type { AuditLog, AuditScope } from "../../../types";

export function describeChange(log: AuditLog): string {
  const fmt = (v: Record<string, unknown> | null) =>
    v ? Object.entries(v).map(([k, val]) => `${k}: ${val === null ? "null" : String(val)}`).join(", ") : "";
  const before = fmt(log.old_value);
  const after = fmt(log.new_value);
  if (before && after) return `${before} → ${after}`;
  return after || before || "-";
}

// platform: audit log semua organisasi untuk super admin.
export function useAuditLogs(scope: AuditScope = "organization") {
  const platform = scope === "platform";
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [action, setAction] = useState("");
  const [actor, setActor] = useState("");
  const [org, setOrg] = useState("");
  const [page, setPage] = useState(1);
  const userId = useDebounce(actor.trim());
  const organizationId = useDebounce(org.trim());

  useEffect(() => {
    document.title = platform ? "Audit Log Platform" : "Audit Log";
  }, [platform]);

  const filter = { page, from, to, action, user_id: userId, organization_id: platform ? organizationId : undefined };
  const { data, error, isFetching } = useQuery({
    queryKey: auditKeys.list(scope, filter),
    queryFn: () => (platform ? listPlatformAuditLogs(filter) : listAuditLogs(filter)),
    placeholderData: keepPreviousData,
  });
  const logs = data?.data ?? [];
  const hasFilter = Boolean(from || to || action || userId || organizationId);
  const columns = platform ? 7 : 6;

  // Mengubah filter selalu kembali ke halaman pertama.
  const onFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return {
    platform,
    from,
    setFrom,
    to,
    setTo,
    action,
    setAction,
    actor,
    setActor,
    org,
    setOrg,
    setPage,
    onFilter,
    data,
    logs,
    error: errorMessage(error),
    loading: isFetching,
    hasFilter,
    columns,
  };
}
