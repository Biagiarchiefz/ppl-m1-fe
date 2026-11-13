// Divisi organisasi.

export interface Division {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export type DivisionDialog =
  | { kind: "create" }
  | { kind: "edit"; division: Division }
  | { kind: "deactivate" | "activate"; division: Division }
  | null;

export interface DivisionForm {
  code: string;
  name: string;
}
