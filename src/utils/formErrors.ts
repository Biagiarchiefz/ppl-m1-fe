import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError, errorMessage } from "../services/api";

// Tampilkan galat dari backend di form react-hook-form: pesan umum di
// `errors.root.server`, galat per field (`error.fields`) di field masing-masing.
// `fieldMap` memetakan nama field backend yang berbeda, mis. "admin.email" → "adminEmail".
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldMap: Record<string, Path<T>> = {},
) {
  setError("root.server", { message: errorMessage(error) });
  if (!(error instanceof ApiError) || !error.fields) return;
  for (const [field, message] of Object.entries(error.fields)) {
    setError(fieldMap[field] ?? (field as Path<T>), { message });
  }
}
