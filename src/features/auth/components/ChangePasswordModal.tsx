import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import Modal from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { ApiError } from "../../../services/api";
import { PASSWORD_RULE_HINT, isValidPassword } from "../../../utils/validators";
import { formatDateTime } from "../../../utils/formatDate";
import { changePassword } from "..";

interface ChangePasswordModalProps {
  onClose: () => void;
  onSaved: (message: string) => void;
}

const emptyForm = { old_password: "", new_password: "", confirmation: "" };

// Validasi ringan di klien; teks galat dari backend tetap diutamakan.
function clientErrors(form: typeof emptyForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.old_password) errors.old_password = "Isian ini wajib diisi";
  if (!isValidPassword(form.new_password) || form.new_password === form.old_password) {
    errors.new_password = "Kata sandi baru tidak memenuhi aturan";
  }
  if (form.confirmation !== form.new_password) errors.confirmation = "Konfirmasi kata sandi tidak cocok";
  return errors;
}

const ChangePasswordModal = ({ onClose, onSaved }: ChangePasswordModalProps) => {
  const [form, setForm] = useState(emptyForm);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof emptyForm) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const errors = clientErrors(form);
    setFields(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const result = await changePassword(form.old_password, form.new_password);
      onSaved(`Kata sandi berhasil diubah pada ${formatDateTime(result.changed_at)}.`);
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message ?? "Terjadi kesalahan pada server");
      setFields(apiError?.fields ?? {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Ubah kata sandi" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Kata sandi lama" icon={LockKeyhole} id="old_password" name="old_password" type="password" autoComplete="current-password" showPasswordToggle value={form.old_password} onChange={(e) => set("old_password")(e.target.value)} placeholder="Masukkan kata sandi lama" error={fields.old_password} />
        <Input label="Kata sandi baru" icon={LockKeyhole} id="new_password" name="new_password" type="password" autoComplete="new-password" showPasswordToggle value={form.new_password} onChange={(e) => set("new_password")(e.target.value)} placeholder="Masukkan kata sandi baru" error={fields.new_password} hint={PASSWORD_RULE_HINT} />
        <Input label="Konfirmasi kata sandi baru" icon={LockKeyhole} id="confirmation" name="confirmation" type="password" autoComplete="new-password" showPasswordToggle value={form.confirmation} onChange={(e) => set("confirmation")(e.target.value)} placeholder="Ulangi kata sandi baru" error={fields.confirmation} />
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-field border border-neutral-line px-4 text-sm font-semibold text-text-muted hover:bg-neutral-bg">
            Batal
          </button>
          <Button type="submit" disabled={loading} className="w-auto! px-5 disabled:cursor-wait disabled:opacity-70">
            {loading ? "Menyimpan..." : "Simpan kata sandi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
