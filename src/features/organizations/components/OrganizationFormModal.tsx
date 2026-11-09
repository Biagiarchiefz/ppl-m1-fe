import { useState, type FormEvent } from "react";
import Modal from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { ApiError } from "../../../services/api";
import { PASSWORD_RULE_HINT } from "../../../utils/validators";
import { createOrganization, renameOrganization, type Organization } from "..";

interface OrganizationFormModalProps {
  organization: Organization | null; // null = organisasi baru
  onClose: () => void;
  onSaved: (message: string) => void;
}

const empty = { code: "", name: "", adminName: "", adminEmail: "", adminPassword: "" };

const OrganizationFormModal = ({ organization, onClose, onSaved }: OrganizationFormModalProps) => {
  const isEdit = organization !== null;
  const [form, setForm] = useState({ ...empty, code: organization?.code ?? "", name: organization?.name ?? "" });
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof empty) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    if (isEdit) {
      await renameOrganization(organization.id, form.name);
      return "Organisasi berhasil diperbarui.";
    }
    const res = await createOrganization({
      code: form.code,
      name: form.name,
      admin: { name: form.adminName, email: form.adminEmail, password: form.adminPassword },
    });
    return `Organisasi ${res.name} dibuat. Administrator: ${res.admin.email}.`;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFields({});
    try {
      onSaved(await save());
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message ?? "Terjadi kesalahan pada server");
      setFields(apiError?.fields ?? {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={isEdit ? "Ubah organisasi" : "Daftarkan organisasi"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        {!isEdit && (
          <Input label="Kode organisasi" id="org-code" name="code" value={form.code} onChange={(e) => set("code")(e.target.value.toLowerCase())} placeholder="mis. bpu-unpas" error={fields.code} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah." />
        )}
        <Input label="Nama organisasi" id="org-name" name="name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="mis. BPU Universitas Pasundan" error={fields.name} />
        {!isEdit && (
          <fieldset className="flex flex-col gap-4 rounded-field border border-neutral-line p-4">
            <legend className="px-1 text-sm font-semibold text-text-default">Administrator pertama</legend>
            <Input label="Nama" id="org-admin-name" name="admin-name" value={form.adminName} onChange={(e) => set("adminName")(e.target.value)} placeholder="Nama lengkap" error={fields["admin.name"]} />
            <Input label="Email" id="org-admin-email" name="admin-email" type="email" autoComplete="off" value={form.adminEmail} onChange={(e) => set("adminEmail")(e.target.value)} placeholder="admin@organisasi.id" error={fields["admin.email"] ?? fields.email} />
            <Input label="Kata sandi awal" id="org-admin-password" name="admin-password" type="password" autoComplete="new-password" showPasswordToggle value={form.adminPassword} onChange={(e) => set("adminPassword")(e.target.value)} placeholder="Kata sandi" error={fields["admin.password"]} hint={PASSWORD_RULE_HINT} />
          </fieldset>
        )}
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

export default OrganizationFormModal;
