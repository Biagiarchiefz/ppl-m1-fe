import type { LucideIcon } from "lucide-react";
import Tooltip from "../Tooltip/Tooltip";

type RowActionTone = "default" | "danger" | "success";

interface RowActionProps {
  icon: LucideIcon;
  /** Nama aksi: dipakai sebagai aria-label dan teks tooltip (mode ikon), atau teks tombol (mode label). */
  label: string;
  onClick?: () => void;
  tone?: RowActionTone;
  /** true = ikon + teks. Dipakai bila baris hanya punya satu aksi, agar maknanya tidak perlu ditebak. */
  showLabel?: boolean;
  disabled?: boolean;
  /** Teks tooltip pengganti, mis. alasan tombol dinonaktifkan. */
  hint?: string;
}

// Warna hanya muncul saat hover/fokus, jadi kolom aksi tetap tenang dan
// aksi berbahaya tetap terbedakan saat akan diklik.
const toneClasses: Record<RowActionTone, string> = {
  default: "hover:bg-brand-primary-soft hover:text-link",
  danger: "hover:bg-danger-soft hover:text-danger",
  success: "hover:bg-success-soft hover:text-success",
};

/** Tombol aksi di baris tabel. Satu pola untuk semua tabel admin. */
const RowAction = ({ icon: Icon, label, onClick, tone = "default", showLabel = false, disabled = false, hint }: RowActionProps) => {
  const base = `inline-flex items-center justify-center rounded-full text-text-subtle efek-tekan disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-subtle ${toneClasses[tone]}`;

  if (showLabel) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} className={`${base} min-h-9 gap-1.5 border border-neutral-line px-3 text-sm font-medium text-text-default`}>
        <Icon size={16} strokeWidth={1.5} aria-hidden />
        {label}
      </button>
    );
  }

  return (
    <Tooltip text={hint ?? label} side="top">
      <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={`${base} size-9`}>
        <Icon size={18} strokeWidth={1.5} aria-hidden />
      </button>
    </Tooltip>
  );
};

export default RowAction;
