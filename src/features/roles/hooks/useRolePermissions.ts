import { useQuery } from "@tanstack/react-query";
import { getRolePermissions, roleKeys } from "../services/roles.service";
import { errorMessage } from "../../../services/api";
import type { Role } from "../../../types";

// Izin yang terpasang pada peran (GET /roles/{id}/permissions). Daftar peran
// tidak menyertakan izin, jadi dimuat saat form ubah dibuka.
// role = null (peran baru) langsung menghasilkan daftar kosong.
export function useRolePermissions(role: Role | null) {
  const query = useQuery({
    queryKey: roleKeys.rolePermissions(role?.id ?? 0),
    queryFn: () => getRolePermissions(role!.id),
    enabled: role !== null,
    select: (result) => result.permission_codes,
  });

  return {
    permissionCodes: role ? (query.data ?? null) : [],
    error: errorMessage(query.error),
  };
}
