import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDateTime } from "../../../utils/formatDate";
import { applyServerErrors } from "../../../utils/formErrors";
import { changePassword } from "../services/auth.service";
import { changePasswordSchema } from "../schemas/auth.schema";
import type { ChangePasswordForm } from "../../../types";

const emptyForm: ChangePasswordForm = { old_password: "", new_password: "", confirmation: "" };

export function useChangePassword(onSaved: (message: string) => void) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    defaultValues: emptyForm,
    // Validasi ringan di klien; teks galat dari backend tetap diutamakan.
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordForm) => changePassword(values.old_password, values.new_password),
  });

  const fields = {
    old_password: register("old_password"),
    new_password: register("new_password"),
    confirmation: register("confirmation"),
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await mutation.mutateAsync(values);
      onSaved(`Kata sandi berhasil diubah pada ${formatDateTime(result.changed_at)}.`);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  });

  return {
    fields,
    errors,
    error: errors.root?.server?.message,
    loading: mutation.isPending,
    onSubmit,
  };
}
