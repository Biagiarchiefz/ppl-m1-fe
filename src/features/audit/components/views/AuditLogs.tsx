import { History } from "lucide-react";
import Alert from "../../../../components/common/Alert/Alert";
import Pagination from "../../../../components/common/Pagination/Pagination";
import { AUDIT_ACTIONS } from "../../constants";
import { describeChange, useAuditLogs } from "../../hooks/useAuditLogs";
import { formatDateTime } from "../../../../utils/formatDate";
import { rowNumber } from "../../../../utils/pagination";
import type { AuditLog } from "../../../../types";

const COLUMNS = 8;

// Pelaku diambil dari salinan nama/email saat kejadian, jadi tetap tampil
// walau user_id sudah null.
const Actor = ({ log }: { log: AuditLog }) => {
  if (!log.actor_name && !log.actor_email) return <span>Sistem</span>;
  return (
    <div>
      {log.actor_name && <p className="font-semibold text-text-default">{log.actor_name}</p>}
      {log.actor_email && <p className="text-xs">{log.actor_email}</p>}
    </div>
  );
};

const AuditLogs = () => {
  const { setPage, data, logs, error, loading } = useAuditLogs();

  return (
    <>
      <div>
        <h1 className="text-2xl leading-tight font-medium text-text-strong">Audit log</h1>
        <p className="mt-1 text-sm leading-[22px] text-text-muted">
          Riwayat aktivitas seluruh platform, lintas partner. Terbaru di atas.
        </p>

        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[920px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="w-14 px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3">Pelaku</th>
                  <th className="px-4 py-3">Aksi</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Perubahan</th>
                  <th className="px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.id} className="border-b border-neutral-line align-top last:border-0">
                    <td className="px-4 py-3 text-center text-sm text-text-muted tabular-nums">{rowNumber(data?.meta, index)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text-default">{formatDateTime(log.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">{log.partner_id === null ? "Platform" : `#${log.partner_id}`}</td>
                    <td className="px-4 py-3 text-sm text-text-muted"><Actor log={log} /></td>
                    <td className="px-4 py-3 text-sm font-semibold text-text-default">{AUDIT_ACTIONS[log.action] ?? log.action}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">{log.resource}{log.resource_id !== null ? ` #${log.resource_id}` : ""}</td>
                    <td className="max-w-[320px] break-words px-4 py-3 text-xs leading-5 text-text-muted">{describeChange(log)}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{log.ip_address ?? "-"}</td>
                  </tr>
                ))}
                {!loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNS} className="px-4 py-12 text-center">
                      <History size={28} className="mx-auto text-text-subtle" aria-hidden />
                      <p className="mt-2 text-sm text-text-muted">Belum ada catatan audit log.</p>
                    </td>
                  </tr>
                )}
                {loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNS} className="px-4 py-10 text-center text-sm text-text-muted">Memuat data...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={logs.length} noun="catatan" onPageChange={setPage} />
        </section>
      </div>
    </>
  );
};

export default AuditLogs;
