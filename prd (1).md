# PRD (Product Requirements Document)
## Aplikasi "Employee Award" — Sistem Nominasi & Pemenang Penghargaan Karyawan

| Metadata      | Keterangan            |
|---------------|------------------------|
| Versi Dokumen | 1.0                    |
| Tanggal       | 11 September 2026      |
| Status        | Draft                  |
| Pemilik       | Product/Engineering    |

---

## 1. Latar Belakang & Tujuan

Perusahaan membutuhkan aplikasi web untuk menampilkan proses penghargaan karyawan (Employee Award) secara interaktif kepada publik/audiens (misalnya saat acara townhall/gala), sekaligus menyediakan panel admin untuk mengelola kategori, nominasi, dan pemenang.

**Tujuan utama:**
1. Menyediakan tampilan publik berupa slideshow yang menampilkan nominasi dan pemenang tiap kategori award secara menarik dan interaktif (dengan backsound & animasi).
2. Menyediakan panel admin untuk mengelola kategori award, nominasi karyawan, penetapan pemenang, dan pengaturan backsound.
3. Menghadirkan pengalaman "pengumuman pemenang" yang dramatis melalui animasi tirai terbuka (curtain reveal) dan musik latar.

---

## 2. Target Pengguna

| Peran            | Deskripsi                                                               |
|------------------|---------------------------------------------------------------------------|
| **Publik/Audiens** | Menonton tampilan slideshow nominasi & pemenang (mode presentasi/TV/Projector), tanpa login. |
| **Admin/HR**      | Mengelola kategori, nominasi, pemenang, dan backsound melalui dashboard admin (login diperlukan). |

---

## 3. Ruang Lingkup (Scope)

### 3.1 In-Scope
- Halaman publik (display/slideshow) — tanpa autentikasi.
- Halaman admin (CRUD kategori, nominasi, pemenang, backsound) — dengan autentikasi.
- Upload foto karyawan & logo kategori.
- Upload/pilih file audio backsound (per konteks: nominasi, pengumuman pemenang, umum).
- Animasi reveal pemenang (efek tirai terbuka).
- Kontrol slideshow (auto-play, manual next/prev, remote control dari admin — opsional fase 2).

### 3.2 Out of Scope (fase awal)
- Voting publik/live polling.
- Integrasi HRIS otomatis (import data karyawan otomatis dari sistem lain).
- Multi-tenant/multi perusahaan.
- Aplikasi mobile native.

---

## 4. Tech Stack

| Layer            | Teknologi                                                        |
|-------------------|-------------------------------------------------------------------|
| Backend           | Laravel 11 (PHP 8.3+)                                             |
| Frontend          | React JS + Vite                                                   |
| Bridging          | Inertia.js (SPA experience tanpa REST API terpisah)               |
| Database          | MySQL 8                                                            |
| Styling           | Tailwind CSS                                                       |
| Animasi           | Framer Motion (React) untuk efek tirai & transisi slideshow        |
| Audio             | Howler.js (kontrol backsound: play, loop, crossfade, volume)       |
| Auth Admin        | Laravel Breeze/Fortify (Inertia stack) + Session-based auth        |
| Storage File       | Laravel Filesystem (local/public disk, siap untuk S3 di produksi)  |
| Queue (opsional)  | Laravel Queue (untuk proses konversi/optimasi gambar & audio)      |
| Realtime (opsional/fase 2) | Laravel Reverb / Pusher (sinkronisasi remote-control slideshow) |

---

## 5. Arsitektur & Struktur Kode (MVCRS)

Struktur kode mengikuti pola **MVCRS** (Model – View – Controller – Repository – Service), untuk memisahkan logika bisnis dari controller agar lebih terstruktur, testable, dan mudah dikembangkan.

