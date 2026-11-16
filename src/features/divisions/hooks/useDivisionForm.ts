import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDivision, divisionKeys } from "../services/divisions.service";
import { divisionSchema } from "../schemas/divisions.schema";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { applyServerErrors } from "../../../utils/formErrors";
import type { DivisionForm } from "../../../types";

// Tambah divisi global (POST /divisions). Backend belum menyediakan ubah divisi.
export function useDivisionForm(onSaved: (message: string) => void) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DivisionForm>({
    defaultValues: { code: "", name: "" },
    resolver: zodResolver(divisionSchema),
  });

  const mutation = useApiMutation((form: DivisionForm) => createDivision(form.code, form.name), [divisionKeys.all]);

  const onSubmit = handleSubmit(async (form) => {
    try {
      await mutation.mutateAsync(form);
      onSaved("Divisi baru berhasil ditambahkan.");
    } catch (err) {
      applyServerErrors(err, setError);
    }
  });

  return {
    register,
    control,
    errors,
    error: errors.root?.server?.message,
    loading: mutation.isPending,
    onSubmit,
  };
}
