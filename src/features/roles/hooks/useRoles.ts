import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { activateRole, deactivateRole, listPermissions, listRoles, roleKeys } from "../services/roles.service";
import { errorMessage } from "../../../services/api";
import { useApiMutation } from "../../../hooks/useApiMutation";
import type { RoleDialog } from "../../../types";

// Peran milik organisasi beserta izinnya. Peran "administrator" bawaan
// otomatis memiliki semua izin dan tidak dapat diubah.
export function useRoles() {
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<RoleDialog>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Peran & Izin";
  }, []);

  const { data, error, isFetching } = useQuery({
    queryKey: roleKeys.list({ page }),
    queryFn: () => listRoles({ page }),
    placeholderData: keepPreviousData,
  });
  const roles = data?.data ?? [];

  // Gagal memuat katalog izin = daftar kosong di form peran.
  const permissions = useQuery({
    queryKey: roleKeys.permissions,
    queryFn: listPermissions,
    select: (result) => result.data,
  });

  const activate = useApiMutation(activateRole, [roleKeys.all]);
  const deactivate = useApiMutation(deactivateRole, [roleKeys.all]);

  function onSaved(message: string) {
    setDialog(null);
    setNotice(message);
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
    notice,
    onSaved,
    activateRole: activate.mutateAsync,
    deactivateRole: deactivate.mutateAsync,
  };
}
