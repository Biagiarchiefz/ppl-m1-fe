import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, updateUser, userKeys } from "../services/users.service";
import { userSchema } from "../schemas/users.schema";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { applyServerErrors } from "../../../utils/formErrors";
import type { User, UserFormState } from "../../../types";

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

// Field kosong dikirim sebagai null (Panduan 4.5), bukan teks kosong.
function toPayload(form: UserFormState) {
  const unit = form.unit_usaha_id.trim();
  return {
    name: form.name,
    role: form.role,
    division: form.division || null,
    unit_usaha_id: unit === "" ? null : Number(unit),
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
    (form: UserFormState) =>
      user
        ? updateUser(user.id, toPayload(form))
        : createUser({ ...toPayload(form), email: form.email, password: form.password }),
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
