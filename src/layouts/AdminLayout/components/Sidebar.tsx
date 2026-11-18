import { LogOut, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Logo from "../../../components/common/Logo/Logo";
import Tooltip from "../../../components/common/Tooltip/Tooltip";
import SidebarItem from "./SidebarItem";
import type { NavSection } from "../../../types";

const iconButton =
  "grid size-10 shrink-0 place-items-center rounded-lg text-text-muted efek-tekan hover:bg-neutral-recessed hover:text-text-strong";

type SidebarProps = {
  sections: NavSection[];
  onLogout: () => void;
} & (
  | { variant: "desktop"; collapsed: boolean; onToggleCollapse: () => void }
  | { variant: "drawer"; onClose: () => void }
);

/** Isi sidebar: kolom di desktop (bisa diciutkan) atau laci di ponsel. */
const Sidebar = (props: SidebarProps) => {
  const { sections, onLogout } = props;
  const collapsed = props.variant === "desktop" && props.collapsed;

  return (
    <div className="flex h-full flex-col overflow-x-hidden bg-neutral-surface">
      <div className={`flex h-16 shrink-0 items-center gap-2 border-b border-neutral-line ${collapsed ? "justify-center px-2" : "justify-between pr-2 pl-4"}`}>
        {!collapsed && <Logo className="[&>span:last-child]:text-base" />}
        {props.variant === "desktop" ? (
          <Tooltip text="Lebarkan sidebar" enabled={collapsed}>
            <button
              type="button"
              onClick={props.onToggleCollapse}
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Lebarkan sidebar" : "Ciutkan sidebar"}
              className={iconButton}
            >
              {collapsed ? <PanelLeftOpen size={20} strokeWidth={1.5} aria-hidden /> : <PanelLeftClose size={20} strokeWidth={1.5} aria-hidden />}
            </button>
          </Tooltip>
        ) : (
          <button type="button" onClick={props.onClose} aria-label="Tutup menu" className={iconButton}>
            <X size={20} strokeWidth={1.5} aria-hidden />
          </button>
        )}
      </div>

      <nav aria-label="Navigasi admin" className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-4">
        {sections.map((section) => (
          <div key={section.title} className="pt-4">
            <p className={`px-2 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-text-subtle uppercase ${collapsed ? "sr-only" : ""}`}>
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <SidebarItem item={item} collapsed={collapsed} />
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

export default Sidebar;