```
app/
├── Models/
│   ├── Category.php
│   ├── Nominee.php
│   ├── Employee.php
│   ├── Winner.php
│   ├── Backsound.php
│   └── User.php
│
├── Http/
│   ├── Controllers/
│   │   ├── Public/
│   │   │   └── ShowcaseController.php      # Halaman publik / slideshow
│   │   └── Admin/
│   │       ├── CategoryController.php
│   │       ├── NomineeController.php
│   │       ├── WinnerController.php
│   │       ├── BacksoundController.php
│   │       └── DashboardController.php
│   ├── Requests/
│   │   ├── StoreCategoryRequest.php
│   │   ├── StoreNomineeRequest.php
│   │   ├── SetWinnerRequest.php
│   │   └── StoreBacksoundRequest.php
│   └── Middleware/
│       └── EnsureIsAdmin.php
│
├── Repositories/
│   ├── Contracts/
│   │   ├── CategoryRepositoryInterface.php
│   │   ├── NomineeRepositoryInterface.php
│   │   └── BacksoundRepositoryInterface.php
│   └── Eloquent/
│       ├── CategoryRepository.php
│       ├── NomineeRepository.php
│       └── BacksoundRepository.php
│
├── Services/
│   ├── CategoryService.php
│   ├── NomineeService.php
│   ├── WinnerService.php
│   ├── BacksoundService.php
│   └── MediaUploadService.php     # Upload & optimasi foto/audio
│
└── Providers/
    └── RepositoryServiceProvider.php   # Binding interface -> implementasi

resources/js/
├── Pages/
│   ├── Public/
│   │   ├── Showcase.jsx            # Slideshow utama
│   │   └── Partials/
│   │       ├── NomineeSlide.jsx
│   │       ├── WinnerReveal.jsx    # Animasi tirai
│   │       └── AudioController.jsx
│   └── Admin/
│       ├── Dashboard.jsx
│       ├── Categories/
│       │   ├── Index.jsx
│       │   ├── Create.jsx
│       │   └── Edit.jsx
│       ├── Nominees/
│       │   └── Index.jsx
│       ├── Winners/
│       │   └── Index.jsx
│       └── Backsounds/
│           └── Index.jsx
├── Components/
│   ├── UI/                         # Button, Modal, Card, dsb (design system)
│   ├── CurtainAnimation.jsx
│   └── SlideshowControls.jsx
└── Layouts/
    ├── AdminLayout.jsx
    └── PublicLayout.jsx
```

**Alur MVCRS:**
`Controller` menerima request → memanggil `Service` (logika bisnis, contoh: validasi hanya boleh 1 pemenang per kategori) → `Service` memanggil `Repository` (akses data via Eloquent Model) → hasil dikembalikan ke Controller → dirender ke `View` (Inertia render ke komponen React).

---

## 6. Struktur Database (MySQL)

### 6.1 ERD Ringkas
```
users ──┐
         │
categories (1) ──< nominees >── (1) employees
     │                 │
     │                 └──(1:1 opsional)── winners
     │
backsounds (context: nominee_display | winner_reveal | general)
```

### 6.2 Tabel

**`categories`**
| Kolom        | Tipe            | Keterangan                        |
|--------------|-----------------|-------------------------------------|
| id           | bigint (PK)     |                                      |
| name         | varchar(150)    | Nama kategori, mis. "Best Employee" |
| slug         | varchar(150)    | unique                              |
| description  | text, nullable  |                                      |
| icon_path    | varchar, nullable | Logo/ikon kategori                |
| order        | integer         | Urutan tampil di slideshow          |
| is_active    | boolean, default true |                                |
| created_at / updated_at | timestamp |                              |

**`employees`**
| Kolom      | Tipe         | Keterangan               |
|------------|--------------|---------------------------|
| id         | bigint (PK)  |                            |
| name       | varchar(150) |                            |
| position   | varchar(150) | Jabatan                   |
| department | varchar(150) |                            |
| photo_path | varchar, nullable |                       |
| created_at / updated_at | timestamp |               |

**`nominees`**
| Kolom        | Tipe        | Keterangan                                   |
|--------------|-------------|------------------------------------------------|
| id           | bigint (PK) |                                                  |
| category_id  | FK → categories |                                             |
| employee_id  | FK → employees  |                                             |
| description  | text, nullable | Alasan/achievement singkat                  |
| order        | integer     | Urutan tampil dalam kategori                    |
| created_at / updated_at | timestamp |                                    |
| *unique*     | (category_id, employee_id) — cegah duplikasi    |

**`winners`**
| Kolom        | Tipe        | Keterangan                                |
|--------------|-------------|----------------------------------------------|
| id           | bigint (PK) |                                                |
| category_id  | FK → categories | unique — 1 kategori hanya 1 pemenang aktif |
| nominee_id   | FK → nominees   |                                            |
| announced_at | timestamp, nullable | Waktu diumumkan (untuk animasi/log)    |
| created_at / updated_at | timestamp |                                  |

**`backsounds`**
| Kolom        | Tipe          | Keterangan                                                  |
|--------------|---------------|----------------------------------------------------------------|
| id           | bigint (PK)   |                                                                  |
| title        | varchar(150)  |                                                                  |
| file_path    | varchar       |                                                                  |
| context      | enum          | `nominee_display`, `winner_reveal`, `general`, `background_loop` |
| category_id  | FK → categories, nullable | Backsound spesifik per kategori (opsional)         |
| is_active    | boolean       |                                                                  |
| created_at / updated_at | timestamp |                                                        |

