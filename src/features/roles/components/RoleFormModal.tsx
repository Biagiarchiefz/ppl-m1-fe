import { Shield } from "lucide-react";
import { Controller } from "react-hook-form";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import { groupByModule, togglePermission, useRoleForm } from "../hooks/useRoleForm";
import { useRolePermissions } from "../hooks/useRolePermissions";
import type { Permission, Role } from "../../../types";

interface RoleFormModalProps {
  role: Role | null; // null = peran baru
  permissions: Permission[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface RoleFormBodyProps extends RoleFormModalProps {
  initialPermissions: string[];
}

// Form baru dirender setelah izin peran termuat, agar nilai awal checkbox benar.
const RoleFormBody = ({ role, permissions, initialPermissions, onClose, onSaved }: RoleFormBodyProps) => {
  const { register, control, errors, error, loading, onSubmit } = useRoleForm(role, initialPermissions, onSaved);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && <Alert>{error}</Alert>}
      {role ? (
        <div className="rounded-field border border-neutral-line bg-neutral-bg p-3">
          <p className="text-sm font-semibold text-text-default">{role.name}</p>
          <p className="font-mono text-xs text-text-muted">{role.code}</p>
          {role.description && <p className="mt-1 text-xs text-text-muted">{role.description}</p>}
        </div>
      ) : (
        <>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input label="Kode peran" id="role-code" name={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} onChange={(e) => field.onChange(e.target.value.toLowerCase())} placeholder="mis. kasir-toko" error={errors.code?.message} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah setelah dibuat; dipakai di klaim token." />
            )}
          />
          <Input label="Nama peran" id="role-name" placeholder="mis. Kasir Toko" error={errors.name?.message} {...register("name")} />
          <Input label="Deskripsi (opsional)" id="role-desc" placeholder="Tugas peran ini" error={errors.description?.message} {...register("description")} />
        </>
      )}

      <Controller
        control={control}
        name="permissions"
        render={({ field }) => (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sm font-semibold text-text-default">Izin</legend>
            {errors.permissions?.message && <p className="text-xs text-danger">{errors.permissions.message}</p>}
            {permissions.length === 0 && <p className="text-sm text-text-muted">Katalog izin belum tersedia.</p>}
            {groupByModule(permissions).map(([module, perms]) => (
              <div key={module} className="rounded-field border border-neutral-line p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-subtle">Modul {module}</p>
                {perms.map((p) => (
                  <label key={p.code} className="flex cursor-pointer items-start gap-2 py-1 text-sm">
                    <input type="checkbox" checked={field.value.includes(p.code)} onChange={() => field.onChange(togglePermission(field.value, p.code))} className="mt-1 accent-brand-primary" />
                    <span>
                      <span className="text-text-default">{p.description}</span>
                      <span className="block font-mono text-xs text-text-muted">{p.code}</span>
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </fieldset>
        )}
      />

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" loading={loading} className="sm:w-auto">
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </ModalFooter>
    </form>
  );
};

const RoleFormModal = (props: RoleFormModalProps) => {
  const { role, onClose } = props;
  const { permissionCodes, error } = useRolePermissions(role);

  return (
    <Modal
      title={role ? "Atur izin peran" : "Tambah peran"}
      description={role ? "Izin yang dipilih menggantikan seluruh izin peran ini." : "Pilih izin yang dimiliki pengguna dengan peran ini."}
      icon={Shield}
      size="lg"
      onClose={onClose}
    >
      {error ? (
        <>
          <Alert>{error}</Alert>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Tutup
            </Button>
          </ModalFooter>
        </>
      ) : permissionCodes === null ? (
        <p className="py-6 text-center text-sm text-text-muted">Memuat izin peran...</p>
      ) : (
        <RoleFormBody {...props} initialPermissions={permissionCodes} />
      )}
    </Modal>
  );
};

export default RoleFormModal;
