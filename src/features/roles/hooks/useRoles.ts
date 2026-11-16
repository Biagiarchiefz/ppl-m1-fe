import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listPermissions, listRoles, roleKeys } from "../services/roles.service";
import { errorMessage } from "../../../services/api";
import type { RoleDialog } from "../../../types";
import { toast } from "../../../store";
import { PAGE_SIZE } from "../../../utils/pagination";

// Peran global platform (partner_id NULL) dan katalog izin.
export function useRoles() {
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<RoleDialog>(null);

  useEffect(() => {
    document.title = "Peran & Izin";
  }, []);

  const { data, error, isFetching } = useQuery({
    queryKey: roleKeys.list({ page, per_page: PAGE_SIZE }),
    queryFn: () => listRoles({ page, per_page: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });
  const roles = data?.data ?? [];

  // Gagal memuat katalog izin = daftar kosong di form peran.
  const permissions = useQuery({
    queryKey: roleKeys.permissions,
    queryFn: listPermissions,
    select: (result) => result.data,
  });

  function onSaved(message: string) {
    setDialog(null);
    toast.success(message);
  }

  const closeDialog = () => setDialog(null);

  return {
    setPage,
    data,
    roles,
    error: errorMessage(error),
    loading: isFetching,
    permissions: permissions.data ?? [],
    dialog,
    setDialog,
    closeDialog,
    onSaved,
  };
}
