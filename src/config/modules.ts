import { z } from "zod";
import type { ModuleMenu } from "../types";
import { MODULE_ICONS } from "./moduleIcons";
import rawModules from "./modules.json";

// Alamat milik M1 yang tidak boleh dipakai modul lain sebagai kode modul.
const RESERVED_IDS = ["admin", "profile", "login", "forbidden", "api", "dashboard", "change-password", "platform", "assets"];

export const DEFAULT_MODULE_SECTION = "Modul";

const moduleMenuSchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z0-9-]+$/, "id hanya boleh huruf kecil, angka, dan tanda -")
      .refine((id) => !RESERVED_IDS.includes(id), "id bentrok dengan alamat milik M1"),
    label: z.string().trim().min(1, "label wajib diisi"),
    path: z.string(),
    icon: z.string().refine((name) => Object.hasOwn(MODULE_ICONS, name), "nama ikon tidak ada di daftar ikon (src/config/moduleIcons.ts)"),
    section: z.string().trim().min(1).optional(),
    superAdminOnly: z.boolean().optional(),
    owner: z.string().trim().min(1, "owner wajib diisi"),
  })
  .refine((m) => m.path === `/${m.id}` || m.path.startsWith(`/${m.id}/`), {
    message: "path harus diawali /<id>",
    path: ["path"],
  }) satisfies z.ZodType<ModuleMenu, ModuleMenu>;

// Entri yang salah tidak membuat dashboard rusak: entri itu dilewati dan
// alasannya ditulis di console, supaya mudah dicek saat meninjau PR.
function loadModules(raw: unknown): ModuleMenu[] {
  if (!Array.isArray(raw)) {
    console.error("[modules.json] Isi file harus berupa array [ ... ].");
    return [];
  }
  const seen = new Set<string>();
  const result: ModuleMenu[] = [];
  raw.forEach((entry, index) => {
    const parsed = moduleMenuSchema.safeParse(entry);
    if (!parsed.success) {
      const reasons = parsed.error.issues.map((i) => `${i.path.join(".") || "entri"}: ${i.message}`).join("; ");
      console.error(`[modules.json] Entri ke-${index + 1} dilewati → ${reasons}`);
      return;
    }
    if (seen.has(parsed.data.id)) {
      console.error(`[modules.json] Entri ke-${index + 1} dilewati → id "${parsed.data.id}" sudah dipakai.`);
      return;
    }
    seen.add(parsed.data.id);
    result.push(parsed.data);
  });
  return result;
}

export const moduleMenus: ModuleMenu[] = loadModules(rawModules);
