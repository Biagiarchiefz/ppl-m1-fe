import { useState } from "react";
import Modal from "../../../components/common/Modal/Modal";
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
    <Modal title="Nonaktifkan akun" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <p className="text-sm leading-6 text-text-muted">
          Akun <strong className="text-text-default">{user.name}</strong> ({user.email}) tidak akan bisa login lagi.
          Data dan riwayat audit log akun tetap tersimpan.
        </p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-field border border-neutral-line px-4 text-sm font-semibold text-text-muted hover:bg-neutral-bg">
            Batal
          </button>
          <button type="button" onClick={handleConfirm} disabled={loading} className="h-10 rounded-field bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-70">
            {loading ? "Memproses..." : "Nonaktifkan"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateDialog;
