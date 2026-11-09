import type { ListMeta } from "../../../services/api";

interface PaginationProps {
  meta: ListMeta | null;
  itemCount: number;
  noun: string;
  onPageChange: (page: number) => void;
}

const buttonClass =
  "rounded border border-neutral-line px-3 py-1.5 text-xs hover:bg-neutral-bg disabled:cursor-not-allowed disabled:opacity-50";

const Pagination = ({ meta, itemCount, noun, onPageChange }: PaginationProps) => {
  const page = meta?.page ?? 1;
  const totalPages = meta?.total_pages ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-line px-4 py-3 text-sm text-text-muted">
      <span>
        Menampilkan {itemCount} dari {meta?.total ?? 0} {noun}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={buttonClass}>
          Sebelumnya
        </button>
        <span className="rounded border border-brand-primary bg-brand-primary px-3 py-1.5 text-xs text-brand-on-primary">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={buttonClass}>
          Berikutnya
        </button>
      </div>
    </div>
  );
};

export default Pagination;
