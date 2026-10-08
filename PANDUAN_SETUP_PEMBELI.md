# Panduan Pengalihan & Pemasangan Aplikasi ke Akun Google AI Studio Pembeli
*(Model Bisnis Jual Putus / One-Time Purchase - 100% Bebas Biaya Server bagi Penjual)*

---

## 🎯 Mengapa Model Ini Paling Menguntungkan untuk Anda?
1. **0 Biaya Server**: Aplikasi di-hosting secara mandiri di cloud Google milik pembeli.
2. **0 Pemotongan Kuota Anda**: Kuota AI dipotong dari akun Google pembeli sendiri (menggunakan kuota gratis akun Google pembeli).
3. **100% Laba Bersih**: Biaya yang dibayar pembeli (misal Rp100.000 - Rp250.000) adalah keuntungan bersih Anda tanpa ada biaya bulanan yang harus Anda bayar.
4. **Data Guru Aman & Privat**: Modul ajar yang dibuat oleh guru tidak akan pernah bercampur dengan guru lain.

---

## 🛠️ LANGKAH 1: Persiapan oleh Penjual (Hanya Perlu Dilakukan Sekali)

1. **Simpan / Ekspor Kode Aplikasi ke GitHub**:
   - Di Google AI Studio, pada panel atas/pengaturan proyek aplikasi ini, pilih menu **Export** atau **Sync to GitHub**.
   - Buat repositori baru di akun GitHub Anda, misalnya: `generator-modul-ajar-merdeka`.
   - Atau Anda juga dapat mengunduh seluruh folder proyek ini dalam format `.zip`.

2. **Siapkan Paket Penjualan untuk Pembeli**:
   - Setelah pembeli melakukan pembayaran (transfer / QRIS), kirimkan:
     - Tautan repositori GitHub Anda (atau kirim file ZIP kode sumber).
     - Teks panduan 3 langkah di bawah ini kepada pembeli (bisa via WhatsApp/Email).

---

## 📋 LANGKAH 2: Panduan untuk Pembeli (Kirimkan Teks Ini ke Guru/Pembeli)

> ### 📢 Panduan Aktivasi Aplikasi Modul Ajar Kurikulum Merdeka di Akun Anda:
> 
> Halo Bapak/Ibu Guru, terima kasih telah membeli aplikasi **ModulAjar AI Kurikulum Merdeka**. Berikut langkah mudah memasang aplikasi ini di akun Google pribadi Anda (hanya butuh waktu 3 menit):
> 
> 1. **Buka Google AI Studio**:
>    - Akses peramban dan buka: [https://aistudio.google.com](https://aistudio.google.com)
>    - Masuk (*Sign in*) menggunakan akun Google/Gmail pribadi Bapak/Ibu (bisa menggunakan akun Gmail biasa atau akun `@guru...belajar.id`).
> 
> 2. **Impor Aplikasi**:
>    - Di halaman utama Google AI Studio, klik tombol **"Build"** atau **"New App"**.
>    - Pilih opsi **"Import from GitHub"**.
>    - Masukkan tautan repositori yang telah kami berikan: `[MASUKKAN_LINK_GITHUB_ANDA]`
>    - Klik tombol **"Import"**.
> 
> 3. **Aplikasi Siap Digunakan**:
>    - Google AI Studio akan secara otomatis menyiapkan server pribadi dan menyambungkan API Key akun Bapak/Ibu tanpa perlu konfigurasi teknis yang rumit.
>    - Bapak/Ibu akan mendapatkan tautan web pribadi yang dapat disimpan/dibookmark di laptop atau ponsel.
>    - Bapak/Ibu dapat menyusun modul ajar, mencetak ke PDF/kertas, serta mengunduh dokumen Word kapan pun seumur hidup!

---

## 💡 Alternatif: Pembeli yang Tidak Memiliki Akun GitHub
Jika guru/pembeli belum memiliki akun GitHub:
1. Anda cukup membuat repositori GitHub Anda berstatus **Public (Template Repository)**.
2. Dengan status Public Template, pembeli cukup menyalin link GitHub tersebut ke Google AI Studio miliknya tanpa perlu mendaftar akun GitHub terlebih dahulu. Google AI Studio dapat langsung mengimpor dari repositori publik dalam 1 kali klik.

---

## 🔒 Konfigurasi Teknis yang Sudah Dipersiapkan:
Aplikasi ini sudah dioptimalkan untuk langsung bekerja (*Plug & Play*) di akun baru:
- `metadata.json` sudah disetel dengan `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` sehingga Google AI Studio otomatis mengaktifkan AI Key pembeli.
- `.env.example` sudah disiapkan dengan standar Google AI Studio.
- Fitur **Mode Mandiri (Offline)** tetap aktif sehingga guru tetap bisa menggunakan aplikasi meskipun kuota internet atau AI mereka sedang terbatas.
