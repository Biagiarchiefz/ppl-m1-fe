import { useState, type FormEvent } from "react";
import Modal from "../../../components/common/Modal/Modal";
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
    <Modal title={isEdit ? "Ubah divisi" : "Tambah divisi"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        {!isEdit && (
          <Input label="Kode divisi" id="division-code" name="code" value={code} onChange={(e) => setCode(e.target.value.toLowerCase())} placeholder="mis. penjualan" error={fields.code} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah; dipakai di klaim token." />
        )}
        <Input label="Nama divisi" id="division-name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Penjualan" error={fields.name} />
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-field border border-neutral-line px-4 text-sm font-semibold text-text-muted hover:bg-neutral-bg">
            Batal
          </button>
          <Button type="submit" disabled={loading} className="w-auto! px-5 disabled:cursor-wait disabled:opacity-70">
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DivisionFormModal;
