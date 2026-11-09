import { useEffect, useState } from "react";
import type { Reference } from ".";
import { listRoles } from "../roles";
import { listDivisions } from "../divisions";

// Memuat peran dan divisi AKTIF organisasi untuk dropdown dan label tabel.
export function useReferences() {
  const [roles, setRoles] = useState<Reference[]>([]);
  const [divisions, setDivisions] = useState<Reference[]>([]);

  useEffect(() => {
    listRoles({ per_page: 100, is_active: true })
      .then((r) => setRoles(r.data.map(({ code, name }) => ({ code, name }))))
      .catch(() => setRoles([]));
    listDivisions({ per_page: 100, is_active: true })
      .then((d) => setDivisions(d.data.map(({ code, name }) => ({ code, name }))))
      .catch(() => setDivisions([]));
  }, []);

  return { roles, divisions };
}

export function referenceName(items: Reference[], code: string | null): string {
  if (!code) return "-";
  return items.find((it) => it.code === code)?.name ?? code;
}
