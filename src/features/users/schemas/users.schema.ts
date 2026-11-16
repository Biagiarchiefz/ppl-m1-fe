import { z } from "zod";
import { anyText, emailField, optionalPositiveInt, passwordField, positiveInt, requiredText } from "../../../utils/validators";
import type { UserFormState } from "../../../types";

// Partner, email, dan kata sandi awal hanya diisi saat menambah akun; saat
// mengubah, field itu disembunyikan sehingga tidak divalidasi.
export const userSchema = (isEdit: boolean) =>
  z.object({
    partner_id: isEdit ? anyText() : positiveInt(),
    name: requiredText(),
    email: isEdit ? anyText() : emailField(),
    password: isEdit ? anyText() : passwordField(),
    role: requiredText("Pilih peran"),
    division: requiredText("Pilih divisi"),
    unit_usaha_id: optionalPositiveInt(),
  }) satisfies z.ZodType<UserFormState, UserFormState>;
