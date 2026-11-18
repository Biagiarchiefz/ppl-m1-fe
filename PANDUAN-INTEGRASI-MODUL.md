# Panduan Integrasi Modul ke Dashboard Araya Business Hub

Panduan ini untuk **kelompok lain (M2, M3, dst.)** yang ingin modulnya tampil sebagai menu di dashboard **M1**.

Kabar baiknya: **stack kalian bebas** (React, Vue, Next.js, Svelte, Laravel, HTML biasa, dll.) dan **kode tetap di repo kalian sendiri**. Kalian tidak perlu menyalin kode ke repo M1.

---

## Daftar isi

1. [Gambaran besar](#1-gambaran-besar)
2. [Ringkasan langkah](#2-ringkasan-langkah)
3. [Langkah 1: Pilih kode dan alamat modul](#langkah-1-pilih-kode-dan-alamat-modul)
4. [Langkah 2: Atur base path di aplikasi kalian](#langkah-2-atur-base-path-di-aplikasi-kalian)
5. [Langkah 3: Deploy aplikasi kalian](#langkah-3-deploy-aplikasi-kalian)
6. [Langkah 4: Daftarkan menu lewat Pull Request ke repo M1](#langkah-4-daftarkan-menu-lewat-pull-request-ke-repo-m1)
7. [Langkah 5: Pakai login dari M1](#langkah-5-pakai-login-dari-m1)
8. [Langkah 6: Backend kalian mengecek token](#langkah-6-backend-kalian-mengecek-token)
9. [Langkah 7: Tombol kembali dan logout](#langkah-7-tombol-kembali-dan-logout)
10. [Checklist sebelum minta PR di-merge](#checklist-sebelum-minta-pr-di-merge)
11. [Masalah yang sering terjadi](#masalah-yang-sering-terjadi)
12. [Hal yang perlu diketahui](#hal-yang-perlu-diketahui)

---

## 1. Gambaran besar

Bayangkan sebuah **mal**:

| Di mal | Di sistem kita |
|---|---|
| Gedung mal | Domain utama (aplikasi M1) |
| Pintu masuk + resepsionis | Halaman login M1 |
| Papan petunjuk | Sidebar dashboard M1 |
| Toko-toko | Aplikasi tiap kelompok (M2, M3, …) |

Pengguna **login sekali** di M1, lalu bisa pindah ke "toko" mana pun lewat sidebar.

Secara teknis, semua aplikasi dibuka dari **satu domain yang sama**:

```
https://<domain-m1>/admin        → aplikasi M1
https://<domain-m1>/m2/...       → diam-diam diambil dari aplikasi M2
https://<domain-m1>/m3/...       → diam-diam diambil dari aplikasi M3
```

Ini dilakukan dengan fitur **rewrite** di Vercel: M1 "meneruskan" alamat `/m2/...` ke server aplikasi M2, tapi alamat di browser tetap domain M1. Karena domainnya sama, **data login bisa dipakai bersama**.

---

## 2. Ringkasan langkah

| No | Yang dikerjakan | Di repo siapa |
|---|---|---|
| 1 | Pilih kode modul, misalnya `m2` | – |
| 2 | Atur base path aplikasi jadi `/m2` | Repo kalian |
| 3 | Deploy aplikasi kalian (misalnya ke Vercel) | Repo kalian |
| 4 | Tambah menu + aturan rewrite lewat Pull Request | **Repo M1** |
| 5 | Baca token login dari M1 | Repo kalian (frontend) |
| 6 | Cek keaslian token di backend | Repo kalian (backend) |
| 7 | Sediakan tombol "Kembali ke Dashboard" dan logout | Repo kalian (frontend) |

---

## Langkah 1: Pilih kode dan alamat modul

Tentukan **kode modul** yang unik, huruf kecil, tanpa spasi. Contoh: `m2`, `m3`, `m4`.

Semua halaman modul kalian akan berada di bawah alamat itu:

```
/m2            → halaman utama modul M2
/m2/produk     → halaman produk
/m2/laporan    → halaman laporan
```

> ⚠️ Jangan pakai alamat yang sudah dipakai M1: `/admin`, `/profile`, `/login`, `/forbidden`, `/api`, `/dashboard`, `/change-password`, `/platform`.

---

## Langkah 2: Atur base path di aplikasi kalian

**Base path** artinya "alamat awal" aplikasi kalian. Karena aplikasi kalian dibuka lewat `/m2`, aplikasi harus tahu hal ini. Kalau tidak, file CSS/JS gagal dimuat dan yang muncul **layar putih**.

### Vite (React / Vue / Svelte)

`vite.config.ts` / `vite.config.js`:

```js
export default defineConfig({
  base: "/m2/",
  // ...konfigurasi lain
});
```

Lalu atur router-nya:

```jsx
// React Router
<BrowserRouter basename="/m2"> ... </BrowserRouter>
```

```js
// Vue Router
createRouter({ history: createWebHistory("/m2/"), routes });
```

Tambahkan juga `vercel.json` di repo kalian agar refresh halaman tidak 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Next.js

`next.config.js`:

```js
module.exports = {
  basePath: "/m2",
};
```

### HTML biasa / stack lain

Pastikan semua link ke file (CSS, JS, gambar) dan antarhalaman diawali `/m2/`, misalnya `/m2/style.css`, bukan `/style.css`.

---

## Langkah 3: Deploy aplikasi kalian

Deploy seperti biasa, misalnya ke Vercel, sehingga kalian punya alamat seperti:

```
https://ppl-m2-fe.vercel.app
```

Catat alamat ini, karena dibutuhkan di langkah 4.

> 💡 Setelah base path diatur, membuka alamat Vercel kalian **secara langsung** mungkin terlihat rusak (CSS tidak muncul). Itu normal. Aplikasi kalian memang dirancang untuk dibuka lewat domain M1 di `/m2`. Untuk development lokal, buka `http://localhost:5173/m2/`.

---

## Langkah 4: Daftarkan menu lewat Pull Request ke repo M1

Ini satu-satunya langkah yang menyentuh repo M1. Ubah **dua file**, lalu kirim Pull Request (PR).

### 4a. Tambahkan menu di `src/config/modules.json`

Tambahkan satu objek untuk modul kalian:

```json
[
  {
    "id": "m2",
    "label": "Inventaris",
    "path": "/m2",
    "icon": "package",
    "section": "Modul",
    "superAdminOnly": false,
    "owner": "Kelompok 2"
  }
]
```

Penjelasan tiap isian:

| Isian | Wajib? | Arti | Contoh |
|---|---|---|---|
| `id` | Ya | Kode modul dari langkah 1 | `"m2"` |
| `label` | Ya | Tulisan menu di sidebar | `"Inventaris"` |
| `path` | Ya | Alamat yang dibuka saat menu diklik, **harus diawali `/<id>`** | `"/m2"` |
| `icon` | Ya | Nama ikon dari **daftar ikon yang tersedia** (lihat di bawah tabel ini) | `"package"`, `"wallet"`, `"shopping-cart"` |
| `section` | Tidak | Judul kelompok menu di sidebar. Kalau kosong, masuk ke `"Modul"` | `"Operasional"` |
| `superAdminOnly` | Tidak | `true` = menu hanya terlihat oleh super admin | `false` |
| `owner` | Ya | Nama kelompok, supaya tahu siapa yang dihubungi kalau ada masalah | `"Kelompok 2"` |

#### Daftar ikon yang tersedia

Ikonnya dari [lucide.dev/icons](https://lucide.dev/icons), tapi **hanya nama di bawah ini** yang bisa dipakai. Daftarnya sengaja dibatasi supaya aplikasi M1 tetap ringan.

```
archive        bar-chart      bell           book-open      boxes
briefcase      building       calendar       clipboard-list credit-card
database       file-text      folder         gauge          globe
graduation-cap handshake      headphones     heart          image
inbox          landmark       layout-grid    line-chart     list-checks
mail           map            map-pin        megaphone      message-square
package        pie-chart      receipt        settings       shopping-bag
shopping-cart  store          tag            ticket         truck
user-check     users          wallet         warehouse      wrench
```

**Butuh ikon lain?** Di PR yang sama, tambahkan ikonnya di `src/config/moduleIcons.ts`:

```ts
import { Coffee } from "lucide-react";   // 1. import ikonnya (nama di lucide, PascalCase)

export const MODULE_ICONS = {
  // ...
  coffee: Coffee,                         // 2. daftarkan: "nama-di-json": Komponen
};
```

#### Kalau ada isian yang salah

Menu kalian **tidak akan muncul**, tapi dashboard tetap berjalan normal. Alasannya ditulis di **console browser** (tekan F12 → tab Console), misalnya:

```
[modules.json] Entri ke-1 dilewati → icon: nama ikon tidak ada di daftar ikon (src/config/moduleIcons.ts)
```

Penyebab yang sering terjadi: `path` tidak diawali `/<id>`, `id` memakai huruf besar atau spasi, `id` sama dengan modul lain, `owner` kosong, atau nama ikon tidak ada di daftar.

### 4b. Tambahkan aturan rewrite di `vercel.json`

Tambahkan aturan modul kalian **di atas** baris terakhir `"/(.*)"`.

**Kalau aplikasi kalian pakai Vite / HTML biasa** (alamat tujuan **tanpa** `/m2`):

```json
{ "source": "/m2/:path*", "destination": "https://ppl-m2-fe.vercel.app/:path*" }
```

**Kalau aplikasi kalian pakai Next.js dengan `basePath`** (alamat tujuan **dengan** `/m2`):

```json
{ "source": "/m2/:path*", "destination": "https://ppl-m2-fe.vercel.app/m2/:path*" }
```

Contoh `vercel.json` M1 setelah ditambah:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://ppl-m1-be.vercel.app/api/:path*" },

    { "source": "/m2/:path*", "destination": "https://ppl-m2-fe.vercel.app/:path*" },

    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> ⚠️ **Urutan itu penting.** Vercel membaca aturan dari atas ke bawah dan berhenti di aturan pertama yang cocok. Kalau aturan kalian ditaruh di bawah `"/(.*)"`, alamat `/m2` akan ditangkap M1 dan muncul halaman "Tidak ditemukan".

### 4c. (Opsional) Kalau backend kalian ingin dipanggil lewat domain yang sama

Semua alamat `/api/...` sekarang diteruskan ke backend M1. Kalau backend kalian ingin dipanggil lewat domain yang sama (tanpa urusan CORS), tambahkan aturan **di atas** aturan `/api/:path*` milik M1:

```json
{ "source": "/api/m2/:path*", "destination": "https://ppl-m2-be.vercel.app/api/m2/:path*" }
```

Kalau tidak, panggil backend kalian dengan alamat lengkapnya (`https://ppl-m2-be.vercel.app/...`) dan aktifkan **CORS** di backend kalian untuk domain M1.

### 4d. Kirim Pull Request

1. Fork / buat branch dari repo M1, misalnya `feat/menu-m2`.
2. Ubah `src/config/modules.json` dan `vercel.json` (ditambah `src/config/moduleIcons.ts` kalau butuh ikon baru).
3. Cek tidak ada error: jalankan `npm install`, lalu `npm run build`, lalu `npm run dev`. Login sebagai super admin dan pastikan menu kalian muncul di sidebar. Saat `npm run dev`, mengklik menu kalian akan membuka halaman "Tidak ditemukan", karena rewrite `vercel.json` hanya berlaku setelah deploy. Itu normal.
4. Kirim PR dengan judul seperti: **`feat: tambah menu modul M2 (Inventaris)`**.
5. Di deskripsi PR, tulis alamat deploy aplikasi kalian.
6. Tim M1 akan mengecek dan melakukan merge. Setelah M1 di-deploy ulang, menu kalian muncul di sidebar.

---

## Langkah 5: Pakai login dari M1

Kalian **tidak perlu membuat halaman login sendiri**. Saat pengguna login di M1, data login disimpan di browser dengan nama **`auth_session`**:

- di `localStorage` kalau pengguna mencentang **"Ingat saya"**,
- di `sessionStorage` kalau tidak.

Isinya kira-kira seperti ini:

```json
{
  "state": {
    "token": "eyJhbGciOi...",
    "user": {
      "user_id": 1,
      "name": "Budi",
      "role": "Staff",
      "division": "Keuangan",
      "partner_id": null,
      "unit_usaha_id": null,
      "is_super_admin": false
    },
    "remember": true
  },
  "version": 1
}
```

### Kode siap pakai (bisa dipakai di stack apa pun yang jalan di browser)

Buat satu file, misalnya `auth.js`:

```js
// Membaca sesi login dari M1
export function getSession() {
  const raw = localStorage.getItem("auth_session") ?? sessionStorage.getItem("auth_session");
  if (!raw) return null;
  try {
    const { state } = JSON.parse(raw);
    return state?.token ? state : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return getSession()?.token ?? null;
}

export function getUser() {
  return getSession()?.user ?? null;
}

// Panggil ini di awal aplikasi / sebelum membuka halaman yang butuh login
export function requireLogin() {
  if (!getToken()) {
    window.location.href = "/login"; // halaman login milik M1
  }
}
```

Saat memanggil API backend kalian, **selalu kirim token**:

```js
import { getToken } from "./auth";

const res = await fetch("https://ppl-m2-be.vercel.app/api/m2/produk", {
  headers: { Authorization: `Bearer ${getToken()}` },
});

if (res.status === 401) {
  // token tidak berlaku lagi → minta login ulang
  window.location.href = "/login";
}
```

> ⚠️ **Hanya baca, jangan ubah** isi `auth_session`, kecuali menghapusnya saat logout (lihat langkah 7). Kalau formatnya diubah, aplikasi M1 bisa rusak.

---

## Langkah 6: Backend kalian mengecek token

Frontend saja **tidak cukup** untuk keamanan, karena orang bisa mengetik alamat `/m2/...` langsung atau memanggil API kalian lewat Postman. Jadi **backend kalian wajib mengecek token di setiap request**.

Cara paling mudah: tanyakan ke backend M1 "token ini milik siapa?" lewat endpoint **`GET /me`**.

```
GET https://ppl-m1-be.vercel.app/api/m1/v1/me
Authorization: Bearer <token>
```

- **Berhasil (200)**: token asli, dan kalian dapat data pengguna:
  ```json
  {
    "success": true,
    "data": {
      "user_id": 1,
      "name": "Budi",
      "role": "Staff",
      "division": "Keuangan",
      "partner_id": null,
      "unit_usaha_id": null,
      "is_super_admin": false
    }
  }
  ```
- **Gagal (401)**: token palsu atau sudah kedaluwarsa, jadi **tolak request-nya**.

Contoh middleware (Node.js / Express):

```js
async function cekLogin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, error: { message: "Belum login" } });

  const r = await fetch("https://ppl-m1-be.vercel.app/api/m1/v1/me", {
    headers: { Authorization: auth },
  });
  if (!r.ok) return res.status(401).json({ success: false, error: { message: "Token tidak valid" } });

  const body = await r.json();
  req.user = body.data; // data pengguna bisa dipakai di route berikutnya
  next();
}

app.use("/api/m2", cekLogin);
```

Ide yang sama bisa diterapkan di Laravel (middleware), Django, Go, dll.: **panggil `/me`, kalau gagal tolak.**

> 💡 Supaya tidak memanggil `/me` di setiap request, hasilnya boleh disimpan sementara (cache) selama beberapa menit per token.

---

## Langkah 7: Tombol kembali dan logout

Saat pengguna membuka modul kalian, **yang tampil 100% aplikasi kalian**. Sidebar M1 tidak ikut tampil. Jadi sediakan:

### Tombol "Kembali ke Dashboard"

```html
<a href="/admin">← Kembali ke Dashboard</a>
```

> Gunakan `<a href>` biasa atau `window.location.href`, **bukan** link dari router kalian (misalnya `<Link>` / `<router-link>`). `/admin` adalah milik aplikasi M1, bukan aplikasi kalian.

Untuk pengguna yang bukan super admin, arahkan ke `/profile`:

```js
const tujuan = getUser()?.is_super_admin ? "/admin" : "/profile";
```

### Tombol logout

```js
export function logout() {
  localStorage.removeItem("auth_session");
  sessionStorage.removeItem("auth_session");
  window.location.href = "/login";
}
```

### Tampilan

Supaya terasa satu sistem, usahakan tampilan kalian mirip M1: pakai logo yang sama, warna utama yang mirip, dan ada nama pengguna (`getUser().name`) di pojok atas.

---

## Checklist sebelum minta PR di-merge

- [ ] Kode modul unik dan tidak bentrok dengan alamat M1
- [ ] Base path aplikasi sudah `/m2` (atau kode modul kalian)
- [ ] Aplikasi sudah di-deploy dan alamatnya ditulis di deskripsi PR
- [ ] Menu ditambahkan di `src/config/modules.json` dengan isian lengkap dan ikon dari daftar
- [ ] `npm run build` di repo M1 berhasil, dan menu muncul di sidebar saat `npm run dev`
- [ ] Aturan rewrite ditambahkan di `vercel.json` **di atas** baris `"/(.*)"`
- [ ] Kalau belum login, aplikasi kalian mengarahkan ke `/login`
- [ ] Setiap request ke backend kalian mengirim header `Authorization: Bearer <token>`
- [ ] Backend kalian menolak request tanpa token atau dengan token yang tidak valid
- [ ] Ada tombol "Kembali ke Dashboard" dan logout
- [ ] Sudah dicoba: refresh halaman `/m2/...` tidak menjadi 404

---

## Masalah yang sering terjadi

| Gejala | Penyebab | Solusi |
|---|---|---|
| Layar putih, di console ada error 404 untuk file `.js` / `.css` | Base path belum diatur, atau aturan rewrite salah pilih (dengan / tanpa `/m2`) | Cek langkah 2 dan 4b |
| Membuka `/m2` malah muncul halaman "Tidak ditemukan" milik M1 | Aturan rewrite ada di bawah `"/(.*)"` atau belum di-merge/deploy | Pindahkan aturan ke atas, pastikan M1 sudah di-deploy ulang |
| Refresh di `/m2/produk` jadi 404 | Aplikasi kalian belum punya SPA fallback | Tambahkan `vercel.json` di repo kalian (langkah 2) |
| Selalu diarahkan ke `/login` padahal sudah login | Aplikasi kalian tidak dibuka lewat domain M1 (misalnya lewat `ppl-m2-fe.vercel.app` langsung) | Buka lewat `https://<domain-m1>/m2` |
| Diminta login ulang saat membuka modul di **tab baru** | Pengguna tidak mencentang "Ingat saya", jadi sesi hanya ada di tab tersebut | Normal. Centang "Ingat saya" saat login |
| Error CORS saat memanggil backend kalian | Backend belum mengizinkan domain M1 | Aktifkan CORS untuk domain M1, atau pakai langkah 4c |
| Panggilan API kalian malah masuk ke backend M1 | Kalian memanggil `/api/...` tanpa aturan khusus | Pakai alamat lengkap backend kalian, atau langkah 4c |

---

## Hal yang perlu diketahui

1. **Pindah antarmodul akan memuat ulang halaman.** Dari M1 ke M2 berarti pindah aplikasi, jadi ada kedipan sebentar. Ini normal.
2. **Semua modul bisa membaca token login.** Itulah yang membuat login cukup sekali. Tapi artinya setiap kelompok harus menjaga keamanan kodenya (misalnya jangan menampilkan input pengguna sebagai HTML mentah) supaya token tidak dicuri.
3. **Menyembunyikan menu bukan berarti aman.** `superAdminOnly` hanya menyembunyikan menu di sidebar. Pengecekan hak akses yang sebenarnya **harus** dilakukan di backend kalian (langkah 6).
4. **Jangan ubah kode M1 selain file di langkah 4** (`modules.json`, `vercel.json`, dan `moduleIcons.ts` kalau perlu ikon baru). Kalau butuh perubahan lain, diskusikan dulu dengan tim M1.

---

Ada pertanyaan atau menemukan masalah? Hubungi tim **M1** atau buat _issue_ di repo M1.
