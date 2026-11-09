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
