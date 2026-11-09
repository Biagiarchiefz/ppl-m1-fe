import { useEffect, useState } from "react";
import { ApiError } from "../services/api";

interface AsyncState<T> {
  key: string;
  data?: T;
  error?: string;
}

// useAsync memanggil `fetcher(params)` setiap kali isi `params` berubah.
// `fetcher` harus fungsi tetap (didefinisikan di level modul). Data lama
// tetap ditampilkan selama data baru dimuat.
export function useAsync<P, T>(fetcher: (params: P) => Promise<T>, params: P, reloadKey = 0) {
  const key = JSON.stringify([params, reloadKey]);
  const [state, setState] = useState<AsyncState<T>>({ key: "" });

  useEffect(() => {
    let active = true;
    const [currentParams] = JSON.parse(key) as [P, number];
    fetcher(currentParams)
      .then((data) => active && setState({ key, data }))
      .catch((err: unknown) =>
        active &&
        setState((prev) => ({
          key,
          data: prev.data,
          error: err instanceof ApiError ? err.message : "Terjadi kesalahan pada server",
        })),
      );
    return () => {
      active = false;
    };
  }, [fetcher, key]);

  return { data: state.data, error: state.error, loading: state.key !== key };
}
