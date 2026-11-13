// Foto ilustrasi dari Unsplash (Unsplash License: bebas dipakai, atribusi tidak wajib).
// Sumber dicatat di sini agar mudah diganti. Bila foto gagal dimuat, latar biru tua
// dan ilustrasi SVG di bawahnya tetap tampil.

export interface UnsplashPhoto {
  id: string;
  alt: string;
}

// Ruang kerja kantor modern yang terang (images.unsplash.com/photo-<id>).
export const AUTH_PHOTO: UnsplashPhoto = {
  id: "1497366216548-37526070297c",
  alt: "Lorong kantor modern dengan dinding biru tua dan pantri",
};

export function unsplashUrl(id: string, width: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${width}`;
}

export function unsplashSrcSet(id: string, widths: number[] = [800, 1200, 1600]): string {
  return widths.map((w) => `${unsplashUrl(id, w)} ${w}w`).join(", ");
}
