import { useState, type ReactNode } from "react";
import Modal from "../Modal/Modal";
import Alert from "../Alert/Alert";
import { ApiError } from "../../../services/api";

interface ConfirmDialogProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
  onDone: () => void;
  tone?: keyof typeof confirmTones;
}

const confirmTones = {
  danger: "bg-red-600 text-white hover:bg-red-700",
  primary: "bg-brand-primary text-brand-on-primary hover:bg-brand-primary-strong",
};

// Dialog konfirmasi untuk aksi berisiko (mis. menonaktifkan data). Pesan
// galat dari backend (error.message) ditampilkan di dalam dialog.
const ConfirmDialog = ({ title, children, confirmLabel, onConfirm, onClose, onDone, tone = "danger" }: ConfirmDialogProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <div className="text-sm leading-6 text-text-muted">{children}</div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-field border border-neutral-line px-4 text-sm font-semibold text-text-muted hover:bg-neutral-bg">
            Batal
          </button>
          <button type="button" onClick={handleConfirm} disabled={loading} className={`h-10 rounded-field px-4 text-sm font-semibold disabled:cursor-wait disabled:opacity-70 ${confirmTones[tone]}`}>
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
