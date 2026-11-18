import { useRef, type ReactNode } from "react";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useScrollLock } from "../../../hooks/useScrollLock";

interface MobileDrawerProps {
  onClose: () => void;
  children: ReactNode;
}

/**
 * Laci menu dari kiri (ponsel & tablet). Dirender hanya saat terbuka:
 * fokus dikurung di dalam laci, Escape menutup, halaman di belakang tidak tergulir.
 */
const MobileDrawer = ({ onClose, children }: MobileDrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef);
  useEscapeKey(onClose);
  useScrollLock();

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 animate-halaman-masuk bg-band-deep/45 motion-reduce:animate-none" onClick={onClose} />
      <div ref={panelRef} className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] animate-muncul shadow-pop motion-reduce:animate-none">
        {children}
      </div>
    </div>
  );
};

export default MobileDrawer;
