import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { errorMessage } from "../../../services/api";
import { authKeys, getMe } from "../services/auth.service";
import type { Me } from "../../../types";

export function profileRows(me: Me): [string, string][] {
  return [
    ["Nama", me.name],
    ["Email", me.email],
    ["Organisasi", me.organization_name ?? "-"],
    ["Peran", me.role],
    ["Jumlah izin", String(me.permissions.length)],
    ["Divisi", me.division ?? "-"],
    ["Unit usaha", me.unit_usaha_id === null ? "-" : String(me.unit_usaha_id)],
  ];
}

// Detail profil dari GET /me (K-01) dan status modal ubah kata sandi.
export function useProfile() {
  const { data, error } = useQuery({ queryKey: authKeys.me, queryFn: getMe });
  const [notice, setNotice] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    document.title = "Profil";
  }, []);

  function onPasswordSaved(message: string) {
    setChangingPassword(false);
    setNotice(message);
  }

  return {
    me: data ?? null,
    error: errorMessage(error),
    notice,
    changingPassword,
    setChangingPassword,
    onPasswordSaved,
  };
}
