import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  activateOrganization,
  deactivateOrganization,
  deleteOrganization,
  listOrganizations,
  organizationKeys,
} from "../services/organizations.service";
import { errorMessage } from "../../../services/api";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { useDebounce } from "../../../hooks/useDebounce";
import type { OrganizationDialog } from "../../../types";

const STATUS: Record<string, boolean | undefined> = { semua: undefined, aktif: true, nonaktif: false };

export const STATUS_OPTIONS = [
  { value: "semua", label: "Semua status" },
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

// Halaman super admin: mendaftarkan organisasi yang memakai platform.
export function useOrganizations() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("semua");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<OrganizationDialog>(null);
  const [notice, setNotice] = useState("");
  const q = useDebounce(query.trim());

  useEffect(() => {
    document.title = "Organisasi";
  }, []);

  const params = { page, q, is_active: STATUS[status] };
  const { data, error, isFetching } = useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => listOrganizations(params),
    placeholderData: keepPreviousData,
  });
  const orgs = data?.data ?? [];
  const hasFilter = Boolean(q || status !== "semua");

  const activate = useApiMutation(activateOrganization, [organizationKeys.all]);
  const deactivate = useApiMutation(deactivateOrganization, [organizationKeys.all]);
  const remove = useApiMutation(deleteOrganization, [organizationKeys.all]);

  // Mengubah filter selalu kembali ke halaman pertama.
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const changeStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  function onSaved(message: string) {
    setDialog(null);
    setNotice(message);
  }

  const closeDialog = () => setDialog(null);

  return {
    query,
    changeQuery,
    status,
    changeStatus,
    setPage,
    data,
    orgs,
    error: errorMessage(error),
    loading: isFetching,
    hasFilter,
    dialog,
    setDialog,
    closeDialog,
    notice,
    onSaved,
    activateOrganization: activate.mutateAsync,
    deactivateOrganization: deactivate.mutateAsync,
    deleteOrganization: remove.mutateAsync,
  };
}
