import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { activateUser, deleteUser, listUsers, userKeys } from "../services/users.service";
import { useReferences } from "./useReferences";
import { can, useAuthStore } from "../../auth/stores/auth.store";
import { PERM } from "../../../config/env";
import { errorMessage } from "../../../services/api";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { useDebounce } from "../../../hooks/useDebounce";
import type { UserDialog } from "../../../types";

const STATUS_FILTER: Record<string, boolean | undefined> = {
  semua: undefined,
  aktif: true,
  nonaktif: false,
};

export const STATUS_OPTIONS = [
  { value: "semua", label: "Semua status" },
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

// Daftar pengguna: pencarian, filter, halaman, dan dialog yang sedang terbuka.
export function useUsers() {
  const { roles, divisions } = useReferences();
  const sessionUser = useAuthStore((s) => s.user);
  const currentUserId = sessionUser?.user_id;
  const canManage = can(sessionUser, PERM.usersManage);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("semua");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<UserDialog>(null);
  const [notice, setNotice] = useState("");
  const q = useDebounce(query.trim());

  useEffect(() => {
    document.title = "Pengguna";
  }, []);

  const filter = { page, q, role, is_active: STATUS_FILTER[status] };
  // keepPreviousData: data lama tetap tampil selama halaman/filter baru dimuat.
  const { data, error, isFetching } = useQuery({
    queryKey: userKeys.list(filter),
    queryFn: () => listUsers(filter),
    placeholderData: keepPreviousData,
  });
  const users = data?.data ?? [];
  const hasFilter = Boolean(q || role || status !== "semua");

  const activate = useApiMutation(activateUser, [userKeys.all]);
  const remove = useApiMutation(deleteUser, [userKeys.all]);

  // Mengubah filter selalu kembali ke halaman pertama.
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const changeRole = (value: string) => {
    setRole(value);
    setPage(1);
  };
  const changeStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  // Daftar sudah disegarkan oleh mutation; cukup tutup dialog dan tampilkan pesan.
  function onSaved(message: string) {
    setDialog(null);
    setNotice(message);
  }

  const closeDialog = () => setDialog(null);

  return {
    roles,
    divisions,
    currentUserId,
    canManage,
    query,
    changeQuery,
    role,
    changeRole,
    status,
    changeStatus,
    setPage,
    data,
    users,
    error: errorMessage(error),
    loading: isFetching,
    hasFilter,
    dialog,
    setDialog,
    closeDialog,
    notice,
    onSaved,
    activateUser: activate.mutateAsync,
    deleteUser: remove.mutateAsync,
  };
}
