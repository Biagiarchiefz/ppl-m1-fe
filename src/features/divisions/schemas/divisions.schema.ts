import { z } from "zod";
import { anyText, codeField, requiredText } from "../../../utils/validators";
import type { DivisionForm } from "../../../types";

// Kode divisi hanya diisi saat membuat; setelah itu hanya nama yang bisa diubah.
export const divisionSchema = (isEdit: boolean) =>
  z.object({
    code: isEdit ? anyText() : codeField(),
    name: requiredText(),
  }) satisfies z.ZodType<DivisionForm, DivisionForm>;
