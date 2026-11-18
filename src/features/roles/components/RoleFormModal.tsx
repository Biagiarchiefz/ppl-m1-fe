import { Shield } from "lucide-react";
import { Controller } from "react-hook-form";
import Modal, { ModalFooter } from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import Alert from "../../../components/common/Alert/Alert";
import FormSection from "../../../components/common/FormSection/FormSection";
import { groupByModule, toggleModule, togglePermission, useRoleForm } from "../hooks/useRoleForm";
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

// Kode dan deskripsi peran disembunyikan bila isinya sama dengan nama (mis. "Administrator"
// dan "administrator"), agar tidak terbaca dobel.
const sameLabel = (name: string, code: string) => name.trim().toLowerCase().replace(/[\s_-]+/g, "") === code.toLowerCase().replace(/[\s_-]+/g, "");

// Form baru dirender setelah hak akses peran termuat, agar nilai awal checkbox benar.
const RoleFormBody = ({ role, permissions, initialPermissions, onClose, onSaved }: RoleFormBodyProps) => {
  const { register, control, errors, error, loading, onSubmit } = useRoleForm(role, initialPermissions, onSaved);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      {error && <Alert>{error}</Alert>}
      {role ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-field border border-neutral-line bg-neutral-bg px-4 py-3">
          <p className="text-sm font-semibold text-text-strong">{role.name}</p>
          {!sameLabel(role.name, role.code) && <code className="rounded-full bg-neutral-soft px-2.5 py-0.5 font-mono text-xs text-text-muted">{role.code}</code>}
          {role.description && !sameLabel(role.name, role.description) && <p className="w-full text-xs text-text-subtle">{role.description}</p>}
        </div>
      ) : (
        <FormSection title="Data peran">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input label="Kode peran" id="role-code" name={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} onChange={(e) => field.onChange(e.target.value.toLowerCase())} placeholder="mis. kasir-toko" error={errors.code?.message} hint="Huruf kecil, angka, - atau _. Tidak bisa diubah." />
            )}
          />
          <Input label="Nama peran" id="role-name" placeholder="mis. Kasir Toko" error={errors.name?.message} {...register("name")} />
          <div className="sm:col-span-2">
            <Input label="Deskripsi (opsional)" id="role-desc" placeholder="Tugas peran ini" error={errors.description?.message} {...register("description")} />
          </div>
        </FormSection>
      )}

      <Controller
        control={control}
        name="permissions"
        render={({ field }) => {
          const selected = field.value;
          const allCodes = permissions.map((p) => p.code);
          const allChecked = allCodes.length > 0 && allCodes.every((code) => selected.includes(code));

          return (
            <FormSection
              title="Hak akses"
              aside={
                permissions.length > 0 && (
                  <div className="flex shrink-0 items-center gap-3 text-xs">
                    <span className="rounded-full bg-brand-primary-soft px-2.5 py-0.5 font-medium text-brand-primary">
                      {selected.length} dari {allCodes.length} dipilih
                    </span>
                    <button type="button" onClick={() => field.onChange(allChecked ? [] : allCodes)} className="font-medium text-link hover:underline">
                      {allChecked ? "Kosongkan" : "Pilih semua"}
                    </button>
                  </div>
                )
              }
            >
              {errors.permissions?.message && <p className="text-xs text-danger sm:col-span-2">{errors.permissions.message}</p>}
              {permissions.length === 0 && <p className="text-sm text-text-muted sm:col-span-2">Katalog hak akses belum tersedia.</p>}
              {groupByModule(permissions).map(([module, perms]) => {
                const codes = perms.map((p) => p.code);
                const checkedCount = codes.filter((code) => selected.includes(code)).length;
                const moduleChecked = checkedCount === codes.length;

                return (
                  <fieldset key={module} aria-label={`Modul ${module}`} className="flex flex-col gap-1.5 rounded-card border border-neutral-line bg-neutral-bg p-3">
                    <div className="flex items-center justify-between gap-2 px-1 pb-1">
                      <span className="text-xs font-semibold tracking-wide text-text-strong uppercase">Modul {module}</span>
                      <button type="button" onClick={() => field.onChange(toggleModule(selected, codes))} className="text-xs font-medium text-link hover:underline">
                        {moduleChecked ? "Kosongkan" : `Pilih semua (${checkedCount}/${codes.length})`}
                      </button>
                    </div>
                    {perms.map((p) => {
                      const checked = selected.includes(p.code);
                      return (
                        <label
                          key={p.code}
                          className={`flex cursor-pointer items-start gap-2.5 rounded-field border px-3 py-2 text-sm transition-colors duration-150 ${
                            checked ? "border-brand-accent/40 bg-brand-primary-soft" : "border-transparent bg-neutral-surface hover:border-neutral-line-strong"
                          }`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => field.onChange(togglePermission(selected, p.code))} className="mt-0.5 size-4 shrink-0 accent-brand-primary" />
                          <span className="min-w-0">
                            <span className="block leading-5 text-text-default">{p.description}</span>
                            <span className="block truncate font-mono text-[11px] text-text-subtle">{p.code}</span>
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                );
              })}
            </FormSection>
          );
        }}
      />

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" loading={loading} className="sm:w-auto">
          {loading ? "Menyimpan..." : role ? "Simpan hak akses" : "Tambah peran"}
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
      title={role ? "Atur hak akses peran" : "Tambah peran"}
      description={role ? "Hak akses yang dipilih menggantikan seluruh hak akses peran ini." : "Pilih hak akses yang dimiliki pengguna dengan peran ini."}
      icon={Shield}
      size="xl"
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
        <p className="py-6 text-center text-sm text-text-muted">Memuat hak akses peran...</p>
      ) : (
        <RoleFormBody {...props} initialPermissions={permissionCodes} />
      )}
    </Modal>
  );
};

export default RoleFormModal;
