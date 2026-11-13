import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRole, roleKeys, updateRole } from "../services/roles.service";
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

// role = null berarti peran baru.
export function useRoleForm(role: Role | null, onSaved: (message: string) => void) {
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
      permissions: role?.permissions ?? [],
    },
    resolver: zodResolver(roleSchema(isEdit)),
  });

  const mutation = useApiMutation((form: RoleForm) => {
    const body = { name: form.name, description: form.description.trim() || null, permissions: form.permissions };
    return role ? updateRole(role.id, body) : createRole({ ...body, code: form.code });
  }, [roleKeys.all]);

  const onSubmit = handleSubmit(async (form) => {
    try {
      await mutation.mutateAsync(form);
      onSaved(isEdit ? "Peran berhasil diperbarui." : "Peran baru berhasil ditambahkan.");
    } catch (err) {
      applyServerErrors(err, setError);
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
