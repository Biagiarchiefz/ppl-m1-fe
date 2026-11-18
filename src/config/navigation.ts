import { FolderTree, History, LayoutDashboard, Shield, Users } from "lucide-react";
import { isSuperAdmin } from "../store";
import { DEFAULT_MODULE_SECTION, moduleMenus } from "./modules";
import type { ActivePage, NavItem, NavSection, SessionUser } from "../types";

// Menu M1. Tidak ada lagi role admin biasa: semua menu pengelolaan khusus super admin.
const M1_SECTIONS: NavSection[] = [
  {
    title: "Utama",
    superAdminOnly: true,
    items: [{ icon: LayoutDashboard, label: "Dashboard", to: "/admin", exact: true }],
  },
  {
    title: "Pengguna & akses",
    superAdminOnly: true,
    items: [
      { icon: Users, label: "Pengguna", to: "/admin/users" },
      { icon: Shield, label: "Peran & hak akses", to: "/admin/roles" },
      { icon: FolderTree, label: "Divisi", to: "/admin/divisions" },
      { icon: History, label: "Audit log", to: "/admin/audit-logs" },
    ],
  },
];

// Menu modul kelompok lain dari src/config/modules.json, dikelompokkan per
// `section` sesuai urutan di file (lihat PANDUAN-INTEGRASI-MODUL.md).
function moduleSections(): NavSection[] {
  const bySection = new Map<string, NavItem[]>();
  for (const m of moduleMenus) {
    const title = m.section ?? DEFAULT_MODULE_SECTION;
    bySection.set(title, [
      ...(bySection.get(title) ?? []),
      { icon: m.icon, label: m.label, to: m.path, superAdminOnly: m.superAdminOnly, external: true },
    ]);
  }
  return [...bySection].map(([title, items]) => ({ title, items }));
}

export const NAV_SECTIONS: NavSection[] = [...M1_SECTIONS, ...moduleSections()];

/** Section dan item yang boleh dilihat pengguna ini; section kosong dibuang. */
export function visibleSections(user: SessionUser | null): NavSection[] {
  const admin = isSuperAdmin(user);
  return NAV_SECTIONS.filter((section) => !section.superAdminOnly || admin)
    .map((section) => ({ ...section, items: section.items.filter((item) => !item.superAdminOnly || admin) }))
    .filter((section) => section.items.length > 0);
}

/** true bila pathname berada di bawah `to` (dengan batas "/": /admin/users ≠ /admin/users-baru). */
export function matchesPath(pathname: string, to: string, exact = false): boolean {
  if (pathname === to) return true;
  return !exact && pathname.startsWith(to.endsWith("/") ? to : `${to}/`);
}

/** Halaman aktif untuk breadcrumb, dari section yang sudah difilter. */
export function activePage(sections: NavSection[], pathname: string): ActivePage | null {
  for (const section of sections) {
    const item = section.items.find((it) => matchesPath(pathname, it.to, it.exact));
    if (item) return { section: section.title, label: item.label };
  }
  // Profil tidak ada di sidebar (dibuka dari menu akun di navbar).
  if (matchesPath(pathname, "/profile")) return { section: "Akun", label: "Profil saya" };
  return null;
}
