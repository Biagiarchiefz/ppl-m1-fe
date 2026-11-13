import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  /** Sembunyikan label (tetap dibaca pembaca layar), mis. untuk filter di toolbar. */
  hideLabel?: boolean;
  labelClassName?: string;
  id?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Opsi kosong (value "") di urutan pertama, mis. "Semua peran". */
  placeholder?: string;
  error?: string;
  /** Lebar & posisi pembungkus, mis. `w-44` atau `w-full sm:w-56`. */
  className?: string;
}

const OPTION_HEIGHT = 36; // px: tinggi satu opsi (py-2 + text-sm)
const MAX_LIST_HEIGHT = 256; // px: max-h-64
const GAP = 6;

/**
 * Dropdown kustom pengganti <select> bawaan, pola "select-only combobox" WAI-ARIA:
 * fokus tetap di tombol, opsi yang disorot diumumkan lewat aria-activedescendant.
 * Keyboard: ↑/↓, Home/End, Enter/Spasi memilih, Esc menutup, Tab memilih lalu pindah,
 * ketik huruf untuk melompat. Daftar dirender lewat portal agar tidak terpotong modal.
 */
const Select = ({
  label,
  hideLabel = false,
  labelClassName = "text-sm leading-5 font-medium text-text-default",
  id: idProp,
  value,
  options,
  onChange,
  placeholder,
  error,
  className = "",
}: SelectProps) => {
  const autoId = useId();
  const id = idProp ?? autoId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});
  const [upward, setUpward] = useState(false);

  const allOptions: SelectOption[] = placeholder !== undefined ? [{ value: "", label: placeholder }, ...options] : options;
  const selectedIndex = Math.max(0, allOptions.findIndex((o) => o.value === value));
  const selected = allOptions[selectedIndex];
  const optionId = (i: number) => `${id}-opsi-${i}`;

  function place() {
    const box = triggerRef.current?.getBoundingClientRect();
    if (!box) return;
    // Buka ke atas hanya jika daftar tidak muat di bawah dan ruang di atas lebih lega.
    const needed = Math.min(allOptions.length * OPTION_HEIGHT + 8, MAX_LIST_HEIGHT) + GAP * 2;
    const below = window.innerHeight - box.bottom;
    const up = below < needed && box.top > below;
    setUpward(up);
    setPosition({
      left: box.left,
      minWidth: box.width,
      ...(up ? { bottom: window.innerHeight - box.top + GAP } : { top: box.bottom + GAP }),
    });
  }

  function openList(index = selectedIndex) {
    place();
    setActive(index);
    setOpen(true);
  }

  function choose(index: number) {
    const option = allOptions[index];
    if (option && option.value !== value) onChange(option.value);
    setOpen(false);
  }

  // Klik di luar menutup daftar; posisi mengikuti saat halaman/modal digulir atau diubah ukurannya.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false);
    };
    const onScroll = (e: Event) => {
      if (!listRef.current?.contains(e.target as Node)) place();
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", place);
    };
  });

  // Opsi yang disorot selalu terlihat di dalam daftar yang bisa digulir.
  useLayoutEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const el = list?.children[active] as HTMLElement | undefined;
    if (!list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
  }, [active, open]);

  /** Lompat ke opsi yang labelnya diawali huruf yang diketik (bisa beberapa huruf berturut-turut). */
  function findTyped(char: string): number | null {
    const now = Date.now();
    const t = typed.current;
    t.text = now - t.time > 700 ? char : t.text + char;
    t.time = now;
    const start = open ? active : selectedIndex;
    const order = [...allOptions.slice(start + 1), ...allOptions.slice(0, start + 1)];
    const match = order.find((o) => o.label.toLocaleLowerCase("id").startsWith(t.text.toLocaleLowerCase("id")));
    return match ? allOptions.indexOf(match) : null;
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = allOptions.length - 1;
    const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        openList(e.key === "Home" ? 0 : last);
      } else if (printable) {
        const i = findTyped(e.key);
        if (i !== null) openList(i);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(a + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Tab":
        choose(active);
        break;
      case "Escape":
        // Jangan sampai Esc ikut menutup modal di belakangnya.
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        break;
      default:
        if (printable) {
          const i = findTyped(e.key);
          if (i !== null) setActive(i);
        }
    }
  }

  const isPlaceholder = placeholder !== undefined && value === "";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span id={`${id}-label`} className={hideLabel ? "sr-only" : labelClassName}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-daftar`}
        aria-labelledby={`${id}-label`}
        aria-invalid={Boolean(error)}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-field border bg-neutral-surface px-3.5 text-left text-sm transition-[border-color,box-shadow] duration-150 focus-visible:outline-none ${
          error
            ? "border-danger focus-visible:ring-2 focus-visible:ring-danger/20"
            : open
              ? "border-brand-accent ring-2 ring-brand-accent/30"
              : "border-neutral-line hover:border-neutral-line-strong focus-visible:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent/30"
        }`}
      >
        <span className={`truncate ${isPlaceholder ? "text-text-subtle" : "text-text-default"}`}>{selected?.label ?? ""}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden
          className={`shrink-0 text-text-subtle transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {error && <p className="text-sm leading-5 text-danger">{error}</p>}

      {open &&
        createPortal(
          <ul
            ref={listRef}
            id={`${id}-daftar`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            tabIndex={-1}
            style={position}
            className={`fixed z-[60] max-h-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-field border border-neutral-line bg-neutral-surface p-1 shadow-pop transition-[opacity,translate] duration-150 ease-(--ease-out-soft) starting:opacity-0 motion-reduce:transition-none ${
              upward ? "starting:translate-y-1" : "starting:-translate-y-1"
            }`}
          >
            {allOptions.map((o, i) => {
              const isSelected = i === selectedIndex;
              return (
                <li
                  key={o.value || "__kosong"}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActive(i)}
                  // Cegah fokus pindah dari tombol sebelum klik selesai.
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm ${
                    i === active ? "bg-brand-primary-soft text-text-strong" : "text-text-default"
                  } ${isSelected ? "font-medium" : ""}`}
                >
                  <span className="truncate">{o.label}</span>
                  <Check size={16} strokeWidth={1.5} aria-hidden className={`shrink-0 text-brand-primary ${isSelected ? "" : "invisible"}`} />
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
};

export default Select;
