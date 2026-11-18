import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileDrawer from "./components/MobileDrawer";
import { useAdminLayout } from "./hooks/useAdminLayout";

interface AdminLayoutProps {
  children: ReactNode;
}

// Kerangka halaman admin: sidebar (desktop) / laci menu (ponsel), navbar, dan konten.
// Semua state & logikanya ada di useAdminLayout.
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, pathname, sections, page, collapsed, toggleCollapse, drawerOpen, openDrawer, closeDrawer, logout } = useAdminLayout();

  return (
    <div className="min-h-dvh bg-neutral-bg">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-neutral-surface focus:px-3 focus:py-2"
      >
        Lewati ke konten
      </a>

      {/* Desktop: sidebar kiri tetap (fixed), bisa diciutkan ke mode ikon. */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden h-dvh overflow-hidden border-r border-neutral-line bg-neutral-surface transition-[width] duration-300 ease-(--ease-standard) motion-reduce:transition-none lg:block ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar variant="desktop" sections={sections} collapsed={collapsed} onToggleCollapse={toggleCollapse} onLogout={logout} />
      </aside>

      {/* Jarak kiri = lebar sidebar, ikut bergeser saat sidebar diciutkan. */}
      <div
        className={`flex min-h-dvh min-w-0 flex-col transition-[padding] duration-300 ease-(--ease-standard) motion-reduce:transition-none ${
          collapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <Navbar user={user} page={page} drawerOpen={drawerOpen} onOpenDrawer={openDrawer} onLogout={logout} />

        <main id="konten" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-10 sm:px-6 lg:px-8 lg:py-8">
          {/* key = path: setiap pindah halaman, konten baru memudar masuk. */}
          <div key={pathname} className="animate-halaman-masuk motion-reduce:animate-none">
            {children}
          </div>
        </main>
      </div>

      {drawerOpen && (
        <MobileDrawer onClose={closeDrawer}>
          <Sidebar variant="drawer" sections={sections} onClose={closeDrawer} onLogout={logout} />
        </MobileDrawer>
      )}
    </div>
  );
};

export default AdminLayout;
