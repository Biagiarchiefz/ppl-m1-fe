import type { LucideIcon } from "lucide-react";

// Menu sidebar AdminLayout (lihat src/config/navigation.ts).

export interface NavItem {
  // Komponen ikon untuk menu M1, atau nama ikon lucide untuk menu modul lain.
  icon: LucideIcon | string;
  label: string;
  to: string;
  superAdminOnly?: boolean; // tampil hanya untuk super admin
  exact?: boolean; // aktif hanya bila path persis sama (mis. /admin)
  // Menu modul lain (aplikasi terpisah): dibuka dengan muat ulang halaman,
  // bukan lewat router M1.
  external?: boolean;
}

export interface NavSection {
  title: string;
  // true: seluruh item di section ini khusus super admin.
  superAdminOnly?: boolean;
  items: NavItem[];
}

// Halaman aktif untuk breadcrumb navbar.
export interface ActivePage {
  section: string;
  label: string;
}
