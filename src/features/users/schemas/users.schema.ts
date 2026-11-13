import { z } from "zod";
import { anyText, emailField, optionalPositiveInt, passwordField, requiredText } from "../../../utils/validators";
import type { UserFormState } from "../../../types";

// Email dan kata sandi awal hanya diisi saat menambah akun; saat mengubah,
// field itu disembunyikan sehingga tidak divalidasi.
export const userSchema = (isEdit: boolean) =>
  z.object({
    name: requiredText(),
    email: isEdit ? anyText() : emailField(),
    password: isEdit ? anyText() : passwordField(),
    role: requiredText("Pilih peran"),
    division: z.string(),
    unit_usaha_id: optionalPositiveInt(),
  }) satisfies z.ZodType<UserFormState, UserFormState>;
