import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { activateDivision, deactivateDivision, divisionKeys, listDivisions } from "../services/divisions.service";
import { errorMessage } from "../../../services/api";
import { useApiMutation } from "../../../hooks/useApiMutation";
import type { DivisionDialog } from "../../../types";

// Divisi milik organisasi, disesuaikan dengan struktur organisasinya sendiri.
export function useDivisions() {
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DivisionDialog>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Divisi";
  }, []);

  const { data, error, isFetching } = useQuery({
    queryKey: divisionKeys.list({ page }),
    queryFn: () => listDivisions({ page }),
    placeholderData: keepPreviousData,
  });
  const divisions = data?.data ?? [];

  const activate = useApiMutation(activateDivision, [divisionKeys.all]);
  const deactivate = useApiMutation(deactivateDivision, [divisionKeys.all]);

  function onSaved(message: string) {
    setDialog(null);
    setNotice(message);
  }

  const closeDialog = () => setDialog(null);

  return {
    setPage,
    data,
    divisions,
    error: errorMessage(error),
    loading: isFetching,
    dialog,
    setDialog,
    closeDialog,
    notice,
    onSaved,
    activateDivision: activate.mutateAsync,
    deactivateDivision: deactivate.mutateAsync,
  };
}
