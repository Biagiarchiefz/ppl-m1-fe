import { History } from "lucide-react";
import Alert from "../../../../components/common/Alert/Alert";
import Pagination from "../../../../components/common/Pagination/Pagination";
import { AUDIT_ACTIONS } from "../../constants";
import { actionTone, actorName, auditTarget, changeSummary, useAuditLogs, type ActionTone } from "../../hooks/useAuditLogs";
import { formatDateTime } from "../../../../utils/formatDate";
import { rowNumber } from "../../../../utils/pagination";

const COLUMNS = 5;

const toneDot: Record<ActionTone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  info: "bg-brand-accent",
  neutral: "bg-text-subtle",
};

// Tabel ringkas: hanya informasi penting, satu baris per catatan. Teks yang
// terlalu panjang dipotong, isi lengkapnya tampil sebagai tooltip.
const AuditLogs = () => {
  const { setPage, data, logs, error, loading } = useAuditLogs();

  return (
    <div>
      <h1 className="text-2xl leading-tight font-medium text-text-strong">Audit log</h1>
      <p className="mt-1 text-sm leading-[22px] text-text-muted">Riwayat aktivitas seluruh platform, lintas partner. Terbaru di atas.</p>

      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
        <table className={`w-full table-fixed border-collapse text-left ${loading ? "opacity-60" : ""}`}>
          <thead>
            <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold tracking-[0.04em] text-text-muted uppercase">
              <th className="hidden w-12 px-3 py-2.5 text-center sm:table-cell">No</th>
              <th className="w-[7.5rem] px-3 py-2.5 sm:w-40">Waktu</th>
              <th className="w-[30%] px-3 py-2.5 md:w-[22%]">Pelaku</th>
              <th className="px-3 py-2.5 md:w-[28%]">Aktivitas</th>
              <th className="hidden px-3 py-2.5 md:table-cell">Perubahan</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => {
              const actor = actorName(log);
              const label = AUDIT_ACTIONS[log.action] ?? log.action;
              const target = auditTarget(log);
              const change = changeSummary(log);
              const partner = log.partner_id === null ? "Platform" : `Partner #${log.partner_id}`;

              return (
                <tr key={log.id} className="border-b border-neutral-line-soft text-sm transition-colors last:border-0 hover:bg-neutral-bg">
                  <td className="hidden px-3 py-2.5 text-center text-xs text-text-subtle tabular-nums sm:table-cell">{rowNumber(data?.meta, index)}</td>
                  <td className="truncate px-3 py-2.5 text-xs text-text-muted tabular-nums" title={log.ip_address ? `IP ${log.ip_address}` : undefined}>
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="truncate font-medium text-text-default" title={[actor, log.actor_email, partner].filter(Boolean).join(" · ")}>
                      {actor}
                    </p>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="flex min-w-0 items-center gap-2" title={target ? `${label} · ${target}` : label}>
                      <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${toneDot[actionTone(log.action)]}`} />
                      <span className="truncate">
                        <span className="text-text-default">{label}</span>
                        {target && <span className="text-text-subtle"> · {target}</span>}
                      </span>
                    </p>
                  </td>
                  <td className="hidden px-3 py-2.5 md:table-cell">
                    {change ? (
                      <p className="flex min-w-0 items-center gap-2 text-xs" title={change.full}>
                        <span className="truncate text-text-muted">{change.text}</span>
                        {change.more > 0 && <span className="shrink-0 rounded-full bg-neutral-soft px-1.5 py-px text-[11px] text-text-subtle">+{change.more}</span>}
                      </p>
                    ) : (
                      <span className="text-xs text-text-subtle">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && logs.length === 0 && (
              <tr>
                <td colSpan={COLUMNS} className="px-4 py-12 text-center">
                  <History size={28} strokeWidth={1.5} className="mx-auto text-text-subtle" aria-hidden />
                  <p className="mt-2 text-sm text-text-muted">Belum ada catatan audit log.</p>
                </td>
              </tr>
            )}
            {loading && logs.length === 0 && (
              <tr>
                <td colSpan={COLUMNS} className="px-4 py-10 text-center text-sm text-text-muted">
                  Memuat data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination meta={data?.meta ?? null} itemCount={logs.length} noun="catatan" onPageChange={setPage} />
      </section>
    </div>
  );
};

export default AuditLogs;
