import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  /** Konten tambahan di kanan judul (mis. penghitung atau tombol kecil). */
  aside?: ReactNode;
  /** Grid dua kolom mulai layar sm; ponsel tetap satu kolom. */
  columns?: 1 | 2;
  children: ReactNode;
}

/**
 * Kelompok field di dalam form: judul kecil + isi dalam grid.
 * Anak yang perlu selebar baris dibungkus dengan `sm:col-span-2`.
 */
const FormSection = ({ title, description, aside, columns = 2, children }: FormSectionProps) => (
  <section className="flex flex-col gap-3">
    <div className="flex items-end justify-between gap-3 border-b border-neutral-line-soft pb-2">
      <div className="min-w-0">
        <h3 className="text-xs font-semibold tracking-wide text-text-subtle uppercase">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-text-subtle">{description}</p>}
      </div>
      {aside}
    </div>
    <div className={`grid grid-cols-1 items-start gap-x-4 gap-y-4 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>{children}</div>
  </section>
);

export default FormSection;
