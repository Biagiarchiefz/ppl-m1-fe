// Base URL API M1. Saat development, Vite mem-proxy `/api` ke backend
// (lihat vite.config.ts), jadi nilai bawaan cukup path relatif.
// Untuk deploy, isi VITE_API_BASE_URL, misalnya https://server/api/m1/v1
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "/api/m1/v1";
