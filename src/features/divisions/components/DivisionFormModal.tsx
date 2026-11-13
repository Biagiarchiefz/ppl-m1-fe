import { useState, type FormEvent } from "react";
import { FolderTree } from "lucide-react";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { ApiError } from "../../../services/api";
import { createDivision, renameDivision, type Division } from "..";

interface DivisionFormModalProps {
  division: Division | null; // null = divisi baru
  onClose: () => void;
  onSaved: (message: string) => void;
}

const DivisionFormModal = ({ division, onClose, onSaved }: DivisionFormModalProps) => {
  const isEdit = division !== null;
  const [code, setCode] = useState(division?.code ?? "");
  const [name, setName] = useState(division?.name ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFields({});
    try {
      if (isEdit) await renameDivision(division.id, name);
      else await createDivision(code, name);
      onSaved(isEdit ? "Divisi berhasil diperbarui." : "Divisi baru berhasil ditambahkan.");
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message ?? "Terjadi kesalahan pada server");
      setFields(apiError?.fields ?? {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={isEdit ? "Ubah divisi" : "Tambah divisi"} description={isEdit ? "Kode divisi tidak bisa diubah, hanya namanya." : "Divisi dipakai untuk mengelompokkan pengguna."} icon={FolderTree} size="sm" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        {!isEdit && (
          <Input label="Kode divisi" id="division-code" name="code" value={code} onChange={(e) => setCode(e.target.value.toLowerCase())} placeholder="mis. penjualan" error={fields.code} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah; dipakai di klaim token." />
        )}
        <Input label="Nama divisi" id="division-name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Penjualan" error={fields.name} />
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
