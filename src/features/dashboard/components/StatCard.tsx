import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | null;
  hint?: string;
  loading?: boolean;
}

/** Angka besar, label kecil: kartu bergaris tipis tanpa bayangan berat. */
const StatCard = ({ icon: Icon, label, value, hint, loading }: StatCardProps) => (
  <div className="rounded-card border border-neutral-line bg-neutral-surface p-4">
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs leading-tight font-medium text-text-muted">{label}</p>
      <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-primary-soft text-brand-primary">
        <Icon size={16} strokeWidth={1.5} />
      </span>
    </div>
    {loading ? (
      <span aria-hidden className="mt-2 block h-7 w-16 animate-pulse rounded-md bg-neutral-recessed" />
    ) : (
      <p className="mt-1.5 text-[28px] leading-none font-semibold tracking-[-0.02em] text-text-strong tabular-nums">
        {value === null ? "—" : value.toLocaleString("id-ID")}
      </p>
    )}
    {hint && <p className="mt-2 text-xs text-text-subtle">{hint}</p>}
  </div>
);

export default StatCard;
