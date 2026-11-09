// Penyimpanan sesi di sisi klien [ASUMSI PRD 11]. "Ingat saya" memakai
// localStorage; tanpa itu sessionStorage (hilang saat browser ditutup).

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface SessionUser {
  user_id: number;
  name: string;
  organization_id: number | null;
  role: string;
  permissions: string[];
  division: string | null;
  unit_usaha_id: number | null;
}

// can: true bila pengguna memiliki salah satu izin `perms`. Hanya untuk
// menyembunyikan menu; hak akses tetap dijaga backend.
export function can(user: SessionUser | null, ...perms: string[]): boolean {
  return Boolean(user?.permissions?.some((p) => perms.includes(p)));
}

function storages(): Storage[] {
  return [localStorage, sessionStorage];
}

function read(key: string): string | null {
  for (const storage of storages()) {
    const value = storage.getItem(key);
    if (value) return value;
  }
  return null;
}

export function saveSession(token: string, user: SessionUser, remember: boolean) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  storages().forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    // kunci lama dari versi demo
    storage.removeItem("auth_role");
  });
}

export function getToken(): string | null {
  return read(TOKEN_KEY);
}

export function getSessionUser(): SessionUser | null {
  const raw = read(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
