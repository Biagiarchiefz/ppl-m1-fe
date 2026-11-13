import { useState, type ReactNode } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import Modal, { ModalFooter } from "../Modal/Modal";
import Button from "../Button/Button";
import Alert from "../Alert/Alert";
import { ApiError } from "../../../services/api";

interface ConfirmDialogProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
  onDone: () => void;
  tone?: "danger" | "primary";
}


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
    <Modal
      title={title}
      icon={tone === "danger" ? TriangleAlert : CircleCheck}
      tone={tone === "danger" ? "danger" : "default"}
      size="sm"
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <div className="text-sm leading-6 text-text-muted">{children}</div>
      </div>
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button type="button" variant={tone === "danger" ? "danger" : "primary"} loading={loading} onClick={handleConfirm} className="sm:w-auto">
          {loading ? "Memproses..." : confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDialog;
