import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { errorMessage } from "../../../services/api";
import { authKeys, getMe } from "../services/auth.service";
import type { Me } from "../../../types";
import { toast } from "../../../store";

export type ProfileDetailKey = "division" | "partner" | "unit" | "user";

export interface ProfileDetail {
  key: ProfileDetailKey;
  label: string;
  value: string;
}

const idOrDash = (id: number | null) => (id === null ? "-" : `#${id}`);

// Rincian akun dari GET /me yang ditampilkan sebagai kartu kecil.
export function profileDetails(me: Me): ProfileDetail[] {
  return [
    { key: "division", label: "Divisi", value: me.division ?? "-" },
    { key: "partner", label: "Partner", value: idOrDash(me.partner_id) },
    { key: "unit", label: "Unit usaha", value: idOrDash(me.unit_usaha_id) },
    { key: "user", label: "ID pengguna", value: idOrDash(me.user_id) },
  ];
}

export function initialOf(name: string): string {
  return (name.trim()[0] ?? "?").toUpperCase();
}

// Detail profil dari GET /me (K-01) dan status modal ubah kata sandi.
export function useProfile() {
  const { data, error } = useQuery({ queryKey: authKeys.me, queryFn: () => getMe() });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    document.title = "Profil";
  }, []);

  function onPasswordSaved(message: string) {
    setChangingPassword(false);
    toast.success(message);
  }

  return {
    me: data ?? null,
    error: errorMessage(error),
    changingPassword,
    setChangingPassword,
    onPasswordSaved,
  };
}
