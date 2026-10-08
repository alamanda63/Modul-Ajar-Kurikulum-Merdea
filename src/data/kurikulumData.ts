import { PresetTemplate } from '../types/modulAjar.ts';

export interface FaseOption {
  fase: string;
  jenjang: string;
  kelas: string[];
  deskripsi: string;
}

export const DAFTAR_FASE: FaseOption[] = [
  { fase: 'Fondasi', jenjang: 'PAUD / TK', kelas: ['TK A', 'TK B'], deskripsi: 'Pendidikan Anak Usia Dini (4 - 6 Tahun)' },
  { fase: 'A', jenjang: 'SD / MI', kelas: ['1', '2'], deskripsi: 'Fase A: Kelas 1 dan Kelas 2 SD' },
  { fase: 'B', jenjang: 'SD / MI', kelas: ['3', '4'], deskripsi: 'Fase B: Kelas 3 dan Kelas 4 SD' },
  { fase: 'C', jenjang: 'SD / MI', kelas: ['5', '6'], deskripsi: 'Fase C: Kelas 5 dan Kelas 6 SD' },
  { fase: 'D', jenjang: 'SMP / MTs', kelas: ['7', '8', '9'], deskripsi: 'Fase D: Kelas 7, 8, dan 9 SMP' },
  { fase: 'E', jenjang: 'SMA / SMK / MA', kelas: ['10'], deskripsi: 'Fase E: Kelas 10 SMA/SMK' },
  { fase: 'F', jenjang: 'SMA / SMK / MA', kelas: ['11', '12'], deskripsi: 'Fase F: Kelas 11 dan 12 SMA/SMK' },
];

export const MATA_PELAJARAN_POPULER = [
  'IPAS (Ilmu Pengetahuan Alam & Sosial)',
  'Matematika',
  'Bahasa Indonesia',
  'Pendidikan Pancasila',
  'Bahasa Inggris',
  'Ilmu Pengetahuan Alam (IPA)',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Informatika',
  'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
  'Seni Rupa / Seni Budaya',
  'Pendidikan Agama & Budi Pekerti',
  'Bimbingan Konseling (BK)',
  'Fisika',
  'Biologi',
  'Kimia',
  'Ekonomi',
  'Sosiologi',
  'Geografi',
  'Sejarah',
];

export const DIMENSI_P3 = [
  {
    id: 'beriman',
    label: 'Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia',
    desc: 'Menghayati nilai spiritual, cinta sesama, dan integritas',
  },
  {
    id: 'berkebinekaan',
    label: 'Berkebinekaan Global',
    desc: 'Menghargai keragaman budaya, toleransi, dan wawasan dunia',
  },
  {
    id: 'gotong_royong',
    label: 'Bergotong Royong',
    desc: 'Mampu berkolaborasi, peduli, dan berbagi dalam tim',
  },
  {
    id: 'mandiri',
    label: 'Mandiri',
    desc: 'Bertanggung jawab atas proses dan hasil belajarnya sendiri',
  },
  {
    id: 'bernalar_kritis',
    label: 'Bernalar Kritis',
    desc: 'Mampu memproses informasi, mengevaluasi fakta, dan mengambil keputusan logis',
  },
  {
    id: 'kreatif',
    label: 'Kreatif',
    desc: 'Mampu memodifikasi, menghasilkan gagasan orisinal, dan karya bernilai',
  },
];

export const MODEL_PEMBELAJARAN = [
  {
    nama: 'Problem Based Learning (PBL)',
    deskripsi: 'Berpusat pada pemecahan masalah autentik di dunia nyata melalui penyelidikan kelompok',
  },
  {
    nama: 'Project Based Learning (PjBL)',
    deskripsi: 'Berpusat pada perancangan dan pembuatan produk/karya nyata melalui proyek terstruktur',
  },
  {
    nama: 'Discovery Learning',
    deskripsi: 'Menemukan sendiri konsep atau pola melalui observasi, manipulasi data, dan generalisasi',
  },
  {
    nama: 'Inkuiri Terbimbing (Guided Inquiry)',
    deskripsi: 'Mendorong siswa merumuskan pertanyaan, hipotesis, dan pengujian dengan bimbingan guru',
  },
  {
    nama: 'Cooperative Learning (STAD / Jigsaw)',
    deskripsi: 'Kolaborasi antaranggota kelompok dengan pembagian peran dan tanggung jawab belajar bersama',
  },
  {
    nama: 'Diferensiasi Stasiun Belajar (Station Rotation)',
    deskripsi: 'Rotasi kelompok kecil pada pos-pos aktivitas dengan tingkat kesulitan dan media beragam',
  },
];

