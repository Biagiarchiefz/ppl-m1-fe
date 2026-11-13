// Bentuk respons daftar dan opsi permintaan ke backend M1.

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

export type Query = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  // false untuk endpoint publik (login): 401 tidak memicu logout otomatis.
  auth?: boolean;
}

// Bungkus standar semua respons backend M1.
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: ListMeta;
  error?: { code?: string; message?: string; fields?: Record<string, string> | null };
}
