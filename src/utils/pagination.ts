import type { ListMeta } from "../types";

// Jumlah baris per halaman di semua tabel. Pagination hanya tampil bila
// total data lebih dari nilai ini.
export const PAGE_SIZE = 15;

// Nomor urut baris lintas halaman, mis. halaman 2 dimulai dari 16.
// Memakai meta dari respons agar tetap benar saat data halaman lama masih tampil.
export function rowNumber(meta: ListMeta | null | undefined, index: number): number {
  const page = meta?.page ?? 1;
  const perPage = meta?.per_page ?? PAGE_SIZE;
  return (page - 1) * perPage + index + 1;
}
