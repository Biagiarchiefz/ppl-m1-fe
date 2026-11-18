import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, updateUser, userKeys } from "../services/users.service";
import { userSchema } from "../schemas/users.schema";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { applyServerErrors } from "../../../utils/formErrors";
import type { CreateUserInput, UpdateUserInput, User, UserFormState } from "../../../types";

function initialForm(user: User | null): UserFormState {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "",
    division: user?.division ?? "",
    unit_usaha_id: user?.unit_usaha_id == null ? "" : String(user.unit_usaha_id),
  };
}

// POST /users: partner_id tidak dikirim (opsional di backend, akun disimpan
// dengan partner_id NULL); unit usaha kosong dikirim sebagai null (Panduan 4.5).
function toCreatePayload(form: UserFormState): CreateUserInput {
  const unit = form.unit_usaha_id.trim();
  return {
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
    division: form.division,
    unit_usaha_id: unit === "" ? null : Number(unit),
  };
}

// PATCH /users/{id}: email dan partner_id tidak bisa diubah, dan
// unit_usaha_id tidak menerima null, jadi field kosong tidak dikirim.
function toUpdatePayload(form: UserFormState): UpdateUserInput {
  const unit = form.unit_usaha_id.trim();
  return {
    name: form.name,
    role: form.role,
    division: form.division,
    unit_usaha_id: unit === "" ? undefined : Number(unit),
  };
}

// user = null berarti tambah akun baru.
export function useUserForm(user: User | null, onSaved: (message: string) => void) {
  const isEdit = user !== null;
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormState>({
    defaultValues: initialForm(user),
    resolver: zodResolver(userSchema(isEdit)),
  });

  const mutation = useApiMutation(
    (form: UserFormState) => (user ? updateUser(user.id, toUpdatePayload(form)) : createUser(toCreatePayload(form))),
    [userKeys.all],
  );

  const onSubmit = handleSubmit(async (form) => {
    try {
      await mutation.mutateAsync(form);
      onSaved(isEdit ? "Data pengguna berhasil diperbarui." : "Pengguna baru berhasil ditambahkan.");
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
