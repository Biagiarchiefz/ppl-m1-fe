import { KeyRound, LockKeyhole } from "lucide-react";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { PASSWORD_RULE_HINT } from "../../../utils/validators";
import { useChangePassword } from "../hooks/useChangePassword";

interface ChangePasswordModalProps {
  onClose: () => void;
  onSaved: (message: string) => void;
}

const ChangePasswordModal = ({ onClose, onSaved }: ChangePasswordModalProps) => {
  const { fields, errors, error, loading, onSubmit } = useChangePassword(onSaved);

  return (
    <Modal title="Ubah kata sandi" description="Gunakan kata sandi yang kuat dan belum pernah dipakai di layanan lain." icon={KeyRound} size="sm" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Kata sandi lama" icon={LockKeyhole} id="old_password" type="password" autoComplete="current-password" showPasswordToggle placeholder="Masukkan kata sandi lama" error={errors.old_password?.message} {...fields.old_password} />
        <Input label="Kata sandi baru" icon={LockKeyhole} id="new_password" type="password" autoComplete="new-password" showPasswordToggle placeholder="Masukkan kata sandi baru" error={errors.new_password?.message} hint={PASSWORD_RULE_HINT} {...fields.new_password} />
        <Input label="Konfirmasi kata sandi baru" icon={LockKeyhole} id="confirmation" type="password" autoComplete="new-password" showPasswordToggle placeholder="Ulangi kata sandi baru" error={errors.confirmation?.message} {...fields.confirmation} />
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={loading} className="sm:w-auto">
            {loading ? "Menyimpan..." : "Simpan kata sandi"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
