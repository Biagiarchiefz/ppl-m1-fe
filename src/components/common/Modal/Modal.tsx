import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 dark:bg-black/60" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-card border border-neutral-line bg-neutral-surface p-6 shadow-card"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-bold text-text-default">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded p-1 text-text-muted hover:bg-neutral-bg">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
};

export default Modal;
