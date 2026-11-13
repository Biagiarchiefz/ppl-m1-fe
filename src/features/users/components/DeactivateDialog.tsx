import { useState } from "react";
import { UserX } from "lucide-react";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { ApiError } from "../../../services/api";
import { deactivateUser, type User } from "..";

interface DeactivateDialogProps {
  user: User;
  onClose: () => void;
  onDone: (message: string) => void;
}

// Dialog konfirmasi sebelum DELETE /users/{id} (soft delete, PRD 11).
const DeactivateDialog = ({ user, onClose, onDone }: DeactivateDialogProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      await deactivateUser(user.id);
      onDone(`Akun ${user.name} berhasil dinonaktifkan.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Nonaktifkan akun" icon={UserX} tone="danger" size="sm" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <div className="flex items-center gap-3 rounded-xl border border-neutral-line bg-neutral-bg p-3">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-primary text-sm font-semibold text-brand-on-primary">
            {(user.name.trim()[0] ?? "?").toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-strong">{user.name}</p>
            <p className="truncate text-xs text-text-muted">{user.email}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-text-muted">
          Akun ini tidak akan bisa login lagi. Data dan riwayat audit log akun tetap tersimpan, dan akun bisa diaktifkan kembali kapan saja.
        </p>
      </div>
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button type="button" variant="danger" loading={loading} onClick={handleConfirm} className="sm:w-auto">
          {loading ? "Memproses..." : "Nonaktifkan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeactivateDialog;
