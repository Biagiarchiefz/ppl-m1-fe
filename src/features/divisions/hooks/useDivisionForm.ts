import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDivision, divisionKeys, renameDivision } from "../services/divisions.service";
import { divisionSchema } from "../schemas/divisions.schema";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { applyServerErrors } from "../../../utils/formErrors";
import type { Division, DivisionForm } from "../../../types";

// division = null berarti divisi baru.
export function useDivisionForm(division: Division | null, onSaved: (message: string) => void) {
  const isEdit = division !== null;
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DivisionForm>({
    defaultValues: { code: division?.code ?? "", name: division?.name ?? "" },
    resolver: zodResolver(divisionSchema(isEdit)),
  });

  const mutation = useApiMutation(
    (form: DivisionForm) => (division ? renameDivision(division.id, form.name) : createDivision(form.code, form.name)),
    [divisionKeys.all],
  );

  const onSubmit = handleSubmit(async (form) => {
    try {
      await mutation.mutateAsync(form);
      onSaved(isEdit ? "Divisi berhasil diperbarui." : "Divisi baru berhasil ditambahkan.");
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
