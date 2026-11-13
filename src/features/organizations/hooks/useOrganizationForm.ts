import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganization, organizationKeys, renameOrganization } from "../services/organizations.service";
import { organizationSchema } from "../schemas/organizations.schema";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { applyServerErrors } from "../../../utils/formErrors";
import type { Organization, OrganizationForm } from "../../../types";

const empty: OrganizationForm = { code: "", name: "", adminName: "", adminEmail: "", adminPassword: "" };

// Nama field backend → nama field form admin pertama.
const SERVER_FIELDS = {
  "admin.name": "adminName",
  "admin.email": "adminEmail",
  email: "adminEmail",
  "admin.password": "adminPassword",
} as const;

// organization = null berarti organisasi baru beserta admin pertamanya.
export function useOrganizationForm(organization: Organization | null, onSaved: (message: string) => void) {
  const isEdit = organization !== null;
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OrganizationForm>({
    defaultValues: { ...empty, code: organization?.code ?? "", name: organization?.name ?? "" },
    resolver: zodResolver(organizationSchema(isEdit)),
  });

  const mutation = useApiMutation(async (form: OrganizationForm) => {
    if (organization) {
      await renameOrganization(organization.id, form.name);
      return "Organisasi berhasil diperbarui.";
    }
    const res = await createOrganization({
      code: form.code,
      name: form.name,
      admin: { name: form.adminName, email: form.adminEmail, password: form.adminPassword },
    });
    return `Organisasi ${res.name} dibuat. Administrator: ${res.admin.email}.`;
  }, [organizationKeys.all]);

  const onSubmit = handleSubmit(async (form) => {
    try {
      onSaved(await mutation.mutateAsync(form));
    } catch (err) {
      applyServerErrors(err, setError, SERVER_FIELDS);
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
