import { useEffect, useState } from "react";
import { History } from "lucide-react";
import AdminLayout from "./AdminLayout";
import Alert from "../../components/common/Alert/Alert";
import Pagination from "../../components/common/Pagination/Pagination";
import { AUDIT_ACTIONS, listAuditLogs, listPlatformAuditLogs, type AuditLog } from "../../features/audit";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDateTime } from "../../utils/formatDate";
import Select from "../../components/common/Select/Select";

const fieldClass =
  "min-h-10 rounded-field border border-neutral-line bg-neutral-surface px-3 text-sm text-text-default outline-none transition-colors duration-150 hover:border-neutral-line-strong focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30";

function describeChange(log: AuditLog): string {
  const fmt = (v: Record<string, unknown> | null) =>
    v ? Object.entries(v).map(([k, val]) => `${k}: ${val === null ? "null" : String(val)}`).join(", ") : "";
  const before = fmt(log.old_value);
  const after = fmt(log.new_value);
  if (before && after) return `${before} → ${after}`;
  return after || before || "-";
}

// Pelaku diambil dari salinan nama/email saat kejadian, jadi tetap tampil
// walau akunnya sudah dihapus permanen (user_id menjadi null).
const Actor = ({ log }: { log: AuditLog }) => {
  if (!log.actor_name) return <span>-</span>;
  return (
    <div>
      <p className="font-semibold text-text-default">{log.actor_name}</p>
      <p className="text-xs">{log.actor_email}</p>
      {log.user_id === null && <p className="text-xs italic text-danger">Akun sudah dihapus</p>}
    </div>
  );
};

const Organization = ({ log }: { log: AuditLog }) => {
  if (!log.organization_name) return <span>Platform</span>;
  return (
    <div>
      <p className="font-semibold text-text-default">{log.organization_name}</p>
      {log.organization_id === null && <p className="text-xs italic text-danger">Organisasi sudah dihapus</p>}
    </div>
  );
};

interface AuditLogsPageProps {
  // platform: audit log semua organisasi untuk super admin.
  scope?: "organization" | "platform";
}

const AuditLogsPage = ({ scope = "organization" }: AuditLogsPageProps) => {
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

  const { data, error, loading } = useAsync(platform ? listPlatformAuditLogs : listAuditLogs, {
    page, from, to, action, user_id: userId, organization_id: platform ? organizationId : undefined,
  });
  const logs = data?.data ?? [];
  const hasFilter = Boolean(from || to || action || userId || organizationId);
  const columns = platform ? 7 : 6;

  const onFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl leading-tight font-medium text-text-strong">
          {platform ? "Audit log platform" : "Audit log"}
        </h1>
        <p className="mt-1 text-sm leading-[22px] text-text-muted">
          {platform
            ? "Riwayat aktivitas semua organisasi, termasuk organisasi yang sudah dihapus. Terbaru di atas."
            : "Riwayat aktivitas pengguna, terbaru di atas."}
        </p>

        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="flex flex-wrap items-end gap-3 border-b border-neutral-line p-4">
            <label className="flex flex-col gap-1 text-xs font-semibold text-text-muted">
              Dari tanggal
              <input type="date" value={from} max={to || undefined} onChange={(e) => onFilter(setFrom)(e.target.value)} className={fieldClass} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-text-muted">
              Sampai tanggal
              <input type="date" value={to} min={from || undefined} onChange={(e) => onFilter(setTo)(e.target.value)} className={fieldClass} />
            </label>
            <Select
              label="Aksi"
              labelClassName="text-xs font-semibold text-text-muted"
              className="w-56 gap-1!"
              value={action}
              placeholder="Semua aksi"
              options={Object.entries(AUDIT_ACTIONS).map(([code, label]) => ({ value: code, label }))}
              onChange={onFilter(setAction)}
            />
            {platform && (
              <label className="flex flex-col gap-1 text-xs font-semibold text-text-muted">
                ID organisasi
                <input type="number" min={1} value={org} onChange={(e) => onFilter(setOrg)(e.target.value)} placeholder="Semua" className={`${fieldClass} w-28`} />
              </label>
            )}
            <label className="flex flex-col gap-1 text-xs font-semibold text-text-muted">
              ID pelaku
              <input type="number" min={1} value={actor} onChange={(e) => onFilter(setActor)(e.target.value)} placeholder="Semua" className={`${fieldClass} w-28`} />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full min-w-[920px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="px-4 py-3">Waktu</th>
                  {platform && <th className="px-4 py-3">Organisasi</th>}
                  <th className="px-4 py-3">Pelaku</th>
                  <th className="px-4 py-3">Aksi</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Perubahan</th>
                  <th className="px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-neutral-line align-top last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text-default">{formatDateTime(log.created_at)}</td>
                    {platform && <td className="px-4 py-3 text-sm text-text-muted"><Organization log={log} /></td>}
                    <td className="px-4 py-3 text-sm text-text-muted"><Actor log={log} /></td>
                    <td className="px-4 py-3 text-sm font-semibold text-text-default">{AUDIT_ACTIONS[log.action] ?? log.action}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">{log.resource}{log.resource_id !== null ? ` #${log.resource_id}` : ""}</td>
                    <td className="max-w-[320px] break-words px-4 py-3 text-xs leading-5 text-text-muted">{describeChange(log)}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{log.ip_address ?? "-"}</td>
                  </tr>
                ))}
                {!loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={columns} className="px-4 py-12 text-center">
                      <History size={28} className="mx-auto text-text-subtle" aria-hidden />
                      <p className="mt-2 text-sm text-text-muted">
                        {hasFilter ? "Tidak ada catatan yang cocok dengan filter." : "Belum ada catatan audit log."}
                      </p>
                    </td>
                  </tr>
                )}
                {loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={columns} className="px-4 py-10 text-center text-sm text-text-muted">Memuat data...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={logs.length} noun="catatan" onPageChange={setPage} />
        </section>
      </div>
    </AdminLayout>
  );
};

export default AuditLogsPage;
