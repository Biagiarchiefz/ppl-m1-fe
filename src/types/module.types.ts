// Menu modul kelompok lain (M2, M3, …) yang didaftarkan lewat
// src/config/modules.json. Lihat PANDUAN-INTEGRASI-MODUL.md.

// Satu entri di modules.json.
export interface ModuleMenu {
  id: string;
  label: string;
  path: string;
  icon: string;
  section?: string;
  superAdminOnly?: boolean;
  owner: string;
}
