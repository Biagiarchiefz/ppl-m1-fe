import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditKeys, listPlatformAuditLogs } from "../services/audit.service";
import { errorMessage } from "../../../services/api";
import type { AuditLog } from "../../../types";
import { PAGE_SIZE } from "../../../utils/pagination";

export interface ChangeRow {
  field: string;
  before: string | null; // null = field tidak ada di nilai lama
  after: string | null; // null = field tidak ada di nilai baru
}

export type ActionTone = "success" | "danger" | "info" | "neutral";

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "kosong";
  if (Array.isArray(value)) return value.length === 0 ? "kosong" : value.map(formatValue).join(", ");
  if (typeof value === "boolean") return value ? "ya" : "tidak";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// Perubahan per field dari old_value/new_value. Field yang nilainya sama
// di kedua sisi tidak ditampilkan.
export function changeRows(log: AuditLog): ChangeRow[] {
  const before = log.old_value ?? {};
  const after = log.new_value ?? {};
  const fields = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  return fields
    .map((field) => ({
      field,
      before: field in before ? formatValue(before[field]) : null,
      after: field in after ? formatValue(after[field]) : null,
    }))
    .filter((row) => row.before !== row.after);
}

// Warna lencana aksi berdasarkan kata kerja di kode aksi (mis. user.created).
export function actionTone(action: string): ActionTone {
  if (/(created|activated|succeeded)$/.test(action)) return "success";
  if (/(deactivated|failed|deleted)$/.test(action)) return "danger";
  if (/(updated|changed)$/.test(action)) return "info";
  return "neutral";
}

// Ringkasan satu baris untuk kolom Perubahan: perubahan pertama + jumlah sisanya.
export function changeSummary(log: AuditLog): { text: string; more: number; full: string } | null {
  const rows = changeRows(log);
  if (rows.length === 0) return null;
  const line = (r: ChangeRow) => (r.before !== null && r.after !== null ? `${r.field}: ${r.before} → ${r.after}` : `${r.field}: ${r.after ?? r.before}`);
  return { text: line(rows[0]), more: rows.length - 1, full: rows.map(line).join("\n") };
}

// Nama target aksi: nama/email dari snapshot data, atau #id.
export function auditTarget(log: AuditLog): string | null {
  if (log.action.startsWith("auth.") || log.action === "user.password_changed") return null;
  const pick = (v: Record<string, unknown> | null) => (typeof v?.name === "string" ? v.name : typeof v?.email === "string" ? v.email : null);
  return pick(log.new_value) ?? pick(log.old_value) ?? (log.resource_id !== null ? `#${log.resource_id}` : null);
}

export function actorName(log: AuditLog): string {
  return log.actor_name ?? log.actor_email ?? "Sistem";
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
