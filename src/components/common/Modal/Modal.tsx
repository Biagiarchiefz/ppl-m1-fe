import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, type LucideIcon } from "lucide-react";

type ModalTone = "default" | "danger";
type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  title: string;
  description?: ReactNode;
  /** Ikon di lencana kiri judul. */
  icon?: LucideIcon;
  tone?: ModalTone;
  size?: ModalSize;
  onClose: () => void;
  children: ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "sm:max-w-[420px]",
  md: "sm:max-w-[520px]",
  lg: "sm:max-w-[640px]",
};

const toneClasses: Record<ModalTone, string> = {
  default: "bg-brand-primary-soft text-brand-primary",
  danger: "bg-danger-soft text-danger",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Baris tombol di bawah modal. Menempel di dasar area gulir, jadi tetap terlihat
 * walau isi form panjang. Ponsel: tombol selebar layar, aksi utama di atas.
 */
export const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className="sticky bottom-0 z-10 -mx-5 mt-6 -mb-5 flex flex-col-reverse gap-2 border-t border-neutral-line bg-neutral-bg px-5 py-4 sm:-mx-6 sm:-mb-6 sm:flex-row sm:items-center sm:justify-end sm:px-6 [&>button]:w-full sm:[&>button]:w-auto">
    {children}
  </div>
);

/**
 * Dialog modal: kartu di tengah layar (desktop) atau bottom sheet (ponsel).
 * Fokus dikurung di dalam dialog, dikembalikan ke elemen pemicu saat ditutup,
 * dan halaman di belakangnya tidak ikut tergulir.
 */
const Modal = ({ title, description, icon: Icon, tone = "default", size = "md", onClose, children }: ModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    // Fokus awal: field pertama di isi modal, atau tombol tutup bila tidak ada field.
    const panel = panelRef.current;
    const firstField = panel?.querySelector<HTMLElement>(`[data-modal-body] :is(${FOCUSABLE})`);
    (firstField ?? panel?.querySelector<HTMLElement>(FOCUSABLE))?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-halaman-masuk bg-band-deep/50 motion-reduce:animate-none sm:items-center sm:p-6 dark:bg-black/65"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[20px] border border-neutral-line bg-neutral-surface shadow-pop animate-sheet-naik motion-reduce:animate-none sm:max-h-[min(88dvh,760px)] sm:animate-modal-masuk sm:rounded-[20px] ${sizeClasses[size]}`}
      >
        {/* Pegangan bottom sheet (ponsel). */}
        <span aria-hidden className="mx-auto mt-2.5 block h-1 w-10 shrink-0 rounded-full bg-neutral-line-strong sm:hidden" />

        <header className="flex shrink-0 items-start gap-4 px-5 pt-4 pb-4 sm:px-6 sm:pt-6">
          {Icon && (
            <span aria-hidden className={`grid size-11 shrink-0 place-items-center rounded-xl ${toneClasses[tone]}`}>
              <Icon size={20} strokeWidth={1.5} />
            </span>
          )}
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id={titleId} className="text-lg leading-snug font-medium text-text-strong">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded-full text-text-subtle efek-tekan hover:bg-neutral-recessed hover:text-text-strong"
          >
            <X size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </header>

        <div data-modal-body className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-6 sm:pb-6">
          {children}
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default Modal;
