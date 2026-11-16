import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { activateUser, listUsers, userKeys } from "../services/users.service";
import { useReferences } from "./useReferences";
import { selectUser, toast, useAuthStore } from "../../../store";
import { errorMessage } from "../../../services/api";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { useDebounce } from "../../../hooks/useDebounce";
import { PAGE_SIZE } from "../../../utils/pagination";
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

// Daftar akun seluruh partner (khusus super admin): pencarian, filter, halaman, dan dialog yang sedang terbuka.
export function useUsers() {
  const { roles, divisions } = useReferences();
  const sessionUser = useAuthStore(selectUser);
  const currentUserId = sessionUser?.user_id;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("semua");
  const [role, setRole] = useState("");
  const [partner, setPartner] = useState("");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<UserDialog>(null);
  const q = useDebounce(query.trim());
  const partnerInput = useDebounce(partner.trim());
  // Filter partner hanya dikirim bila berupa angka bulat positif.
  const partnerId = /^[1-9]\d*$/.test(partnerInput) ? Number(partnerInput) : undefined;

  useEffect(() => {
    document.title = "Pengguna";
  }, []);

  const filter = { page, per_page: PAGE_SIZE, q, role, partner_id: partnerId, is_active: STATUS_FILTER[status] };
  // keepPreviousData: data lama tetap tampil selama halaman/filter baru dimuat.
  const { data, error, isFetching } = useQuery({
    queryKey: userKeys.list(filter),
    queryFn: () => listUsers(filter),
    placeholderData: keepPreviousData,
  });
  const users = data?.data ?? [];
  const hasFilter = Boolean(q || role || partnerId || status !== "semua");

  const activate = useApiMutation(activateUser, [userKeys.all]);

  // Mengubah filter selalu kembali ke halaman pertama.
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const changeRole = (value: string) => {
    setRole(value);
    setPage(1);
  };
  const changePartner = (value: string) => {
    setPartner(value);
    setPage(1);
  };
  const changeStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  // Daftar sudah disegarkan oleh mutation; cukup tutup dialog dan tampilkan toast.
  function onSaved(message: string) {
    setDialog(null);
    toast.success(message);
  }

  const closeDialog = () => setDialog(null);

  return {
    roles,
    divisions,
    currentUserId,
    query,
    changeQuery,
    role,
    changeRole,
    partner,
    changePartner,
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
    onSaved,
    activateUser: activate.mutateAsync,
  };
}
