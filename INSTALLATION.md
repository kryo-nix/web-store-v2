# 🚀 Panduan Instalasi Lengkap Digital Store Modern

Dokumen ini memberikan instruksi langkah-demi-langkah untuk menginstal, mengonfigurasi, dan menjalankan website Toko Digital Modern.

## 📋 Prasyarat Sistem
Sebelum memulai, pastikan Anda telah menginstal:
- **Node.js** (Versi 18.x atau lebih baru)
- **npm** atau **yarn**
- **Git**
- **PostgreSQL Database** (Sangat disarankan menggunakan [Neon.tech](https://neon.tech) atau [Supabase](https://supabase.com) untuk kemudahan cloud)

---

## 🛠️ Langkah 1: Persiapan Project

1. **Clone Repository**
   ```bash
   git clone <url-repository-anda>
   cd digital-store-modern
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

---

## 🔑 Langkah 2: Konfigurasi Environment Variables

Buat file `.env` di root folder dengan menyalin dari `.env.example`:
```bash
cp .env.example .env
```

Buka file `.env` dan isi nilai berikut:

| Variabel | Deskripsi | Cara Mendapatkan |
| :--- | :--- | :--- |
| `DATABASE_URL` | Koneksi string PostgreSQL | Ambil dari Dashboard Neon.tech/Supabase (format: `postgresql://user:pass@host/db?sslmode=require`) |
| `NEXTAUTH_SECRET` | String acak untuk keamanan session | Jalankan `openssl rand -base64 32` di terminal atau buat string acak panjang |
| `NEXTAUTH_URL` | URL aplikasi | Local: `http://localhost:3000` \| Production: `https://domain-anda.vercel.app` |
| `TELEGRAM_BOT_TOKEN` | Token Bot Telegram | Buat bot via [@BotFather](https://t.me/BotFather) di Telegram |
| `TELEGRAM_CHAT_ID` | ID Chat Owner untuk notifikasi | Kirim pesan ke bot Anda, lalu akses `https://api.telegram.org/bot<TOKEN>/getUpdates` atau gunakan bot [@userinfobot](https://t.me/userinfobot) |

---

## 🗄️ Langkah 3: Database & Admin Setup

1. **Sinkronisasi Schema Database**
   Jalankan perintah ini untuk membuat tabel-tabel yang diperlukan di PostgreSQL:
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Membuat Akun Admin Pertama (Seeding)**
   Karena website dimulai dalam keadaan kosong, Anda perlu membuat akun admin pertama kali melalui script seed:
   ```bash
   # Instal ts-node jika belum ada (untuk menjalankan file typescript)
   npm install -g ts-node typescript

   # Jalankan script seed
   npx ts-node lib/seed.ts
   ```
   **Kredensial Default Admin:**
   - Username: `admin`
   - Password: `admin123`
   *(Segera ganti password setelah login pertama kali melalui dashboard jika fitur ganti password sudah tersedia, atau ubah langsung di database).*

---

## 🚀 Langkah 4: Menjalankan Aplikasi

1. **Mode Development** (Untuk pengembangan)
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

2. **Mode Production** (Untuk testing build)
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ Langkah 5: Deployment ke Vercel

1. **Push Code ke GitHub/GitLab/Bitbucket**.
2. **Import Project di Vercel**:
   - Hubungkan akun Git Anda ke Vercel.
   - Pilih repository `digital-store-modern`.
3. **Konfigurasi Environment Variables**:
   - Masukkan semua variabel dari `.env` ke bagian **Environment Variables** di Dashboard Vercel.
4. **Konfigurasi Build Command**:
   Ubah "Build Command" di settings Vercel menjadi:
   ```bash
   npx prisma generate && next build
   ```
5. **Klik Deploy**.

---

## 💡 Tips Tambahan

### Manajemen Gambar
Website ini menggunakan URL gambar untuk produk, banner, dan logo. Anda bisa:
- Mengunggah gambar ke layanan seperti **Cloudinary**, **ImgBB**, atau **Firebase Storage**.
- Masukkan URL gambar tersebut ke dalam Dashboard Admin.

### Mengatasi Masalah Umum (Troubleshooting)
- **Error: Prisma Client not found**: Jalankan `npx prisma generate`.
- **Error: Database connection failed**: Pastikan IP Address Vercel/Local Anda sudah di-whitelist di dashboard database (Neon/Supabase).
- **Chatbot tidak membalas**: Pastikan `chatbot_active` di Settings Admin bernilai `true`.

---

## 🛠️ Ringkasan Perintah Cepat (Cheat Sheet)
```bash
npm install               # Install library
npx prisma migrate dev    # Update database
npx prisma generate       # Update client prisma
npx ts-node lib/seed.ts   # Buat admin default
npm run dev               # Jalankan lokal
```
