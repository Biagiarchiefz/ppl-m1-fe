import { Building2, FolderTree, History, LayoutDashboard, LogOut, Shield, Users, type LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import gridIcon from "../../assets/dashboard/grid.svg";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";
import { ADMIN_AREA_PERMS, PERM } from "../../config/env";
import { can, clearSession, getSessionUser, type SessionUser } from "../../features/auth/auth.Slice";

interface AdminLayoutProps {
  children: React.ReactNode;
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
      { icon: History, label: "Audit log", to: "/platform/audit-logs", perms: [PERM.organizationsManage] },
    ],
  },
  {
    title: "Utama",
    items: [{ icon: LayoutDashboard, label: "Dashboard", to: "/admin", exact: true, perms: [PERM.usersRead, PERM.usersManage, PERM.rolesManage, PERM.divisionsManage, PERM.auditRead] }],
  },
  {
    title: "Pengguna & Akses",
    items: [
      { icon: Users, label: "Pengguna", to: "/admin/users", perms: [PERM.usersRead, PERM.usersManage] },
      { icon: Shield, label: "Peran & Izin", to: "/admin/roles", perms: [PERM.rolesManage] },
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

const SidebarItem = ({ item, active }: { item: NavItem; active: boolean }) => {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => navigate(item.to)}
      className={`relative flex h-10 w-full items-center gap-2.5 px-4 text-left ${
        active ? "bg-brand-primary-soft font-semibold text-brand-primary" : "text-text-muted hover:bg-neutral-bg"
      }`}
    >
      {active && (
        <span aria-hidden className="absolute left-0 top-0 h-10 w-[3px] rounded-br-[2px] rounded-tr-[2px] bg-brand-primary" />
      )}
      <Icon size={18} strokeWidth={1.8} aria-hidden />
      <span className="text-sm leading-[22px]">{item.label}</span>
    </button>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getSessionUser();
  const initial = (user?.name.trim()[0] ?? "A").toUpperCase();
  const title = can(user, PERM.organizationsManage)
    ? "Platform Admin"
    : can(user, ...ADMIN_AREA_PERMS)
      ? "Dashboard Admin"
      : "Akun Saya";

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  const isActive = (it: NavItem) =>
    it.exact ? location.pathname === it.to : location.pathname.startsWith(it.to);

  return (
    <main className="flex min-h-screen flex-col bg-neutral-bg">
      <header className="flex h-[52px] shrink-0 items-center justify-between bg-header px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-header-strong">
            <img src={gridIcon} alt="" aria-hidden className="size-4" />
          </div>
          <p className="font-heading text-sm font-bold text-white">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-3 text-white">
          <ThemeToggle className="text-white hover:bg-white/10" />
          <button type="button" onClick={() => navigate("/profile")} aria-label="Profil saya" title="Profil saya" className="flex items-center gap-3 rounded-full py-0.5 pl-3 pr-0.5 hover:bg-white/10">
            <span className="hidden text-sm sm:inline">{user?.name}</span>
            <span className="flex size-[30px] items-center justify-center rounded-full bg-[#c084fc]">
              <span className="font-heading text-xs font-bold text-white">{initial}</span>
            </span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-stretch">
        <aside className="flex w-[220px] shrink-0 flex-col border-r border-neutral-line bg-neutral-surface">
          <nav aria-label="Navigasi admin">
            {visibleSections(user).map((section, i) => (
              <div key={section.title}>
                {i > 0 && <div className="h-px w-full bg-neutral-line" />}
                <div className="flex flex-col gap-0.5 pb-2 pt-4">
                  <p className="px-4 pb-1.5 text-sm font-semibold leading-5 text-neutral-line-strong">{section.title}</p>
                  {section.items.map((it) => (
                    <SidebarItem key={it.to} item={it} active={isActive(it)} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="border-t border-neutral-line">
            <button type="button" onClick={handleLogout} className="flex h-10 w-full items-center gap-2.5 px-4 text-left text-sm leading-[22px] text-danger hover:bg-danger-soft">
              <LogOut size={18} strokeWidth={1.8} aria-hidden />
              Keluar
            </button>
          </div>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </main>
  );
};

export default AdminLayout;
