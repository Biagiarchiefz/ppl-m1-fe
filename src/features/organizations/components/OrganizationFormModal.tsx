import { Building2 } from "lucide-react";
import { Controller } from "react-hook-form";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { PASSWORD_RULE_HINT } from "../../../utils/validators";
import { useOrganizationForm } from "../hooks/useOrganizationForm";
import type { Organization } from "../../../types";

interface OrganizationFormModalProps {
  organization: Organization | null; // null = organisasi baru
  onClose: () => void;
  onSaved: (message: string) => void;
}

const OrganizationFormModal = ({ organization, onClose, onSaved }: OrganizationFormModalProps) => {
  const { isEdit, register, control, errors, error, loading, onSubmit } = useOrganizationForm(organization, onSaved);

  return (
    <Modal title={isEdit ? "Ubah organisasi" : "Daftarkan organisasi"} description={isEdit ? "Perbarui nama organisasi." : "Organisasi baru beserta akun admin pertamanya."} icon={Building2} onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        {!isEdit && (
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input label="Kode organisasi" id="org-code" name={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} onChange={(e) => field.onChange(e.target.value.toLowerCase())} placeholder="mis. bpu-unpas" error={errors.code?.message} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah." />
            )}
          />
        )}
        <Input label="Nama organisasi" id="org-name" placeholder="mis. BPU Universitas Pasundan" error={errors.name?.message} {...register("name")} />
        {!isEdit && (
          <fieldset className="flex flex-col gap-4 rounded-field border border-neutral-line p-4">
            <legend className="px-1 text-sm font-semibold text-text-default">Administrator pertama</legend>
            <Input label="Nama" id="org-admin-name" placeholder="Nama lengkap" error={errors.adminName?.message} {...register("adminName")} />
            <Input label="Email" id="org-admin-email" type="email" autoComplete="off" placeholder="admin@organisasi.id" error={errors.adminEmail?.message} {...register("adminEmail")} />
            <Input label="Kata sandi awal" id="org-admin-password" type="password" autoComplete="new-password" showPasswordToggle placeholder="Kata sandi" error={errors.adminPassword?.message} hint={PASSWORD_RULE_HINT} {...register("adminPassword")} />
          </fieldset>
        )}
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={loading} className="sm:w-auto">
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default OrganizationFormModal;
