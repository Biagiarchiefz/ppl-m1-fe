import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { divisionKeys, listDivisions } from "../services/divisions.service";
import { errorMessage } from "../../../services/api";
import type { DivisionDialog } from "../../../types";
import { toast } from "../../../store";
import { PAGE_SIZE } from "../../../utils/pagination";

// Divisi global platform (partner_id NULL) yang dikelola super admin.
export function useDivisions() {
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DivisionDialog>(null);

  useEffect(() => {
    document.title = "Divisi";
  }, []);

  const { data, error, isFetching } = useQuery({
    queryKey: divisionKeys.list({ page, per_page: PAGE_SIZE }),
    queryFn: () => listDivisions({ page, per_page: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });
  const divisions = data?.data ?? [];

  function onSaved(message: string) {
    setDialog(null);
    toast.success(message);
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
    onSaved,
  };
}
