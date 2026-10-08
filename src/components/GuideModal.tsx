import React from 'react';
import { X, BookOpen, CheckCircle, Target, Users, HelpCircle, Layers, WifiOff, Laptop, Zap } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Panduan Kurikulum Merdeka & Penggunaan Offline
              </h3>
              <p className="text-xs text-slate-500">
                Prinsip Resmi Kemendikbudristek & Panduan Operasional Tanpa Kuota/Internet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-700">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-emerald-800">
              <Target className="w-4 h-4" />
              1. Dari Capaian Pembelajaran (CP) ke Tujuan Pembelajaran (TP)
            </h4>
            <p className="leading-relaxed">
              Capaian Pembelajaran (CP) merupakan kompetensi pembelajaran minimum yang harus dicapai peserta didik pada setiap fase. Dari kalimat CP yang luas, guru membedah menjadi kompetensi esensial dan konten inti untuk merumuskan <strong>Tujuan Pembelajaran (TP)</strong>.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <div className="font-semibold text-slate-800">Formula ABCD dalam Merumuskan TP:</div>
              <ul className="list-disc pl-5 space-y-0.5 text-xs text-slate-600">
                <li><strong>A (Audience):</strong> Peserta didik / Siswa.</li>
                <li><strong>B (Behavior):</strong> Kata kerja operasional (menganalisis, merancang, membandingkan).</li>
                <li><strong>C (Condition):</strong> Kondisi belajar (melalui percobaan sederhana, diskusi kelompok, simulasi).</li>
                <li><strong>D (Degree):</strong> Tingkat ketercapaian (dengan tepat, kritis, mandiri).</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-emerald-800">
              <Users className="w-4 h-4" />
              2. Pembelajaran Berdiferensiasi & TaRL (Teaching at the Right Level)
            </h4>
            <p className="leading-relaxed">
              Kurikulum Merdeka mengedepankan pembelajaran yang berpihak pada murid. Guru melakukan <em>asesmen diagnostik awal</em> untuk memetakan kesiapan peserta didik ke dalam 3 spektrum:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Perlu Bimbingan (Dasar)</span>
                <p className="text-xs text-slate-600">Disederhanakan dengan media konkrit, instruksi terpandu, dan pendampingan bertahap (scaffolding).</p>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <span className="font-bold text-blue-900 block mb-1">Cakap (Menengah)</span>
                <p className="text-xs text-slate-600">Mengerjakan tugas standar dengan panduan kerja kelompok terstruktur dan mandiri.</p>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">Mahir (Tinggi)</span>
                <p className="text-xs text-slate-600">Mendapatkan tantangan pengayaan, investigasi terbuka, serta menjadi tutor sebaya.</p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-emerald-800">
              <Layers className="w-4 h-4" />
              3. Tiga Dimensi Diferensiasi di Kelas
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
              <li>
                <strong>Diferensiasi Konten:</strong> Variasi bahan ajar (video, infografis, benda riil, artikel teks) sesuai kesiapan dan gaya belajar siswa.
              </li>
              <li>
                <strong>Diferensiasi Proses:</strong> Variasi cara belajar siswa (diskusi kelompok, eksperimen, bimbingan mandiri, rotasi stasiun belajar).
              </li>
              <li>
                <strong>Diferensiasi Produk:</strong> Fleksibilitas wujud karya unjuk kerja siswa (laporan tertulis, poster/mindmap, presentasi lisan, model simulasi).
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-emerald-800">
              <CheckCircle className="w-4 h-4" />
              4. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
            </h4>
            <p className="leading-relaxed">
              Sebagai pengganti KKM tunggal, Kurikulum Merdeka menggunakan KKTP dengan interval deskripsi yang lebih bermakna (misal: 0-60% Perlu Bimbingan, 61-74% Cukup, 75-88% Baik, 89-100% Sangat Baik) agar setiap murid mendapatkan intervensi tindak lanjut yang tepat.
            </p>
          </div>

          {/* Section 5: Offline Capabilities */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-emerald-800">
              <WifiOff className="w-4 h-4 text-emerald-600" />
              5. Apakah Aplikasi Ini Bisa Dijalankan Offline?
            </h4>
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-2">
              <p className="font-bold text-emerald-950">
                ✅ YA, aplikasi dapat digunakan secara offline (tanpa koneksi internet) dengan kemampuan berikut:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong>Mode Generator Mandiri (Offline):</strong> Anda dapat memilih tombol <em>"Mode Mandiri (Offline)"</em> untuk menyusun Modul Ajar lengkap (Informasi Umum, Sintaks Model PBL/Discovery, Asesmen KKTP, LKPD, Diferensiasi TaRL) langsung di browser dalam hitungan detik tanpa kuota dan tanpa internet.
                </li>
                <li>
                  <strong>Buka, Edit & Kelola Koleksi:</strong> Modul ajar yang sudah disimpan otomatis berada di memori lokal peramban (<code>LocalStorage</code>), sehingga dapat dibaca, diedit, dan disalin kapan saja tanpa internet.
                </li>
                <li>
                  <strong>Cetak ke PDF / Kertas & Unduh Word:</strong> Fitur Cetak Resmi A4 (Simpan ke PDF) serta Unduh Dokumen Word (.doc) memiliki mesin lokal langsung di peramban yang bekerja tanpa perlu akses internet.
                </li>
                <li>
                  <strong>Menjalankan di Komputer / Laptop Lokal (Localhost):</strong> Proyek ini dapat diunduh (source code) dan dijalankan di laptop secara mandiri menggunakan Node.js (<code>npm install</code> lalu <code>npm run dev</code>). Di lingkungan sekolah 3T tanpa internet, laptop tetap bisa membuka <code>http://localhost:3000</code> dan menjalankan seluruh fitur Mode Mandiri secara penuh.
                </li>
              </ul>
              <div className="mt-2 text-[11px] text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-200/60">
                💡 <em>Catatan:</em> Koneksi internet hanya dibutuhkan jika Anda ingin menggunakan <strong>Mode AI Cloud (Gemini)</strong> untuk variasi analisis kecerdasan buatan dinamis.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
