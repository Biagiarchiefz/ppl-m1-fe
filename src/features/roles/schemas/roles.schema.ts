import { z } from "zod";
import { anyText, codeField, requiredText } from "../../../utils/validators";
import type { RoleForm } from "../../../types";

// Kode, nama, dan deskripsi hanya diisi saat membuat peran; saat mengubah,
// hanya daftar izin yang dikirim sehingga field lain tidak divalidasi.
export const roleSchema = (isEdit: boolean) =>
  z.object({
    code: isEdit ? anyText() : codeField(),
    name: isEdit ? anyText() : requiredText(),
    description: z.string(),
    permissions: z.array(z.string()),
  }) satisfies z.ZodType<RoleForm, RoleForm>;
