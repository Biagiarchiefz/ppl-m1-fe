import { CircleAlert, CircleCheck, X } from "lucide-react";
import { useToastStore } from "../../../store";

const toneClasses = {
  success: { border: "border-success/30", icon: "text-success", Icon: CircleCheck },
  error: { border: "border-danger/30", icon: "text-danger", Icon: CircleAlert },
};

/** Tumpukan toast dari useToastStore; dipasang sekali di AppProviders. */
const Toaster = () => {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {toasts.map((t) => {
        const tone = toneClasses[t.tone];
        return (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-sm animate-muncul items-start gap-2.5 rounded-card border bg-neutral-surface py-3 pr-2 pl-3.5 text-sm leading-5 text-text-default shadow-pop motion-reduce:animate-none ${tone.border}`}
          >
            <tone.Icon size={16} strokeWidth={1.5} aria-hidden className={`mt-0.5 shrink-0 ${tone.icon}`} />
            <span className="min-w-0 flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Tutup notifikasi"
              className="-my-1 grid size-7 shrink-0 place-items-center rounded-md text-text-subtle efek-tekan hover:bg-neutral-soft hover:text-text-default"
            >
              <X size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
