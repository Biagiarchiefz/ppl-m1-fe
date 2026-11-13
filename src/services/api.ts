import axios, { type AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";
import { useAuthStore } from "../features/auth/stores/auth.store";
import type { ApiEnvelope, ListMeta, ListResult, Query, RequestOptions } from "../types";

declare module "axios" {
  interface AxiosRequestConfig {
    // true untuk endpoint publik (login): tanpa token, dan 401 tidak memicu logout.
    skipAuth?: boolean;
  }
}

// ApiError membawa `error.code`, `error.message`, dan `error.fields` dari
// backend. UI menampilkan `message`, logika membaca `code`.
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: Record<string, string> | null;

  constructor(status: number, code: string, message: string, fields: Record<string, string> | null) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && !config.skipAuth) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

http.interceptors.response.use(
  (response) => {
    // Backend M1 membungkus respons: { success, data, meta?, error? }.
    if (!(response.data as ApiEnvelope<unknown> | null)?.success) {
      throw toApiError(response.status, response.data, response.config.skipAuth);
    }
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new ApiError(0, "NETWORK_ERROR", "Tidak dapat terhubung ke server", null));
    }
    return Promise.reject(toApiError(error.response.status, error.response.data, error.config?.skipAuth));
  },
);

function toApiError(status: number, payload: unknown, skipAuth = false): ApiError {
  const err = (payload as ApiEnvelope<unknown> | null)?.error;
  // PRD 11: bila API menjawab 401, hapus sesi lalu arahkan ke /login.
  if (status === 401 && !skipAuth) {
    useAuthStore.getState().logout();
    window.location.assign("/login");
  }
  return new ApiError(
    status,
    err?.code ?? "UNKNOWN_ERROR",
    err?.message ?? "Terjadi kesalahan pada server",
    err?.fields ?? null,
  );
}

// Parameter kosong tidak dikirim ke backend.
function cleanQuery(query?: Query): Query {
  return Object.fromEntries(
    Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true } = options;
  const response = await http.request<ApiEnvelope<T>>({
    url: path,
    method,
    data: body,
    params: cleanQuery(query),
    skipAuth: !auth,
  });
  return response.data.data;
}

export async function apiList<T>(path: string, query?: Query): Promise<ListResult<T>> {
  const response = await http.get<ApiEnvelope<T[]>>(path, { params: cleanQuery(query) });
  return { data: response.data.data ?? [], meta: response.data.meta as ListMeta };
}

// Pesan galat untuk ditampilkan di UI; string kosong bila tidak ada galat.
export function errorMessage(error: unknown): string {
  if (!error) return "";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan pada server";
}
