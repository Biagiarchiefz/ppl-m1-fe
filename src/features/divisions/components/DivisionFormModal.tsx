import { FolderTree } from "lucide-react";
import { Controller } from "react-hook-form";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { useDivisionForm } from "../hooks/useDivisionForm";

interface DivisionFormModalProps {
  onClose: () => void;
  onSaved: (message: string) => void;
}

const DivisionFormModal = ({ onClose, onSaved }: DivisionFormModalProps) => {
  const { register, control, errors, error, loading, onSubmit } = useDivisionForm(onSaved);

  return (
    <Modal title="Tambah divisi" description="Divisi global dipakai untuk mengelompokkan pengguna di semua partner." icon={FolderTree} size="sm" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <Input label="Kode divisi" id="division-code" name={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} onChange={(e) => field.onChange(e.target.value.toLowerCase())} placeholder="mis. penjualan" error={errors.code?.message} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah; dipakai di klaim token." />
          )}
        />
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
