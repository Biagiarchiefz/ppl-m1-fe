import { ChevronRight, FolderTree, History, Shield, Users, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface QuickLink {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const links: QuickLink[] = [
  { to: "/admin/users", label: "Pengguna", description: "Tambah akun dan atur divisinya.", icon: Users },
  { to: "/admin/roles", label: "Peran & hak akses", description: "Tentukan siapa boleh melakukan apa.", icon: Shield },
  { to: "/admin/divisions", label: "Divisi", description: "Kelompokkan pengguna per divisi.", icon: FolderTree },
  { to: "/admin/audit-logs", label: "Audit log", description: "Telusuri riwayat perubahan.", icon: History },
];

const QuickLinks = () => {
  return (
    <section aria-labelledby="judul-pintasan" className="rounded-card border border-neutral-line bg-neutral-surface p-4">
      <h2 id="judul-pintasan" className="text-sm font-semibold text-text-strong">
        Pintasan
      </h2>
      <ul className="-mx-1.5 mt-2 space-y-0.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 efek-tekan hover:bg-neutral-soft">
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-primary-soft text-brand-primary">
                <l.icon size={18} strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text-strong">{l.label}</span>
                <span className="block truncate text-xs text-text-muted">{l.description}</span>
              </span>
              <ChevronRight
                size={16}
                strokeWidth={1.5}
                aria-hidden
                className="shrink-0 text-text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-primary motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default QuickLinks;
