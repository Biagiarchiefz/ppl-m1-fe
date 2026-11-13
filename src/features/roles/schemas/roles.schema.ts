import { z } from "zod";
import { anyText, codeField, requiredText } from "../../../utils/validators";
import type { RoleForm } from "../../../types";

// Kode peran hanya diisi saat membuat; setelah itu tidak bisa diubah.
export const roleSchema = (isEdit: boolean) =>
  z.object({
    code: isEdit ? anyText() : codeField(),
    name: requiredText(),
    description: z.string(),
    permissions: z.array(z.string()),
  }) satisfies z.ZodType<RoleForm, RoleForm>;
