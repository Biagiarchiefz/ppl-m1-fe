import { z } from "zod";
import { anyText, codeField, emailField, passwordField, requiredText } from "../../../utils/validators";
import type { OrganizationForm } from "../../../types";

// Saat mendaftarkan organisasi, kode dan akun admin pertama wajib diisi.
// Saat mengubah, hanya nama organisasi yang tampil dan divalidasi.
export const organizationSchema = (isEdit: boolean) =>
  z.object({
    code: isEdit ? anyText() : codeField(),
    name: requiredText(),
    adminName: isEdit ? anyText() : requiredText(),
    adminEmail: isEdit ? anyText() : emailField(),
    adminPassword: isEdit ? anyText() : passwordField(),
  }) satisfies z.ZodType<OrganizationForm, OrganizationForm>;
