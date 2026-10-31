# AGENTS.md — Sriwijaya Grafika

## 1. Bahasa & Komunikasi
- **WAJIB**: Selalu berkomunikasi dalam Bahasa Indonesia.
- Nama teknis dan kode tetap dalam bahasa Inggris.
- Gunakan gaya komunikasi yang ringkas, padat, dan langsung.

## 2. Akses Data & Kebenaran
- **SUMBER-PENGETAHUAN.md** adalah sumber kebenaran tunggal untuk:
  - Data bisnis (brand, layanan, produk, wilayah operasi)
  - Kontak bisnis (WhatsApp, telepon, email, alamat kantor/workshop)
  - Aturan penulisan artikel
  - Daftar artikel dan kategori
- Selalu refer ke file ini sebelum menulis konten atau membuat perubahan.

## 3. Alur Kerja Penulisan Artikel (Dua Tahap Wajib)
Setiap penulisan artikel baru wajib melalui alur kerja berurutan:

1. **Tahap 1 — Riset Semantik & Arsitektur (Skill `pakar-entity-seo`)**:
   - Lakukan ekstraksi kata kunci komersial/transaksional lokal Palembang & Sumatera Selatan.
   - Petakan entitas semantik (Schema.org), knowledge graph, dan rancang outline yang kaya data teknis/lapangan.
   - Pastikan sudut pandang riset mengarah ke penawaran jasa advertising, reklame, neon box, huruf timbul, pylon sign, plang nama toko, rambu K3.

2. **Tahap 2 — Penulisan Artikel Final (Skill `penulis-ahli`)**:
   - Gunakan hasil dari Tahap 1 sebagai input.
   - Eksekusi penulisan dengan gaya persuasif, solutif, dan manusiawi (humanizer).
   - Terapkan kaidah SEO/GEO 2026, validasi frontmatter Astro, serta pastikan bebas pola klise AI.

## 4. Tech Stack Project
- **Framework:** Astro 5
- **Layout & Visual:** Kloning 1:1 WordPress Theme Seofication & Bootstrap
- **Deployment:** Static Build (SSG) / Hosting
- **URL Handling:** Trailing slash preserved (`trailingSlash: 'always'`)

## 5. Perintah Utama
- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview build production

## 6. Konvensi & Struktur Halaman
- Root `/` : Halaman Utama (1:1 persis WP homepage)
- `/[slug]/` : Halaman artikel & static pages (1:1 permalinks)
- `/category/[slug]/` : Arsip kategori
- `/blog/` : Arsip blog
- Kontak WhatsApp floating button di pojok kanan bawah.
