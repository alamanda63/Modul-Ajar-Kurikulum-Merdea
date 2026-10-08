import { ModulAjar } from '../types/modulAjar.ts';

export function buildOfflineModulAjar(params: {
  mataPelajaran: string;
  jenjang?: string;
  fase?: string;
  kelas?: string;
  semester?: string;
  alokasiWaktu?: string;
  jumlahPertemuan?: number;
  capaianPembelajaran?: string;
  tujuanPembelajaran: string;
  karakteristikSiswa?: string;
  modelPembelajaran?: string;
  dimensiProfilPancasila?: string[] | string;
  saranaPrasarana?: string;
  namaGuru?: string;
  namaSekolah?: string;
}): ModulAjar {
  const {
    mataPelajaran,
    jenjang = 'SD / SMP / SMA',
    fase = 'B',
    kelas = '4',
    semester = '1 (Ganjil)',
    alokasiWaktu = '2 Pertemuan (4 JP)',
    jumlahPertemuan = 2,
    capaianPembelajaran = 'Peserta didik memahami konsep esensial materi serta mengaplikasikannya dalam pemecahan masalah kehidupan sehari-hari.',
    tujuanPembelajaran,
    karakteristikSiswa = 'Kesiapan belajar peserta didik heterogen: kelompok mahir, cakap, dan perlu bimbingan konkret.',
    modelPembelajaran = 'Problem Based Learning (PBL)',
    dimensiProfilPancasila = ['Bernalar Kritis', 'Bergotong Royong', 'Mandiri'],
    saranaPrasarana = 'Buku paket kurikulum merdeka, lembar kerja peserta didik, proyektor/media visual, benda konkret sekitar kelas',
    namaGuru = 'Guru Mata Pelajaran',
    namaSekolah = 'Satuan Pendidikan',
  } = params;

  // Split multi-line TP into clean array
  const tpList = tujuanPembelajaran
    .split('\n')
    .map(t => t.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(t => t.length > 0);

  if (tpList.length === 0) {
    tpList.push(`Peserta didik dapat memahami dan menerapkan konsep ${mataPelajaran} secara kritis dan bermakna.`);
  }

  const p3List = Array.isArray(dimensiProfilPancasila)
    ? dimensiProfilPancasila
    : typeof dimensiProfilPancasila === 'string'
    ? dimensiProfilPancasila.split(',').map(s => s.trim())
    : ['Bernalar Kritis', 'Bergotong Royong', 'Mandiri'];

  const numPertemuan = Number(jumlahPertemuan) || 2;
  const rencanaPembelajaran = [];

  for (let i = 1; i <= numPertemuan; i++) {
    rencanaPembelajaran.push({
      pertemuanKe: i,
      alokasiWaktu: alokasiWaktu.includes('(') ? alokasiWaktu.split('(')[1].replace(')', '') : '2 x 35/40 menit',
      tujuanKhususPertemuan: `Pertemuan ${i}: Eksplorasi konsep dan aplikasi pemecahan masalah ${mataPelajaran}`,
      kegiatanPendahuluan: [
        'Guru membuka pembelajaran dengan salam hangat, berdoa bersama, dan memeriksa kehadiran siswa.',
        `Apersepsi: Mengaitkan materi ${mataPelajaran} dengan pengalaman nyata dan kesiapan awal peserta didik.`,
        'Pemberian pertanyaan pemantik kontekstual untuk memancing rasa ingin tahu dan nalar kritis siswa.',
        'Penyampaian tujuan pembelajaran, alur kegiatan berkelompok, dan teknik asesmen yang digunakan.',
      ],
      kegiatanInti: [
        {
          faseSintaks: 'Fase 1: Orientasi Peserta Didik pada Masalah Nyata',
          aktivitasGuru: `Menampilkan studi kasus/fenomena nyata terkait topik ${mataPelajaran} dan mengajukan masalah pemantik.`,
          aktivitasSiswa: 'Mengamati fenomena masalah, mengajukan pertanyaan kritis, dan mencatat hal-hal penting di lembar kerja.',
        },
        {
          faseSintaks: 'Fase 2: Mengorganisasi Peserta Didik untuk Belajar',
          aktivitasGuru: 'Membagi peserta didik ke dalam kelompok heterogen berdasarkan asesmen diagnostik kesiapan belajar.',
          aktivitasSiswa: 'Berkumpul bersama kelompok, membagi peran kerja (ketua, pencatat, juru bicara), dan memahami instruksi LKPD.',
        },
        {
          faseSintaks: 'Fase 3: Membimbing Penyelidikan Mandiri dan Kelompok (Diferensiasi Proses)',
          aktivitasGuru: 'Memberikan scaffolding terarah bagi kelompok yang butuh bimbingan, serta memfasilitasi eksplorasi mandiri bagi kelompok mahir.',
          aktivitasSiswa: 'Mengumpulkan informasi, berdiskusi memecahkan masalah, dan mencoba berbagai alternatif solusi dengan kerja sama.',
        },
        {
          faseSintaks: 'Fase 4: Mengembangkan dan Menyajikan Hasil Karya (Diferensiasi Produk)',
          aktivitasGuru: 'Membimbing siswa menyiapkan sajian hasil kerja kelompok sesuai bentuk karya yang dipilih (laporan ringkas, peta konsep, atau presentasi).',
          aktivitasSiswa: 'Menyusun laporan hasil diskusi kelompok dan mempresentasikannya di depan kelas dengan percaya diri.',
        },
        {
          faseSintaks: 'Fase 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah',
          aktivitasGuru: 'Memberikan umpan balik konstruktif, meluruskan miskonsepsi, dan mengapresiasi kolaborasi seluruh kelompok.',
          aktivitasSiswa: 'Memberikan tanggapan antarteman, melakukan refleksi atas proses pemecahan masalah, dan menyimpulkan konsep utama.',
        },
      ],
      kegiatanPenutup: [
        'Peserta didik bersama guru merangkum poin-poin esensial pembelajaran yang telah dilakukan.',
        'Refleksi pembelajaran bersama: apa yang paling menyenangkan dan bagian mana yang perlu diperdalam.',
        'Guru memberikan apresiasi atas antusiasme seluruh murid dan menyampaikan pengantar materi pertemuan berikutnya.',
        'Menutup kegiatan pembelajaran dengan doa bersama dan salam penutup.',
      ],
    });
  }

  const saranaList = saranaPrasarana
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (saranaList.length === 0) {
    saranaList.push('Buku Guru & Siswa Kurikulum Merdeka', 'Lembar Kerja Peserta Didik (LKPD)', 'Benda konkret kontekstual');
  }

  return {
    id: 'modul_' + Date.now(),
    createdAt: new Date().toISOString(),
    identitas: {
      penyusun: namaGuru,
      instansi: namaSekolah,
      mataPelajaran,
      fase,
      kelas,
      semester,
      alokasiWaktu,
      jumlahPertemuan: numPertemuan,
    },
    informasiUmum: {
      kompetensiAwal: `Peserta didik telah memiliki pengetahuan prasyarat dasar sebelum mempelajari materi pokok ${mataPelajaran}.`,
      profilPelajarPancasila: p3List,
      saranaPrasarana: saranaList,
      targetPesertaDidik: 'Peserta didik reguler/tipikal, peserta didik dengan kesulitan belajar, dan peserta didik berpencapaian tinggi.',
      karakteristikKesiapanSiswa: karakteristikSiswa || 'Siswa heterogen: kelompok perlu bimbingan dasar, cakap mandiri, dan pengayaan.',
      modelPembelajaran,
      metodePembelajaran: [
        'Diskusi Kelompok Kolaboratif',
        'Eksplorasi Konsep Kontekstual',
        'Tanya Jawab Interaktif & Reflektif',
        'Presentasi Karya',
      ],
    },
    komponenInti: {
      capaianPembelajaran,
      tujuanPembelajaran: tpList,
      pemahamanBermakna: `Memahami konsep ${mataPelajaran} membantu peserta didik berpikir logis, kritis, dan mampu menyelesaikan persoalan sehari-hari dengan bijak.`,
      pertanyaanPemantik: [
        `Mengapa konsep ${mataPelajaran} ini penting dalam kehidupan kita sehari-hari?`,
        `Apa yang akan terjadi jika kita menghadapi masalah nyata tanpa memahami konsep ini?`,
        `Bagaimana cara paling efektif menyelesaikan tantangan pada materi ini secara bergotong royong?`,
      ],
    },
    rencanaPembelajaran,
    pembelajaranBerdiferensiasi: {
      diferensiasiKonten: {
        kelompokPerluBimbingan: `Menyediakan media konkret, gambar berlabel, dan rangkuman poin-poin kunci materi ${mataPelajaran}.`,
        kelompokCakap: `Bahan ajar standar berupa modul teks bergambar, studi kasus terarah, dan infografis.`,
        kelompokMahir: `Bahan ajar tingkat lanjut berupa artikel eksplorasi, data terbuka, dan tantangan analisis terbuka.`,
      },
      diferensiasiProses: {
        kelompokPerluBimbingan: `Guru mendampingi secara intensif (scaffolding bertahap) dan memberikan contoh-contoh langsung.`,
        kelompokCakap: `Siswa berdiskusi dalam kelompok dengan lembar panduan terstruktur dan konsultasi berkala dengan guru.`,
        kelompokMahir: `Siswa melakukan investigasi mandiri, memecahkan masalah kompleks, dan bertindak sebagai tutor sebaya.`,
      },
      diferensiasiProduk: {
        kelompokPerluBimbingan: `Menyajikan hasil pemahaman dalam bentuk isian singkat, diagram sederhana, atau penyampaian lisan terpandu.`,
        kelompokCakap: `Menyajikan laporan terstruktur, peta konsep, atau presentasi ringkas hasil kerja kelompok.`,
        kelompokMahir: `Menghasilkan solusi inovatif berupa infografis digital, poster pemecahan masalah, atau usulan proyek nyata.`,
      },
    },
    asesmenPembelajaran: {
      asesmenDiagnostik: {
        teknik: 'Tanya Jawab Pemantik Lisan & Kuis Refleksi Awal',
        soalAtauInstrumen: [
          `Apa yang sudah kamu ketahui tentang topik ${mataPelajaran} ini sebelumnya?`,
          `Pernahkah kamu menemukan penerapan materi ini di lingkungan sekitarmu? Ceritakan secara singkat!`,
        ],
      },
      asesmenFormatif: {
        teknik: 'Observasi Performa Diskusi Kelompok & Lembar LKPD Berjenjang',
        rubrikObservasi: [
          {
            aspek: 'Kolaborasi & Gotong Royong',
            kriteria: 'Aktif berpartisipasi membagi tugas dan saling membantu dalam kelompok.',
          },
          {
            aspek: 'Bernalar Kritis & Analisis',
            kriteria: 'Mampu menghubungkan fakta materi dengan solusi pemecahan masalah yang diajukan.',
          },
          {
            aspek: 'Kemandirian & Tanggung Jawab',
            kriteria: 'Menyelesaikan bagian tugas tepat waktu dan menghargai masukan teman.',
          },
        ],
      },
      asesmenSumatif: {
        teknik: 'Tes Tertulis Pemahaman Konsep & Unjuk Kerja Proyek Sederhana',
        instrumenSoal: [
          {
            nomor: 1,
            soal: `Jelaskan prinsip utama dari materi ${mataPelajaran} yang telah kamu pelajari dan berikan 1 contoh penerapannya di lingkungan sekitarmu!`,
            kunciAtauKriteria: 'Siswa mampu mendefinisikan konsep inti dengan kalimat sendiri dan menyertakan contoh konkret yang relevan.',
            skor: 30,
          },
          {
            nomor: 2,
            soal: `Analisis sebuah masalah sederhana terkait topik ${mataPelajaran}, lalu rumuskan langkah-langkah solutif menurut nalar kritismu!`,
            kunciAtauKriteria: 'Penalaran logis, ketepatan urutan langkah penyelesaian masalah, serta orisinalitas ide.',
            skor: 40,
          },
          {
            nomor: 3,
            soal: `Buatlah kesimpulan mengenai nilai bermakna dari materi ini bagi kehidupan sehari-hari!`,
            kunciAtauKriteria: 'Kemampuan sintesis konsep dan refleksi kebermaknaan pembelajaran.',
            skor: 30,
          },
        ],
      },
      kktp: {
        kriteriaKetercapaian: [
          {
            kategori: 'Perlu Bimbingan (0 - 65%)',
            deskripsi: 'Belum mampu memahami konsep dasar materi tanpa pendampingan intensif dari guru.',
          },
          {
            kategori: 'Cukup (66 - 75%)',
            deskripsi: 'Mampu menjelaskan sebagian konsep esensial tetapi masih memerlukan konfirmasi dalam pemecahan masalah.',
          },
          {
            kategori: 'Baik (76 - 88%)',
            deskripsi: 'Memahami konsep dengan baik, mampu berkolaborasi, dan menyelesaikan LKPD secara tepat.',
          },
          {
            kategori: 'Sangat Baik (89 - 100%)',
            deskripsi: 'Menguasai konsep secara komprehensif, bernalar kritis tinggi, serta mampu membantu rekan sejawat.',
          },
        ],
      },
    },
    pengayaanDanRemedial: {
      programRemedial: `Bimbingan khusus secara individual atau kelompok kecil pada indikator yang belum tuntas, dengan bantuan media konkret atau tutor sebaya.`,
      programPengayaan: `Pemberian tugas eksplorasi lanjutan berbasis proyek mini atau analisis studi kasus mendalam bagi siswa yang telah melampaui KKTP.`,
    },
    refleksi: {
      refleksiGuru: [
        'Apakah seluruh sintaks kegiatan terlaksana sesuai alokasi waktu yang direncanakan?',
        'Sejauh mana efektivitas diferensiasi proses dalam memfasilitasi kebutuhan kelompok belajar?',
        'Apa perbaikan yang perlu dipersiapkan untuk pertemuan pembelajaran berikutnya?',
      ],
      refleksiSiswa: [
        'Bagian pembelajaran mana yang paling menarik dan mudah dipahami hari ini?',
        'Tantangan apa yang masih kamu rasakan saat mengerjakan lembar aktivitas?',
        'Apa yang akan kamu lakukan untuk meningkatkan pemahamanmu pada materi selanjutnya?',
      ],
    },
    lampiran: {
      lkpd: {
        judul: `LEMBAR KERJA PESERTA DIDIK (LKPD) - ${mataPelajaran.toUpperCase()}`,
        petunjuk: 'Bacalah petunjuk dengan saksama, diskusikan dalam kelompok, dan tuliskan hasil investigasi pada kolom yang tersedia.',
        aktivitasKelompok: [
          {
            bagian: 'Bagian 1: Eksplorasi Kasus Nyata',
            instruksi: 'Cermati permasalahan kontekstual yang disajikan dan rumuskan pokok masalahnya bersama kelompok.',
            tugas: 'Tuliskan 2 pertanyaan kunci yang ingin kelompok kalian jawab dari masalah tersebut!',
          },
          {
            bagian: 'Bagian 2: Investigasi & Pengumpulan Data',
            instruksi: 'Gunakan sumber belajar yang tersedia untuk mencari informasi pendukung.',
            tugas: 'Catat temuan-temuan penting dan diskusikan solusi yang paling logis.',
          },
          {
            bagian: 'Bagian 3: Penyimpulan & Penyajian Karya',
            instruksi: 'Susun simpulan kelompok dan persiapkan sajian laporan.',
            tugas: 'Presentasikan hasil pemecahan masalah di hadapan kelompok lain!',
          },
        ],
        kesimpulanSiswa: 'Tuliskan intisari kesimpulan yang kelompok kalian sepakati di sini.',
      },
      bahanBacaan: {
        ringkasanMateri: `Materi pokok ${mataPelajaran} pada Fase ${fase} Kelas ${kelas} menekankan pada pemahaman esensial dan keterampilan praktis. Peserta didik diajak untuk mengamati pola, menarik hubungan sebab-akibat, dan menerapkan pengetahuan dalam konteks lingkungan sekitar secara bertanggung jawab.`,
        panduanGuru: `Fokuskan peran guru sebagai fasilitator yang mengarahkan rasa ingin tahu siswa. Berikan dorongan afirmasi kepada kelompok yang membutuhkan bimbingan dan beri ruang eksplorasi lebih bebas bagi siswa berpencapaian tinggi.`,
      },
      glosarium: [
        {
          istilah: 'Diferensiasi',
          arti: 'Pendekatan pembelajaran yang menyesuaikan konten, proses, atau produk dengan kesiapan belajar murid.',
        },
        {
          istilah: 'KKTP',
          arti: 'Kriteria Ketercapaian Tujuan Pembelajaran sebagai acuan ketercapaian kompetensi murid.',
        },
        {
          istilah: 'TaRL',
          arti: 'Teaching at the Right Level, pembelajaran yang disesuaikan dengan tingkat capaian murid.',
        },
      ],
      daftarPustaka: [
        `Panduan Pembelajaran dan Asesmen Kurikulum Merdeka, Kemendikbudristek RI.`,
        `Buku Guru dan Buku Siswa ${mataPelajaran} Fase ${fase}, Pusat Kurikulum dan Perbukuan.`,
      ],
    },
  };
}
