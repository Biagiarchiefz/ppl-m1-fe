import { Boxes } from "lucide-react";
import { NavLink } from "react-router";
import { MODULE_ICONS } from "../../../config/moduleIcons";
import Tooltip from "../../../components/common/Tooltip/Tooltip";
import type { NavItem } from "../../../types";

interface SidebarItemProps {
  item: NavItem;
  collapsed: boolean;
}

function linkClass(collapsed: boolean, isActive: boolean) {
  return `relative flex min-h-10 items-center gap-3 rounded-lg text-sm font-medium efek-tekan ${collapsed ? "justify-center px-0" : "px-3"} ${
    isActive ? "bg-brand-primary-soft text-link" : "text-text-muted hover:bg-neutral-recessed hover:text-text-strong"
  }`;
}

/** Satu menu sidebar: ikon + label, dengan tooltip saat sidebar diciutkan. */
const SidebarItem = ({ item, collapsed }: SidebarItemProps) => {
  // Nama ikon modul sudah divalidasi di config/modules.ts; Boxes hanya cadangan.
  const Icon = typeof item.icon === "string" ? (MODULE_ICONS[item.icon] ?? Boxes) : item.icon;
  const content = (
    <>
      <Icon size={20} strokeWidth={1.5} aria-hidden className="shrink-0" />
      <span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span>
    </>
  );

  return (
    <Tooltip text={item.label} enabled={collapsed}>
      {item.external ? (
        // Aplikasi modul lain di domain yang sama (rewrite vercel.json),
        // jadi pakai <a> biasa agar browser memuat aplikasinya.
        <a href={item.to} className={linkClass(collapsed, false)}>
          {content}
        </a>
      ) : (
        <NavLink to={item.to} end={item.exact} className={({ isActive }) => linkClass(collapsed, isActive)}>
          {content}
        </NavLink>
      )}
    </Tooltip>
  );
};

export default SidebarItem;