**`users`** (admin)
| Kolom      | Tipe        | Keterangan          |
|------------|-------------|-----------------------|
| id         | bigint (PK) |                        |
| name       | varchar     |                        |
| email      | varchar, unique |                    |
| password   | varchar (hashed) |                   |
| role       | enum(`admin`, `superadmin`) |            |
| created_at / updated_at | timestamp |            |

---

## 7. Fitur Detail

### 7.1 Halaman Publik (Showcase)

| # | Fitur | Deskripsi |
|---|-------|-----------|
| P1 | Slideshow Nominasi | Menampilkan tiap kategori beserta daftar nominee (foto, nama, jabatan, deskripsi) secara bergantian otomatis (auto-advance dengan durasi yang bisa dikonfigurasi, default 8 detik/slide). |
| P2 | Slideshow Pemenang | Setelah nominasi kategori selesai ditampilkan, muncul slide "pengumuman pemenang" dengan animasi tirai terbuka mengungkap foto & nama pemenang. |
| P3 | Animasi Tirai (Curtain Reveal) | Efek dua panel tirai (kiri-kanan) yang terbuka perlahan dengan sound cue, mengungkap foto pemenang di belakangnya. Dibangun dengan Framer Motion. |
| P4 | Backsound Interaktif | Musik latar berbeda untuk: (a) mode nominasi — musik upbeat/netral looping, (b) mode reveal pemenang — musik dramatis/fanfare, (c) fallback umum. Transisi antar backsound menggunakan crossfade agar halus. |
| P5 | Kontrol Slideshow | Auto-play default; opsi manual (next/prev) via keyboard (arrow key) atau klik, untuk operator saat acara berlangsung. |
| P6 | Progress Indicator | Indikator kategori keberapa dari total, dan progress bar per slide. |
| P7 | Responsif | Tampilan optimal di layar besar (proyektor/TV/monitor presentasi) dan juga tablet/mobile untuk preview. |
| P8 | Mode Layar Penuh | Tombol/fitur fullscreen untuk presentasi di layar event. |

**Alur tampilan per kategori:**
1. Intro kategori (nama kategori + ikon) → fade in.
2. Slide nominee satu per satu (atau grid, tergantung jumlah nominee).
3. Transisi ke slide "And the winner is..." (suspense, backsound berubah).
4. Animasi tirai terbuka menampilkan pemenang + foto besar + nama + jabatan + confetti/efek visual.
5. Jeda beberapa detik, lanjut ke kategori berikutnya.

### 7.2 Halaman Admin

| # | Fitur | Deskripsi |
|---|-------|-----------|
| A1 | Login Admin | Autentikasi standar Laravel (email + password), proteksi middleware `auth` + `EnsureIsAdmin`. |
| A2 | Dashboard | Ringkasan: jumlah kategori, total nominee, kategori yang sudah punya pemenang vs belum. |
| A3 | Manajemen Kategori | CRUD kategori award: nama, deskripsi, ikon, urutan tampil, status aktif/nonaktif. |
| A4 | Manajemen Karyawan | CRUD data master karyawan (nama, jabatan, departemen, foto) — dipakai sebagai sumber nominee. |
| A5 | Manajemen Nominasi | Menambahkan karyawan sebagai nominee ke dalam kategori tertentu, atur urutan tampil, tambahkan deskripsi/alasan nominasi. |
| A6 | Penetapan Pemenang | Memilih satu nominee sebagai pemenang untuk kategori tersebut (validasi: hanya 1 pemenang aktif per kategori, bisa diubah/reset). |
| A7 | Manajemen Backsound | Upload file audio (mp3), beri judul, tentukan konteks penggunaan (nominasi/reveal pemenang/umum), aktifkan/nonaktifkan. |
| A8 | Preview | Admin dapat melihat preview tampilan publik langsung dari panel admin sebelum event berlangsung. |
| A9 | Pengaturan Durasi Slide | Konfigurasi durasi tiap slide nominasi & jeda animasi reveal pemenang. |

---

## 8. Alur Pengguna (User Flow)

### 8.1 Admin
```
Login → Dashboard
   → Kelola Kategori (buat "Best Employee 2026", dst.)
   → Kelola Karyawan (input data master karyawan)
   → Kelola Nominasi (assign karyawan ke kategori)
   → Tetapkan Pemenang (pilih 1 nominee per kategori)
   → Kelola Backsound (upload musik nominasi & musik reveal pemenang)
   → Preview tampilan publik
```

