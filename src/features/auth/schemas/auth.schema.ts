import { z } from "zod";
import { emailField, isValidPassword, requiredText } from "../../../utils/validators";
import type { ChangePasswordForm, LoginForm } from "../../../types";

export const loginSchema = z.object({
  email: emailField(),
  password: requiredText(),
  remember: z.boolean(),
}) satisfies z.ZodType<LoginForm, LoginForm>;

// Kata sandi baru harus memenuhi aturan dan berbeda dari yang lama;
// konfirmasi harus sama dengan kata sandi baru.
export const changePasswordSchema = z
  .object({
    old_password: requiredText(),
    new_password: z.string(),
    confirmation: z.string(),
  })
  .refine((v) => isValidPassword(v.new_password) && v.new_password !== v.old_password, {
    path: ["new_password"],
    error: "Kata sandi baru tidak memenuhi aturan",
  })
  .refine((v) => v.confirmation === v.new_password, {
    path: ["confirmation"],
    error: "Konfirmasi kata sandi tidak cocok",
  }) satisfies z.ZodType<ChangePasswordForm, ChangePasswordForm>;
