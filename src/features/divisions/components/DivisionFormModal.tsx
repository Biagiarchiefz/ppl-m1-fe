import { FolderTree } from "lucide-react";
import { Controller } from "react-hook-form";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { useDivisionForm } from "../hooks/useDivisionForm";
import type { Division } from "../../../types";

interface DivisionFormModalProps {
  division: Division | null; // null = divisi baru
  onClose: () => void;
  onSaved: (message: string) => void;
}

const DivisionFormModal = ({ division, onClose, onSaved }: DivisionFormModalProps) => {
  const { isEdit, register, control, errors, error, loading, onSubmit } = useDivisionForm(division, onSaved);

  return (
    <Modal title={isEdit ? "Ubah divisi" : "Tambah divisi"} description={isEdit ? "Kode divisi tidak bisa diubah, hanya namanya." : "Divisi dipakai untuk mengelompokkan pengguna."} icon={FolderTree} size="sm" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        {!isEdit && (
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input label="Kode divisi" id="division-code" name={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} onChange={(e) => field.onChange(e.target.value.toLowerCase())} placeholder="mis. penjualan" error={errors.code?.message} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah; dipakai di klaim token." />
            )}
          />
        )}
        <Input label="Nama divisi" id="division-name" placeholder="mis. Penjualan" error={errors.name?.message} {...register("name")} />
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

export default DivisionFormModal;
