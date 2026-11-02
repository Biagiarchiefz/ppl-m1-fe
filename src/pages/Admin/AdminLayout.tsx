import { LogOut, Search, Star, Bell } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import gridIcon from "../../assets/dashboard/grid.svg";
import dashboardIcon from "../../assets/dashboard/layout-dashboard.svg";
import usersIcon from "../../assets/dashboard/users.svg";
import shieldIcon from "../../assets/dashboard/shield.svg";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: string;
  label: string;
  to?: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, to, active = false }: SidebarItemProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      className={`relative flex h-10 w-full items-center gap-2.5 px-4 text-left ${
        active
          ? "bg-brand-primary-soft font-semibold text-brand-primary"
          : "text-text-muted hover:bg-neutral-bg"
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-0 h-10 w-[3px] rounded-br-[2px] rounded-tr-[2px] bg-brand-primary"
        />
      )}
      <img src={icon} alt="" aria-hidden className="size-[18px]" />
      <span className="text-sm leading-[22px]">{label}</span>
    </button>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_role");
    navigate("/login");
  }

  return (
    <main className="flex min-h-screen flex-col bg-neutral-bg">
      <header className="flex h-[52px] shrink-0 items-center justify-between bg-brand-primary px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-[#172f5e]">
            <img src={gridIcon} alt="" aria-hidden className="size-4" />
          </div>
          <p className="font-heading text-sm font-bold text-brand-on-primary">
            Dashboard Admin
          </p>
        </div>
        <div className="flex items-center gap-3 text-white">
          <button type="button" aria-label="Cari" className="rounded p-0.5 hover:bg-white/10">
            <Search size={18} strokeWidth={1.7} />
          </button>
          <button type="button" aria-label="Notifikasi" className="rounded p-0.5 hover:bg-white/10">
            <Bell size={18} strokeWidth={1.7} />
          </button>
          <button type="button" aria-label="Favorit" className="rounded p-0.5 hover:bg-white/10">
            <Star size={18} strokeWidth={1.7} />
          </button>
          <div className="flex size-[30px] items-center justify-center rounded-full bg-[#c084fc]">
            <span className="font-heading text-xs font-bold text-white">A</span>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-stretch">
        <aside className="flex w-[220px] shrink-0 flex-col border-r border-neutral-line bg-neutral-surface">
          <nav aria-label="Navigasi admin">
            <div className="flex flex-col gap-0.5 pb-2 pt-4">
              <p className="px-4 pb-1.5 text-sm font-semibold leading-5 text-neutral-line-strong">Utama</p>
              <SidebarItem icon={dashboardIcon} label="Dashboard" to="/admin" active={location.pathname === "/admin"} />
            </div>
            <div className="h-px w-full bg-neutral-line" />
            <div className="flex flex-col gap-0.5 pb-2 pt-4">
              <p className="px-4 pb-1.5 text-sm font-semibold leading-5 text-neutral-line-strong">Pengguna &amp; Role</p>
              <SidebarItem icon={usersIcon} label="Pengguna" to="/admin/users" active={location.pathname.startsWith("/admin/users")} />
              <SidebarItem icon={shieldIcon} label="Role" />
            </div>
          </nav>
          <div className="flex-1" />
          <div className="border-t border-neutral-line">
            <button type="button" onClick={handleLogout} className="flex h-10 w-full items-center gap-2.5 px-4 text-left text-sm leading-[22px] text-red-600 hover:bg-red-50">
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
