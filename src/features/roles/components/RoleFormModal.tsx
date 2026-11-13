import { useState, type FormEvent } from "react";
import { Shield } from "lucide-react";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { ApiError } from "../../../services/api";
import { createRole, updateRole, type Permission, type Role } from "..";

interface RoleFormModalProps {
  role: Role | null; // null = peran baru
  permissions: Permission[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

function groupByModule(permissions: Permission[]): [string, Permission[]][] {
  const groups = new Map<string, Permission[]>();
  permissions.forEach((p) => groups.set(p.module, [...(groups.get(p.module) ?? []), p]));
  return [...groups.entries()];
}

const RoleFormModal = ({ role, permissions, onClose, onSaved }: RoleFormModalProps) => {
  const isEdit = role !== null;
  const [code, setCode] = useState(role?.code ?? "");
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [selected, setSelected] = useState<string[]>(role?.permissions ?? []);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (perm: string) =>
    setSelected((cur) => (cur.includes(perm) ? cur.filter((p) => p !== perm) : [...cur, perm]));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFields({});
    const body = { name, description: description.trim() || null, permissions: selected };
    try {
      if (isEdit) await updateRole(role.id, body);
      else await createRole({ ...body, code });
      onSaved(isEdit ? "Peran berhasil diperbarui." : "Peran baru berhasil ditambahkan.");
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message ?? "Terjadi kesalahan pada server");
      setFields(apiError?.fields ?? {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={isEdit ? "Ubah peran" : "Tambah peran"} description="Pilih izin yang dimiliki pengguna dengan peran ini." icon={Shield} size="lg" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        {!isEdit && (
          <Input label="Kode peran" id="role-code" name="code" value={code} onChange={(e) => setCode(e.target.value.toLowerCase())} placeholder="mis. kasir-toko" error={fields.code} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah setelah dibuat; dipakai di klaim token." />
        )}
        <Input label="Nama peran" id="role-name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Kasir Toko" error={fields.name} />
        <Input label="Deskripsi (opsional)" id="role-desc" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tugas peran ini" />

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-sm font-semibold text-text-default">Izin</legend>
          {fields.permissions && <p className="text-xs text-danger">{fields.permissions}</p>}
          {groupByModule(permissions).map(([module, perms]) => (
            <div key={module} className="rounded-field border border-neutral-line p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-subtle">Modul {module}</p>
              {perms.map((p) => (
                <label key={p.code} className="flex cursor-pointer items-start gap-2 py-1 text-sm">
                  <input type="checkbox" checked={selected.includes(p.code)} onChange={() => toggle(p.code)} className="mt-1 accent-brand-primary" />
                  <span>
                    <span className="text-text-default">{p.description}</span>
                    <span className="block font-mono text-xs text-text-muted">{p.code}</span>
                  </span>
                </label>
              ))}
            </div>
          ))}
        </fieldset>

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

export default RoleFormModal;
