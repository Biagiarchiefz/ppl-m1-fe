import { useEffect, useState, type ReactNode } from "react";
import {
  Building2,
  FolderTree,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  ChevronRight,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";
import Logo from "../../components/common/Logo/Logo";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";
import Tooltip from "../../components/common/Tooltip/Tooltip";
import { ADMIN_AREA_PERMS, PERM } from "../../config/env";
import { can, clearSession, getSessionUser, type SessionUser } from "../../features/auth/auth.Slice";
import ProfileMenu from "../../features/auth/components/ProfileMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  to: string;
  perms?: string[]; // tampil bila pengguna punya salah satu izin ini
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Platform",
    items: [
      { icon: Building2, label: "Organisasi", to: "/platform/organizations", perms: [PERM.organizationsManage] },
      { icon: History, label: "Audit log platform", to: "/platform/audit-logs", perms: [PERM.organizationsManage] },
    ],
  },
  {
    title: "Utama",
    items: [{ icon: LayoutDashboard, label: "Dashboard", to: "/admin", exact: true, perms: ADMIN_AREA_PERMS }],
  },
  {
    title: "Pengguna & akses",
    items: [
      { icon: Users, label: "Pengguna", to: "/admin/users", perms: [PERM.usersRead, PERM.usersManage] },
      { icon: Shield, label: "Peran & izin", to: "/admin/roles", perms: [PERM.rolesManage] },
      { icon: FolderTree, label: "Divisi", to: "/admin/divisions", perms: [PERM.divisionsManage] },
      { icon: History, label: "Audit log", to: "/admin/audit-logs", perms: [PERM.auditRead] },
    ],
  },
];

function visibleSections(user: SessionUser | null): NavSection[] {
  return sections
    .map((s) => ({ ...s, items: s.items.filter((it) => !it.perms || can(user, ...it.perms)) }))
    .filter((s) => s.items.length > 0);
}

function activePage(user: SessionUser | null, pathname: string): { section: string; label: string } | null {
  for (const section of visibleSections(user)) {
    const item = section.items.find((it) => (it.exact ? pathname === it.to : pathname.startsWith(it.to)));
    if (item) return { section: section.title, label: item.label };
  }
  // Profil tidak ada di sidebar (dibuka dari menu akun di navbar).
  if (pathname.startsWith("/profile")) return { section: "Akun", label: "Profil saya" };
  return null;
}

// Pilihan ciut/lebar sidebar hanya kenyamanan per peramban; gagal baca/tulis = kembali ke bawaan (lebar).
const COLLAPSE_KEY = "sidebar_collapsed";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  } catch {
    // Penyimpanan diblokir (mode privat): pilihan tidak diingat.
  }
}

function linkClass(collapsed: boolean) {
  return ({ isActive }: { isActive: boolean }) =>
    `relative flex min-h-10 items-center gap-3 rounded-lg text-sm font-medium efek-tekan ${collapsed ? "justify-center px-0" : "px-3"} ${
      isActive ? "bg-brand-primary-soft text-link" : "text-text-muted hover:bg-neutral-recessed hover:text-text-strong"
    }`;
}

const iconButton =
  "grid size-10 shrink-0 place-items-center rounded-lg text-text-muted efek-tekan hover:bg-neutral-recessed hover:text-text-strong";

interface SidebarProps {
  user: SessionUser | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
  onLogout: () => void;
}

