import { useState, type FormEvent } from "react";
import { UserPen, UserPlus } from "lucide-react";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Select from "../../../components/common/Select/Select";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { ApiError } from "../../../services/api";
import { PASSWORD_RULE_HINT } from "../../../utils/validators";
import { createUser, updateUser, type Reference, type User } from "..";

interface UserFormModalProps {
  user: User | null; // null = tambah akun baru
  roles: Reference[];
  divisions: Reference[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: string;
  division: string;
  unit_usaha_id: string;
}

function initialForm(user: User | null): FormState {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "",
    division: user?.division ?? "",
    unit_usaha_id: user?.unit_usaha_id == null ? "" : String(user.unit_usaha_id),
  };
}

// Field kosong dikirim sebagai null (Panduan 4.5), bukan teks kosong.
function toPayload(form: FormState) {
  const unit = form.unit_usaha_id.trim();
  return {
    name: form.name,
    role: form.role,
    division: form.division || null,
    unit_usaha_id: unit === "" ? null : Number(unit),
  };
}

const toOptions = (items: Reference[]) => items.map((it) => ({ value: it.code, label: it.name }));

const UserFormModal = ({ user, roles, divisions, onClose, onSaved }: UserFormModalProps) => {
  const isEdit = user !== null;
  const [form, setForm] = useState(() => initialForm(user));
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormState) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFields({});
    try {
      if (isEdit) {
        await updateUser(user.id, toPayload(form));
        onSaved("Data pengguna berhasil diperbarui.");
      } else {
        await createUser({ ...toPayload(form), email: form.email, password: form.password });
        onSaved("Pengguna baru berhasil ditambahkan.");
      }
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message ?? "Terjadi kesalahan pada server");
      setFields(apiError?.fields ?? {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={isEdit ? "Ubah pengguna" : "Tambah pengguna"} description={isEdit ? "Perbarui peran, divisi, atau unit usaha pengguna." : "Akun baru langsung bisa dipakai untuk masuk."} icon={isEdit ? UserPen : UserPlus} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Nama lengkap" id="user-name" name="name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="Masukkan nama lengkap" error={fields.name} />
        {!isEdit && (
          <>
            <Input label="Email" id="user-email" name="email" type="email" autoComplete="off" value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder="nama@contoh.id" error={fields.email} />
            <Input label="Kata sandi awal" id="user-password" name="password" type="password" autoComplete="new-password" showPasswordToggle value={form.password} onChange={(e) => set("password")(e.target.value)} placeholder="Masukkan kata sandi" error={fields.password} hint={PASSWORD_RULE_HINT} />
          </>
        )}
        <Select label="Peran" id="user-role" value={form.role} options={toOptions(roles)} onChange={set("role")} placeholder="Pilih peran" error={fields.role} />
        <Select label="Divisi" id="user-division" value={form.division} options={toOptions(divisions)} onChange={set("division")} placeholder="Tanpa divisi" error={fields.division} />
        <Input label="ID unit usaha (opsional)" id="user-unit" name="unit_usaha_id" type="number" value={form.unit_usaha_id} onChange={(e) => set("unit_usaha_id")(e.target.value)} placeholder="Kosongkan bila tidak terikat unit usaha" error={fields.unit_usaha_id} />
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

export default UserFormModal;
