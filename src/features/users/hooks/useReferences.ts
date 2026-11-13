import { useQuery } from "@tanstack/react-query";
import { listRoles, roleKeys } from "../../roles/services/roles.service";
import { divisionKeys, listDivisions } from "../../divisions/services/divisions.service";
import type { Reference } from "../../../types";

const ACTIVE_REFERENCES = { per_page: 100, is_active: true };

const toReferences = (result: { data: Reference[] }): Reference[] => result.data.map(({ code, name }) => ({ code, name }));

// Memuat peran dan divisi AKTIF organisasi untuk dropdown dan label tabel.
// Gagal memuat = daftar kosong (label tabel jatuh ke kode mentah).
export function useReferences() {
  const roles = useQuery({
    queryKey: roleKeys.list(ACTIVE_REFERENCES),
    queryFn: () => listRoles(ACTIVE_REFERENCES),
    select: toReferences,
  });
  const divisions = useQuery({
    queryKey: divisionKeys.list(ACTIVE_REFERENCES),
    queryFn: () => listDivisions(ACTIVE_REFERENCES),
    select: toReferences,
  });

  return { roles: roles.data ?? [], divisions: divisions.data ?? [] };
}

export function referenceName(items: Reference[], code: string | null): string {
  if (!code) return "-";
  return items.find((it) => it.code === code)?.name ?? code;
}