/** Isi sidebar: kolom di desktop (bisa diciutkan) dan laci di ponsel. */
const Sidebar = ({ user, collapsed = false, onToggleCollapse, onNavigate, onClose, onLogout }: SidebarProps) => {
  return (
    <div className="flex h-full flex-col overflow-x-hidden bg-neutral-surface">
      <div className={`flex h-16 shrink-0 items-center gap-2 border-b border-neutral-line ${collapsed ? "justify-center px-2" : "justify-between pr-2 pl-4"}`}>
        {!collapsed && <Logo className="[&>span:last-child]:text-base" />}
        {onToggleCollapse && (
          <Tooltip text="Lebarkan sidebar" enabled={collapsed}>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Lebarkan sidebar" : "Ciutkan sidebar"}
              className={iconButton}
            >
              {collapsed ? <PanelLeftOpen size={20} strokeWidth={1.5} aria-hidden /> : <PanelLeftClose size={20} strokeWidth={1.5} aria-hidden />}
            </button>
          </Tooltip>
        )}
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Tutup menu" className={iconButton}>
            <X size={20} strokeWidth={1.5} aria-hidden />
          </button>
        )}
      </div>

      <nav aria-label="Navigasi admin" className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-4">
        {visibleSections(user).map((section) => (
          <div key={section.title} className="pt-4">
            <p className={`px-2 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-text-subtle uppercase ${collapsed ? "sr-only" : ""}`}>
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((it) => (
                <li key={it.to}>
                  <Tooltip text={it.label} enabled={collapsed}>
                    <NavLink to={it.to} end={it.exact} onClick={onNavigate} className={linkClass(collapsed)}>
                      <it.icon size={20} strokeWidth={1.5} aria-hidden className="shrink-0" />
                      <span className={collapsed ? "sr-only" : "truncate"}>{it.label}</span>
                    </NavLink>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={`border-t border-neutral-line ${collapsed ? "px-3 py-3" : "p-3"}`}>
        <Tooltip text="Keluar" enabled={collapsed}>
          <button
            type="button"
            onClick={onLogout}
            aria-label={collapsed ? "Keluar" : undefined}
            className={`flex min-h-10 w-full items-center gap-3 rounded-lg text-sm font-medium text-text-muted efek-tekan hover:bg-danger-soft hover:text-danger ${collapsed ? "justify-center" : "px-3"}`}
          >
            <LogOut size={20} strokeWidth={1.5} aria-hidden className="shrink-0" />
            {!collapsed && "Keluar"}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getSessionUser();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const page = activePage(user, location.pathname);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  function toggleCollapse() {
    setCollapsed(!collapsed);
    saveCollapsed(!collapsed);
  }

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-dvh bg-neutral-bg">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-neutral-surface focus:px-3 focus:py-2"
      >
        Lewati ke konten
      </a>

      {/* Desktop: sidebar kiri, bisa diciutkan ke mode ikon. */}
      {/* fixed: sidebar diam saat halaman digulir; hanya daftar menu di dalamnya yang bisa digulir. */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden h-dvh overflow-hidden border-r border-neutral-line bg-neutral-surface transition-[width] duration-300 ease-(--ease-standard) motion-reduce:transition-none lg:block ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar user={user} collapsed={collapsed} onToggleCollapse={toggleCollapse} onLogout={handleLogout} />
      </aside>

      {/* Jarak kiri = lebar sidebar, ikut bergeser saat sidebar diciutkan. */}
      <div
        className={`flex min-h-dvh min-w-0 flex-col transition-[padding] duration-300 ease-(--ease-standard) motion-reduce:transition-none ${
          collapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        {/* Navbar 64px: tinggi & garis bawahnya sejajar header sidebar, jadi keduanya tampak menyatu. */}
        <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-neutral-line bg-neutral-surface">
          <div className="flex h-full items-center gap-2 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              aria-label="Buka menu"
              className="-ml-2 grid size-11 place-items-center rounded-full text-text-default efek-tekan hover:bg-neutral-recessed lg:hidden"
            >
              <Menu size={24} strokeWidth={1.5} aria-hidden />
            </button>
            <span className="min-w-0 lg:hidden">
              <span className="sm:hidden">
                <Logo iconOnly />
              </span>
              <span className="hidden sm:block">
                <Logo className="[&>span:last-child]:text-base" />
              </span>
            </span>
            {page && (
              <nav aria-label="Lokasi halaman" className="hidden min-w-0 items-center gap-1.5 text-sm lg:flex">
                <span className="text-text-subtle">{page.section}</span>
                <ChevronRight size={14} strokeWidth={1.5} aria-hidden className="shrink-0 text-text-subtle" />
                <span aria-current="page" className="truncate font-medium text-text-strong">
                  {page.label}
                </span>
              </nav>
            )}
            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-neutral-line sm:block" />
              <ProfileMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <main id="konten" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-10 sm:px-6 lg:px-8 lg:py-8">
          {/* key = path: setiap pindah halaman, konten baru memudar masuk. */}
          <div key={location.pathname} className="animate-halaman-masuk motion-reduce:animate-none">
            {children}
          </div>
        </main>
      </div>

      {/* Ponsel & tablet: laci menu dari kiri. */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 animate-halaman-masuk bg-band-deep/45 motion-reduce:animate-none" onClick={closeDrawer} />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] animate-muncul shadow-pop motion-reduce:animate-none">
            <Sidebar user={user} onNavigate={closeDrawer} onClose={closeDrawer} onLogout={handleLogout} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
