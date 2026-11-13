import { ArrowRight, History } from "lucide-react";
import { Link } from "react-router";
import { AUDIT_ACTIONS } from "../../audit/constants";
import { formatDateTime } from "../../../utils/formatDate";
import type { AuditLog } from "../../../types";

interface RecentActivityProps {
  logs: AuditLog[] | null;
  loading: boolean;
}

const RecentActivity = ({ logs, loading }: RecentActivityProps) => (
  <section aria-labelledby="judul-aktivitas" className="flex min-w-0 flex-col rounded-card border border-neutral-line bg-neutral-surface p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 id="judul-aktivitas" className="text-sm font-semibold text-text-strong">
          Aktivitas terbaru
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">Perubahan akun dan akses yang tercatat di audit log.</p>
      </div>
      <Link
        to="/admin/audit-logs"
        className="group -mr-1 inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md px-1 text-sm font-medium text-link hover:underline"
      >
        Lihat semua
        <ArrowRight size={16} strokeWidth={1.5} aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </Link>
    </div>

    {loading ? (
      <ul aria-hidden className="mt-3 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="size-8 shrink-0 animate-pulse rounded-full bg-neutral-recessed" />
            <span className="h-4 flex-1 animate-pulse rounded bg-neutral-recessed" />
          </li>
        ))}
      </ul>
    ) : !logs || logs.length === 0 ? (
      <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-lg bg-neutral-soft px-3 py-8 text-center">
        <History size={28} strokeWidth={1.5} aria-hidden className="text-text-subtle" />
        <p className="mt-2 text-sm text-text-muted">{logs ? "Belum ada aktivitas tercatat." : "Aktivitas belum bisa dimuat."}</p>
      </div>
    ) : (
      <ol className="mt-3 divide-y divide-neutral-line-soft">
        {logs.map((log) => {
          const actor = log.actor_name ?? log.actor_email ?? "Sistem";
          return (
            <li key={log.id} className="flex items-start gap-3 py-2.5">
              <span aria-hidden className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-neutral-soft text-xs font-semibold text-text-muted">
                {actor.trim()[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-default">
                  <span className="font-medium text-text-strong">{actor}</span>{" "}
                  <span className="text-text-muted">· {AUDIT_ACTIONS[log.action] ?? log.action}</span>
                </p>
                <p className="mt-0.5 text-xs text-text-subtle tabular-nums">{formatDateTime(log.created_at)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    )}
  </section>
);

export default RecentActivity;