### 8.2 Publik
```
Buka halaman "/" (showcase)
   → Backsound umum mulai diputar
   → Slideshow otomatis menjelajahi tiap kategori
        → Tampilkan nominee-nominee kategori (backsound nominasi)
        → Transisi ke reveal pemenang (backsound berganti, dramatis)
        → Animasi tirai terbuka menampilkan pemenang
   → Lanjut ke kategori berikutnya, hingga selesai
   → (opsional) Looping kembali ke awal
```

---

## 9. Desain UI/UX

- **Tema visual:** elegan, formal-mewah (gala/awarding night), dominasi warna gelap (navy/hitam) dikombinasikan dengan aksen emas/gold untuk kesan penghargaan premium.
- **Tipografi:** kombinasi font display elegan (untuk judul kategori & nama pemenang) dan font sans-serif bersih untuk detail.
- **Animasi:**
  - Transisi antar slide: fade/slide dengan easing halus (Framer Motion).
  - Reveal pemenang: animasi tirai kain (curtain) membuka dari tengah ke kiri-kanan, disertai efek cahaya sorot (spotlight) pada foto pemenang, serta confetti/particle effect setelah tirai terbuka penuh.
  - Micro-interaction pada panel admin (hover, loading state, toast notification setelah simpan data).
- **Responsif:** breakpoint disesuaikan untuk mode presentasi (layar lebar 16:9) sebagai prioritas utama, tetap fungsional di tablet & mobile untuk keperluan admin/preview.

---

## 10. Non-Functional Requirements

| Aspek | Kebutuhan |
|-------|-----------|
| Performa | Slideshow tetap smooth (60fps) meski memuat banyak gambar; gunakan lazy-load & optimasi gambar (WebP, resize otomatis saat upload). |
| Keamanan | Halaman admin wajib login; validasi upload file (tipe & ukuran) untuk foto & audio; CSRF protection bawaan Laravel. |
| Skalabilitas | Struktur repository/service memudahkan penambahan fitur (mis. voting, multi-event) di fase berikutnya. |
| Ketersediaan Media | Audio & gambar disimpan di storage Laravel (`public` disk), siap dipindah ke cloud storage (S3) saat produksi skala besar. |
| Kompatibilitas Browser | Mendukung Chrome, Edge, Firefox versi terbaru (autoplay audio mengikuti kebijakan browser — perlu user interaction pertama untuk unlock audio). |
| Aksesibilitas | Kontrol manual (keyboard) tersedia sebagai alternatif slideshow otomatis. |

---

## 11. Rencana Pengembangan (Roadmap)

| Fase | Cakupan |
|------|---------|
| **Fase 1 — MVP** | Setup Laravel + Inertia + React + Tailwind, autentikasi admin, CRUD kategori/karyawan/nominee/pemenang, halaman publik dasar (slideshow tanpa animasi tirai), upload & putar backsound sederhana. |
| **Fase 2 — Experience Enhancement** | Animasi tirai terbuka, transisi antar slide yang lebih halus, crossfade backsound, mode fullscreen, kontrol manual slideshow. |
| **Fase 3 — Operasional Event** | Preview admin real-time, pengaturan durasi per slide, remote-control slideshow dari admin (via websocket/Reverb) untuk sinkronisasi saat acara live. |
| **Fase 4 — Polishing** | Optimasi performa & gambar, aksesibilitas, pengujian lintas perangkat/browser, dokumentasi deployment. |

---

## 12. Kriteria Keberhasilan (Success Metrics)

- Admin dapat membuat kategori, nominasi, dan menetapkan pemenang dalam waktu < 5 menit per kategori tanpa kendala.
- Slideshow publik berjalan otomatis tanpa jeda/error selama sesi presentasi penuh (uji minimal 30 menit berjalan).
- Animasi tirai & backsound berjalan sinkron tanpa lag pada perangkat presentasi standar (laptop + proyektor).
- Tidak ada duplikasi pemenang dalam satu kategori (validasi backend berjalan 100%).

---

## 13. Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Browser memblokir autoplay audio | Sediakan tombol "mulai" awal yang sekaligus meng-unlock audio context sebelum slideshow dimulai. |
| File audio/gambar besar memperlambat load | Kompresi otomatis saat upload (Service: `MediaUploadService`), gunakan format modern (WebP/MP3 bitrate rendah namun jernih). |
| Kesalahan input admin (pemenang ganda) | Validasi di level Service + constraint unique di database (`category_id` unique pada tabel `winners`). |
| Koneksi internet lambat saat event | Opsi preloading seluruh aset (gambar & audio) sebelum slideshow dimulai. |

---

*Dokumen ini dapat diperbarui seiring diskusi lebih lanjut mengenai detail fitur, terutama pada Fase 2–3 (animasi lanjutan dan remote control).*
