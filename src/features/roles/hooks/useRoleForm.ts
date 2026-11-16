import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRole, roleKeys, setRolePermissions } from "../services/roles.service";
import { roleSchema } from "../schemas/roles.schema";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { applyServerErrors } from "../../../utils/formErrors";
import type { Permission, Role, RoleForm } from "../../../types";

export function groupByModule(permissions: Permission[]): [string, Permission[]][] {
  const groups = new Map<string, Permission[]>();
  permissions.forEach((p) => groups.set(p.module, [...(groups.get(p.module) ?? []), p]));
  return [...groups.entries()];
}

export const togglePermission = (selected: string[], perm: string) =>
  selected.includes(perm) ? selected.filter((p) => p !== perm) : [...selected, perm];

// role = null berarti peran baru (POST /roles). Untuk peran yang sudah ada,
// backend hanya mengizinkan penggantian daftar izin (PUT /roles/{id}/permissions).
export function useRoleForm(role: Role | null, initialPermissions: string[], onSaved: (message: string) => void) {
  const isEdit = role !== null;
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RoleForm>({
    defaultValues: {
      code: role?.code ?? "",
      name: role?.name ?? "",
      description: role?.description ?? "",
      permissions: initialPermissions,
    },
    resolver: zodResolver(roleSchema(isEdit)),
  });

  const mutation = useApiMutation(
    (form: RoleForm): Promise<unknown> =>
      role
        ? setRolePermissions(role.id, form.permissions)
        : createRole({
            code: form.code,
            name: form.name,
            // Deskripsi bertipe string (tidak nullable) di backend; kosong = tidak dikirim.
            description: form.description.trim() || undefined,
            permission_codes: form.permissions,
          }),
    [roleKeys.all],
  );

  const onSubmit = handleSubmit(async (form) => {
    try {
      await mutation.mutateAsync(form);
      onSaved(role ? `Izin peran ${role.name} berhasil diperbarui.` : "Peran baru berhasil ditambahkan.");
    } catch (err) {
      applyServerErrors(err, setError, { permission_codes: "permissions" });
    }
  });

  return {
    isEdit,
    register,
    control,
    errors,
    error: errors.root?.server?.message,
    loading: mutation.isPending,
    onSubmit,
  };
}
