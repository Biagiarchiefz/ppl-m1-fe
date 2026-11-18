import { useState } from "react";
import { useLocation } from "react-router";
import { activePage, visibleSections } from "../../../config/navigation";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import { selectUser, useAuthStore, useUiStore } from "../../../store";

// Semua state & logika AdminLayout: menu yang boleh dilihat, halaman aktif
// (breadcrumb), sidebar ciut/lebar, laci menu ponsel, dan logout.
export function useAdminLayout() {
  const { pathname } = useLocation();
  const user = useAuthStore(selectUser);
  const { signOut } = useLogout();
  // Ciut/lebar sidebar disimpan per peramban lewat store UI.
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleCollapse = useUiStore((s) => s.toggleSidebar);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Laci ditutup setiap alamat berubah (klik menu, tombol back, dsb.).
  // Pola "simpan nilai sebelumnya" saat render, tanpa efek tambahan.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawerOpen(false);
  }

  // Dihitung sekali per render, dipakai sidebar dan breadcrumb.
  const sections = visibleSections(user);

  return {
    user,
    pathname,
    sections,
    page: activePage(sections, pathname),
    collapsed,
    toggleCollapse,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    logout: () => void signOut(),
  };
}
