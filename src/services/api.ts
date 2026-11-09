import { API_BASE_URL } from "../config/env";
import { clearSession, getToken } from "../features/auth/auth.Slice";

export interface ListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ListResult<T> {
  data: T[];
  meta: ListMeta;
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

type Query = Record<string, string | number | boolean | null | undefined>;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  // false untuk endpoint publik (login): 401 tidak memicu logout otomatis.
  auth?: boolean;
}

function buildUrl(path: string, query?: Query): string {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return `${API_BASE_URL}${path}${qs ? `?${qs}` : ""}`;
}

async function send(path: string, options: RequestOptions) {
  const { method = "GET", body, query, auth = true } = options;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Tidak dapat terhubung ke server", null);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) throw toApiError(response.status, payload, auth);
  return payload;
}

function toApiError(status: number, payload: unknown, auth: boolean): ApiError {
  const err = (payload as { error?: { code?: string; message?: string; fields?: Record<string, string> | null } })?.error;
  // PRD 11: bila API menjawab 401, hapus token lalu arahkan ke /login.
  if (status === 401 && auth) {
    clearSession();
    window.location.assign("/login");
  }
  return new ApiError(
    status,
    err?.code ?? "UNKNOWN_ERROR",
    err?.message ?? "Terjadi kesalahan pada server",
    err?.fields ?? null,
  );
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const payload = await send(path, options);
  return payload.data as T;
}

export async function apiList<T>(path: string, query?: Query): Promise<ListResult<T>> {
  const payload = await send(path, { query });
  return { data: (payload.data ?? []) as T[], meta: payload.meta as ListMeta };
}
