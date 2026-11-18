import { UserPen, UserPlus } from "lucide-react";
import { Controller } from "react-hook-form";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Select from "../../../components/common/Select/Select";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import FormSection from "../../../components/common/FormSection/FormSection";
import { PASSWORD_RULE_HINT } from "../../../utils/validators";
import { useUserForm } from "../hooks/useUserForm";
import type { Reference, User } from "../../../types";

interface UserFormModalProps {
  user: User | null; // null = tambah akun baru
  roles: Reference[];
  divisions: Reference[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

const toOptions = (items: Reference[]) => items.map((it) => ({ value: it.code, label: it.name }));

const UserFormModal = ({ user, roles, divisions, onClose, onSaved }: UserFormModalProps) => {
  const { isEdit, register, control, errors, error, loading, onSubmit } = useUserForm(user, onSaved);

  return (
    <Modal
      title={isEdit ? "Ubah pengguna" : "Tambah pengguna"}
      description={user ? user.email : "Akun baru langsung aktif dan bisa dipakai untuk masuk."}
      icon={isEdit ? UserPen : UserPlus}
      size="lg"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
        {error && <Alert>{error}</Alert>}

        <FormSection title="Data akun">
          <div className={isEdit ? "sm:col-span-2" : undefined}>
            <Input label="Nama lengkap" id="user-name" placeholder="Masukkan nama lengkap" error={errors.name?.message} {...register("name")} />
          </div>
          {!isEdit && (
            <>
              <Input label="Email" id="user-email" type="email" autoComplete="off" placeholder="nama@contoh.id" error={errors.email?.message} {...register("email")} />
              <div className="sm:col-span-2">
                <Input label="Kata sandi awal" id="user-password" type="password" autoComplete="new-password" showPasswordToggle placeholder="Masukkan kata sandi" error={errors.password?.message} hint={PASSWORD_RULE_HINT} {...register("password")} />
              </div>
            </>
          )}
        </FormSection>

        <FormSection title="Peran & penempatan">
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select label="Peran" id="user-role" value={field.value} options={toOptions(roles)} onChange={field.onChange} placeholder="Pilih peran" error={errors.role?.message} />
            )}
          />
          <Controller
            control={control}
            name="division"
            render={({ field }) => (
              <Select label="Divisi" id="user-division" value={field.value} options={toOptions(divisions)} onChange={field.onChange} placeholder="Pilih divisi" error={errors.division?.message} />
            )}
          />
          <div className="sm:col-span-2">
            <Input label="ID unit usaha (opsional)" id="user-unit" type="number" min={1} placeholder="mis. 10" hint="Kosongkan bila pengguna tidak terikat unit usaha." error={errors.unit_usaha_id?.message} {...register("unit_usaha_id")} />
          </div>
        </FormSection>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={loading} className="sm:w-auto">
            {loading ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah pengguna"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default UserFormModal;