export const KARAKTERISTIK_SISWA_PRESETS = [
  {
    label: 'Kesiapan Beragam (Klasik TaRL)',
    value: 'Peserta didik memiliki tingkat kesiapan beragam: 25% kelompok Mahir (cepat paham konsep abstrak), 50% kelompok Cakap (paham konsep inti dengan bimbingan standar), dan 25% kelompok Perlu Bimbingan (memerlukan representasi konkret dan bimbingan langsung).',
  },
  {
    label: 'Dominan Gaya Visual & Kinestetik',
    value: 'Mayoritas peserta didik sangat aktif, menyukai simulasi interaktif, media visual bergambar/video, serta aktivitas hands-on langsung dibandingkan membaca teks panjang.',
  },
  {
    label: 'Tantangan Literasi & Pemahaman Konsep',
    value: 'Peserta didik masih memerlukan penguatan literasi membaca instruksi dan kosakata esensial, membutuhkan bahan ajar bertahap dilengkapi petunjuk visual yang jelas.',
  },
  {
    label: 'Tingkat Nalar Kritis Tinggi / Akselerasi',
    value: 'Peserta didik sudah memiliki dasar konsep yang kuat, aktif bertanya, terbiasa berdiskusi mandiri, dan siap dengan tantangan pemecahan masalah kompleks berorientasi HOTS.',
  },
];

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'ipas-4-zat',
    title: '🌿 IPAS Kelas 4 - Perubahan Wujud Zat & Siklus Air',
    mataPelajaran: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    jenjang: 'SD / MI',
    fase: 'B',
    kelas: '4',
    topik: 'Wujud Zat dan Perubahannya dalam Kehidupan Sehari-hari',
    capaianPembelajaran: 'Peserta didik mengidentifikasi proses perubahan wujud zat dan mendeskripsikan bagaimana energi kalor berperan dalam perubahan wujud zat serta kaitannya dengan siklus air di lingkungan sekitar.',
    tujuanPembelajaran: '1. Peserta didik dapat menganalisis proses perubahan wujud zat (mencair, membeku, menguap, mengembun) melalui percobaan sederhana dengan tepat.\n2. Peserta didik dapat menghubungkan pengaruh panas (kalor) terhadap perubahan wujud zat dalam kehidupan sehari-hari secara kritis.\n3. Peserta didik dapat menyajikan laporan hasil penyelidikan kelompok mengenai siklus air dengan penuh tanggung jawab.',
    karakteristikSiswa: 'Siswa kelas 4 terdiri dari 6 siswa cepat memahami (kelompok mahir), 14 siswa dengan pemahaman rata-rata, dan 8 siswa yang butuh alat peraga konkret saat memahami perpindahan kalor.',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    dimensiProfilPancasila: [
      'Bernalar Kritis',
      'Bergotong Royong',
      'Mandiri'
    ],
    alokasiWaktu: '2 Pertemuan (4 JP x 35 Menit)',
    jumlahPertemuan: 2,
  },
  {
    id: 'matematika-7-aljabar',
    title: '📐 Matematika Kelas 7 - Bentuk Aljabar & Pemodelan Sehari-hari',
    mataPelajaran: 'Matematika',
    jenjang: 'SMP / MTs',
    fase: 'D',
    kelas: '7',
    topik: 'Bentuk Aljabar: Koefisien, Variabel, Konstanta, dan Operasi Penjumlahan/Pengurangan',
    capaianPembelajaran: 'Peserta didik dapat mengenali, memprediksi, dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan. Mereka dapat menyatakan suatu situasi ke dalam bentuk aljabar dan menggunakan sifat-sifat operasi untuk menyelesaikan masalah.',
    tujuanPembelajaran: '1. Melalui eksplorasi situasi kontekstual jual-beli, peserta didik dapat mengidentifikasi unsur-unsur bentuk aljabar (variabel, koefisien, konstanta, dan suku sejenis) secara tepat.\n2. Peserta didik dapat menyederhanakan operasi penjumlahan dan pengurangan bentuk aljabar dalam pemecahan masalah kontekstual.\n3. Peserta didik dapat mengomunikasikan pemodelan matematika dari masalah nyata secara sistematis.',
    karakteristikSiswa: 'Sebagian siswa (sekitar 30%) masih mengalami miskonsepsi dalam operasi tanda negatif dan membedakan variabel dengan konstanta. Sekitar 20% sudah mahir memodelkan rumus cepat.',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    dimensiProfilPancasila: [
      'Bernalar Kritis',
      'Kreatif',
      'Bergotong Royong'
    ],
    alokasiWaktu: '2 Pertemuan (5 JP x 40 Menit)',
    jumlahPertemuan: 2,
  },
  {
    id: 'bahasa-indonesia-2-teks',
    title: '📖 Bahasa Indonesia Kelas 2 - Membaca & Menulis Teks Deskripsi',
    mataPelajaran: 'Bahasa Indonesia',
    jenjang: 'SD / MI',
    fase: 'A',
    kelas: '2',
    topik: 'Mengenal Ciri-Ciri Benda dan Menulis Kalimat Deskripsi Sederhana',
    capaianPembelajaran: 'Peserta didik mampu bersikap menjadi penyimak yang baik, memahami informasi dari teks deskripsi lisan dan teks aural yang dibacakan, serta mampu merangkai kalimat sederhana tentang objek di lingkungan sekitar.',
    tujuanPembelajaran: '1. Peserta didik mampu mengidentifikasi kosakata sifat dan ciri-ciri benda (warna, ukuran, bentuk, rasa) dari teks yang disimak dengan benar.\n2. Melalui bimbingan visual kartu bergambar, peserta didik mampu menulis 3-4 kalimat deskripsi sederhana dengan menggunakan huruf kapital dan tanda titik secara tepat.\n3. Peserta didik mampu menceritakan benda kesayangannya di depan teman sekelas dengan percaya diri.',
    karakteristikSiswa: 'Kesiapan membaca bervariasi: 5 siswa sudah sangat lancar membaca paragraf, 12 siswa membaca kalimat sederhana, 7 siswa masih mengeja kata berimbuhan sehingga butuh teks bergambar besar.',
    modelPembelajaran: 'Discovery Learning',
    dimensiProfilPancasila: [
      'Mandiri',
      'Kreatif',
      'Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia'
    ],
    alokasiWaktu: '2 Pertemuan (4 JP x 35 Menit)',
    jumlahPertemuan: 2,
  },
  {
    id: 'informatika-10-algoritma',
    title: '💻 Informatika Kelas 10 - Berpikir Komputasional & Algoritma',
    mataPelajaran: 'Informatika',
    jenjang: 'SMA / SMK / MA',
    fase: 'E',
    kelas: '10',
    topik: 'Penerapan 4 Pilar Berpikir Komputasional (Dekomposisi, Pola, Abstraksi, Algoritma)',
    capaianPembelajaran: 'Peserta didik mampu menerapkan strategi berpikir komputasional untuk menghasilkan banyak solusi dari persoalan optimasi, struktur data diskrit, dan algoritma efisien.',
    tujuanPembelajaran: '1. Peserta didik dapat menganalisis masalah kompleks sehari-hari menggunakan teknik dekomposisi dan abstraksi secara akurat.\n2. Peserta didik dapat merancang alur logika algoritma penyelesaian masalah dalam bentuk flowchart dan pseudocode terstruktur.\n3. Peserta didik dapat mengevaluasi efisiensi langkah alternatif solusi dalam kerja kelompok kolaboratif.',
    karakteristikSiswa: 'Siswa kelas 10 memiliki latar belakang SMP berbeda: ada yang telah belajar dasar koding (20%), sebagian besar baru mengenal flowchart konseptual, membutuhkan analogi logika sehari-hari.',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    dimensiProfilPancasila: [
      'Bernalar Kritis',
      'Kreatif',
      'Mandiri'
    ],
    alokasiWaktu: '2 Pertemuan (4 JP x 45 Menit)',
    jumlahPertemuan: 2,
  },
  {
    id: 'pancasila-5-gotongroyong',
    title: '🇮🇩 Pend. Pancasila Kelas 5 - Gotong Royong dalam Keberagaman',
    mataPelajaran: 'Pendidikan Pancasila',
    jenjang: 'SD / MI',
    fase: 'C',
    kelas: '5',
    topik: 'Praktik Gotong Royong dan Toleransi Keberagaman Sosial Budaya',
    capaianPembelajaran: 'Peserta didik mampu memahami dan menyajikan bentuk-bentuk keberagaman suku bangsa, sosial, budaya di Indonesia, serta mempraktikkan hidup gotong royong dalam kehidupan bermasyarakat.',
    tujuanPembelajaran: '1. Peserta didik dapat menguraikan nilai-nilai kebersamaan dan manfaat gotong royong di lingkungan sekolah dan tempat tinggal.\n2. Peserta didik dapat merancang aksi nyata kegiatan gotong royong sederhana untuk mengatasi masalah kebersihan atau kepedulian sosial di kelas.\n3. Peserta didik menunjukkan sikap saling menghargai perbedaan latar belakang teman saat menyelesaikan tugas kelompok.',
    karakteristikSiswa: 'Siswa memiliki latar belakang suku dan kebiasaan yang heterogen, aktif bersosialisasi, menyukai studi kasus video atau cerita bergambar situasi nyata di masyarakat.',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    dimensiProfilPancasila: [
      'Bergotong Royong',
      'Berkebinekaan Global',
      'Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia'
    ],
    alokasiWaktu: '2 Pertemuan (4 JP x 35 Menit)',
    jumlahPertemuan: 2,
  },
];
