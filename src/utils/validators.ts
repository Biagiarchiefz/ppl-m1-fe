import { z } from "zod";

// Cermin aturan kata sandi backend (utils.ValidPassword) [ASUMSI PRD 6]:
// minimal 8 karakter, mengandung huruf dan angka, maksimal 72 byte.
// Backend tetap menjadi penentu akhir.
export function isValidPassword(password: string): boolean {
  const bytes = new TextEncoder().encode(password).length;
  return (
    [...password].length >= 8 &&
    bytes <= 72 &&
    /\p{L}/u.test(password) &&
    /\p{N}/u.test(password)
  );
}

export const PASSWORD_RULE_HINT =
  "Minimal 8 karakter, mengandung huruf dan angka.";

// ---------- Aturan field zod yang dipakai bersama oleh skema form.

export const REQUIRED_MESSAGE = "Isian ini wajib diisi";

/** Teks wajib (spasi saja dianggap kosong). Bila kosong, aturan berikutnya tidak dicek. */
export const requiredText = (message = REQUIRED_MESSAGE) =>
  z.string().refine((value) => value.trim() !== "", { error: message, abort: true });

/** Email wajib dengan format yang benar. */
export const emailField = () =>
  requiredText().refine((value) => z.email().safeParse(value.trim()).success, {
    error: "Format email tidak valid",
  });

/** Kata sandi wajib sesuai aturan backend. */
export const passwordField = (message = "Kata sandi tidak memenuhi aturan") =>
  z.string().refine(isValidPassword, { error: message });

/** Kode (peran, divisi, organisasi): huruf kecil, angka, - atau _. */
export const codeField = () =>
  requiredText().refine((value) => /^[a-z0-9_-]+$/.test(value), {
    error: "Hanya huruf kecil, angka, - atau _",
  });

/** Angka bulat positif yang boleh dikosongkan (dikirim sebagai null). */
export const optionalPositiveInt = () =>
  z.string().refine((value) => value.trim() === "" || /^[1-9]\d*$/.test(value.trim()), {
    error: "Harus berupa angka bulat positif",
  });

/** Field yang tidak divalidasi (mis. disembunyikan saat mode ubah). */
export const anyText = () => z.string();
