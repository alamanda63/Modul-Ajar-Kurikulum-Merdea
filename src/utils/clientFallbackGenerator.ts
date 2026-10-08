import { ModulAjar } from '../types/modulAjar.ts';

export function generateModulClientSide(params: {
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
    karakteristikSiswa = 'Kesiapan belajar peserta didik beragam: kelompok mahir, cakap, dan perlu bimbingan konkret.',
    modelPembelajaran = 'Problem Based Learning (PBL)',
    dimensiProfilPancasila = ['Bernalar Kritis', 'Bergotong Royong', 'Mandiri'],
    saranaPrasarana = 'Buku teks kurikulum merdeka, lembar kerja siswa, benda konkret di lingkungan sekitar kelas',
    namaGuru = 'Guru Pengampu',
    namaSekolah = 'Satuan Pendidikan',
  } = params;

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
  const rencanaPertemuan = [];

  for (let i = 1; i <= numPertemuan; i++) {
    rencanaPertemuan.push({
      pertemuanKe: i,
      alokasiWaktu: alokasiWaktu.includes('(') ? alokasiWaktu.split('(')[1].replace(')', '') : '2 x 35/40 menit',
      tujuanKhususPertemuan: `Pertemuan ${i}: Eksplorasi konsep dan aplikasi pemecahan masalah ${mataPelajaran}`,
      kegiatanPendahuluan: [
        'Guru membuka pembelajaran dengan salam hangat, berdoa bersama, dan memeriksa kehadiran siswa.',
        `Apersepsi: Mengaitkan materi ${mataPelajaran} dengan pengalaman nyata dan capaian awal peserta didik.`,
        'Pemberian pertanyaan pemantik kontekstual untuk memancing rasa ingin tahu dan nalar kritis siswa.',
        'Penyampaian tujuan pembelajaran, alur kegiatan berkelompok, dan teknik asesmen yang digunakan.',
      ],
      kegiatanInti: [
        {
          faseSintaks: 'Fase 1: Orientasi Siswa pada Masalah Nyata',
          aktivitasGuru: `Menampilkan studi kasus/fenomena nyata terkait topik ${mataPelajaran} dan mengajukan masalah pemantik.`,
          aktivitasSiswa: 'Mengamati fenomena masalah, mengajukan pertanyaan kritis, dan mencatat hal-hal penting di lembar kerja.',
        },
        {
          faseSintaks: 'Fase 2: Mengorganisasi Siswa untuk Belajar',
          aktivitasGuru: 'Membagi peserta didik ke dalam kelompok heterogen berdasarkan asesmen diagnostik kesiapan belajar.',
          aktivitasSiswa: 'Berkumpul bersama kelompok, membagi peran kerja (ketua, pencatat, juru bicara), dan memahami instruksi LKPD.',
        },
        {
          faseSintaks: 'Fase 3: Membimbing Penyelidikan Mandiri dan Kelompok (Diferensiasi Proses)',
          aktivitasGuru: 'Memberikan pendampingan terarah bagi kelompok yang butuh bimbingan konkret, serta tantangan mandiri bagi kelompok mahir.',
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
      kompetensiAwal: `Peserta didik telah memiliki pengetahuan prasyarat dasar sebelum mempelajari topik ${mataPelajaran} pada Fase ${fase}.`,
      profilPelajarPancasila: p3List.map(p => `${p}: Diterapkan melalui diskusi kolaboratif, penalaran logis, dan tanggung jawab belajar.`),
      saranaPrasarana: saranaPrasarana.split(',').map(s => s.trim()),
      targetPesertaDidik: 'Peserta didik reguler/tipikal dengan akomodasi bagi peserta didik yang memerlukan bimbingan khusus maupun pencapaian tinggi.',
      karakteristikKesiapanSiswa: karakteristikSiswa,
      modelPembelajaran,
      metodePembelajaran: ['Diskusi Kelompok Kolaboratif', 'Penyelidikan Terbimbing', 'Tanya Jawab Bermakna', 'Presentasi Karya'],
    },
    komponenInti: {
      capaianPembelajaran,
      tujuanPembelajaran: tpList,
      pemahamanBermakna: `Mempelajari topik ${mataPelajaran} memberikan pemahaman bermakna bagi peserta didik untuk memecahkan persoalan kontekstual, berpikir kritis, dan berkontribusi positif bagi lingkungannya.`,
      pertanyaanPemantik: [
        `Mengapa konsep ${mataPelajaran} ini sangat penting kita pahami dalam aktivitas sehari-hari?`,
        'Bagaimana kita dapat membuktikan kebenaran suatu informasi dengan nalar kritis?',
        'Apa solusi terbaik yang bisa kalian tawarkan jika menghadapi masalah serupa di lingkungan sekitar?',
      ],
    },
    rencanaPembelajaran: rencanaPertemuan,
    pembelajaranBerdiferensiasi: {
      diferensiasiKonten: {
        kelompokPerluBimbingan: 'Disediakan bahan ajar visual sederhana dengan gambar ilustrasi, kosakata kunci, dan contoh konkret langsung.',
        kelompokCakap: 'Disediakan bahan ajar teks panduan standar lengkap dengan infografis dan pertanyaan penuntun terstruktur.',
        kelompokMahir: 'Disediakan studi kasus pengayaan terbuka, data komparatif, dan tantangan analisis yang lebih kompleks.',
      },
      diferensiasiProses: {
        kelompokPerluBimbingan: 'Guru memberikan pendampingan intensif (scaffolding bertahap) dan bimbingan langkah demi langkah secara berkala.',
        kelompokCakap: 'Bekerja mandiri dalam kelompok dengan pemantauan berkala dari guru serta arahan lembar kerja terstruktur.',
        kelompokMahir: 'Bekerja secara mandiri, melakukan eksplorasi strategi kreatif alternatif, dan dapat bertindak sebagai tutor sebaya.',
      },
      diferensiasiProduk: {
        kelompokPerluBimbingan: 'Menyajikan hasil pemecahan masalah dalam bentuk diagram sederhana, lembar isian terpandu, atau penjelasan lisan.',
        kelompokCakap: 'Menyajikan hasil dalam bentuk ringkasan laporan kelompok, peta pikiran (mindmap), atau poster ringkas.',
        kelompokMahir: 'Menyajikan hasil dalam bentuk laporan komprehensif, infografis solutif, atau paparan presentasi kreatif.',
      },
    },
    asesmenPembelajaran: {
      asesmenDiagnostik: {
        teknik: 'Tanya jawab lisan dan lembar ceklis apersepsi singkat sebelum pembelajaran dimulai.',
        soalAtauInstrumen: [
          `1. Apa yang kamu ketahui tentang materi ${mataPelajaran} ini dari kehidupan sehari-harimu?`,
          '2. Pengalaman apa yang paling berkesan bagimu saat menghadapi situasi terkait materi ini?',
        ],
      },
      asesmenFormatif: {
        teknik: 'Observasi keaktifan diskusi, keikutsertaan dalam kerja tim, dan ketepatan pengerjaan LKPD.',
        rubrikObservasi: [
          { aspek: 'Partisipasi dan Kolaborasi', kriteria: 'Aktif memberikan pendapat, mendengarkan rekan lain, dan menghargai perbedaan.' },
          { aspek: 'Bernalar Kritis', kriteria: 'Mampu menghubungkan fakta, menganalisis data, dan menarik kesimpulan logis.' },
          { aspek: 'Tanggung Jawab Belajar', kriteria: 'Menyelesaikan tugas kelompok dengan tepat waktu dan bersungguh-sungguh.' },
        ],
      },
      asesmenSumatif: {
        teknik: 'Tes tertulis / Penilaian Unjuk Kerja Proyek Kelompok',
        instrumenSoal: [
          {
            nomor: 1,
            soal: `Jelaskan secara logis konsep inti dari ${mataPelajaran} dan kaitannya dengan pemecahan masalah di kehidupan nyata!`,
            kunciAtauKriteria: 'Peserta didik mampu menguraikan konsep secara tepat dan menyertakan minimal 1 contoh nyata yang relevan.',
            skor: 50,
          },
          {
            nomor: 2,
            soal: 'Analisis sebuah permasalahan kontekstual di lingkungan sekitarmu, lalu berikan solusi berbasis materi yang telah dipelajari!',
            kunciAtauKriteria: 'Peserta didik merumuskan alternatif solusi yang aplikatif, runtut, dan beralasan kuat.',
            skor: 50,
          },
        ],
      },
      kktp: {
        kriteriaKetercapaian: [
          { kategori: 'Perlu Bimbingan (0-60%)', deskripsi: 'Belum mampu mengidentifikasi konsep esensial tanpa pendampingan langsung.' },
          { kategori: 'Cukup (61-74%)', deskripsi: 'Mampu menjelaskan konsep dasar secara umum namun masih memerlukan penguatan pada analisis.' },
          { kategori: 'Baik (75-88%)', deskripsi: 'Mampu menerapkan konsep dan menyelesaikan persoalan kontekstual dengan tepat.' },
          { kategori: 'Sangat Baik (89-100%)', deskripsi: 'Mampu menganalisis secara kritis, merancang solusi inovatif, serta membantu teman sebaya.' },
        ],
      },
    },
    pengayaanDanRemedial: {
      programRemedial: 'Bimbingan khusus secara individual atau kelompok kecil mengenai bagian materi yang belum dipahami dengan menggunakan analogi konkret.',
      programPengayaan: 'Pemberian proyek eksploratif lanjutan atau studi kasus nyata yang menantang nalar tingkat tinggi.',
    },
    refleksi: {
      refleksiGuru: [
        'Apakah seluruh sintaks model pembelajaran dapat terlaksana sesuai alokasi waktu yang direncanakan?',
        'Sejauh mana efektivitas strategi diferensiasi dalam membantu kelompok yang memerlukan bimbingan intensif?',
        'Langkah apa yang perlu diperbaiki untuk pertemuan berikutnya agar suasana belajar semakin interaktif dan bermakna?',
      ],
      refleksiSiswa: [
        'Bagian pembelajaran mana yang paling menarik dan mudah dipahami bagimu hari ini?',
        'Apa kendala terbesar yang kamu rasakan saat mengerjakan tugas bersama kelompok?',
        'Bagaimana kamu akan menerapkan apa yang kamu pelajari hari ini dalam kehidupan sehari-hari?',
      ],
    },
    lampiran: {
      lkpd: {
        judul: `LEMBAR KERJA PESERTA DIDIK (LKPD) - ${mataPelajaran.toUpperCase()}`,
        petunjuk: 'Bacalah setiap instruksi dengan teliti, diskusikan bersama rekan kelompokmu, dan tuliskan hasil penemuan pada tempat yang disediakan.',
        aktivitasKelompok: [
          {
            bagian: 'Bagian 1: Identifikasi Masalah & Eksplorasi Informasi',
            instruksi: 'Cermati fenomena yang disajikan guru, lalu diskusikan informasi penting apa saja yang kalian temukan.',
            tugas: 'Tuliskan 3 fakta utama atau pertanyaan kunci yang muncul dari permasalahan tersebut!',
          },
          {
            bagian: 'Bagian 2: Analisis & Pemecahan Masalah Kolaboratif',
            instruksi: 'Gunakan konsep yang telah dipelajari untuk merumuskan langkah-langkah solusi konkret.',
            tugas: 'Rumuskan solusi terbaik kelompokmu beserta alasan logis pendukungnya!',
          },
        ],
        kesimpulanSiswa: 'Berdasarkan diskusi kelompok kami, dapat disimpulkan bahwa...',
      },
      bahanBacaan: {
        ringkasanMateri: `Materi ${mataPelajaran} pada Fase ${fase} ini menekankan pemahaman konseptual yang kontekstual dan dekat dengan pengalaman sehari-hari siswa. Peserta didik diajak untuk tidak hanya menghafal rumus atau teori, melainkan mampu mengamati pola, menganalisis hubungan sebab-akibat, dan menerapkan pengetahuan untuk memecahkan tantangan nyata.`,
        panduanGuru: 'Guru disarankan menciptakan lingkungan kelas yang aman secara psikologis, mendorong siswa tidak takut salah saat berpendapat, serta aktif memberikan apresiasi atas usaha kolaborasi setiap murid.',
      },
      glosarium: [
        { istilah: 'Diferensiasi Pembelajaran', arti: 'Usaha menyesuaikan proses pembelajaran di kelas untuk memenuhi kebutuhan belajar individu peserta didik.' },
        { istilah: 'Asesmen Formatif', arti: 'Asesmen yang dilakukan selama proses pembelajaran berlangsung untuk memberikan umpan balik perbaikan belajar.' },
        { istilah: 'KKTP', arti: 'Kriteria Ketercapaian Tujuan Pembelajaran yang berfungsi memetakan ketercapaian kompetensi siswa.' },
      ],
      daftarPustaka: [
        `Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2024). Buku Panduan Guru dan Siswa ${mataPelajaran} Fase ${fase}. Jakarta: BSKAP.`,
        'Panduan Pembelajaran dan Asesmen Kurikulum Merdeka. Jakarta: Badan Standar, Kurikulum, dan Asesmen Pendidikan Kemendikbudristek.',
      ],
    },
  };
}

export function suggestTPClientSide(params: {
  mataPelajaran?: string;
  jenjang?: string;
  fase?: string;
  topikUtama?: string;
}) {
  const mapel = params.mataPelajaran || 'mata pelajaran';
  const topik = params.topikUtama || 'materi pokok';

  return {
    tujuanPembelajaran: [
      `Peserta didik mampu mengidentifikasi dan mendeskripsikan konsep ${topik} dalam konteks ${mapel} melalui pengamatan terarah secara cermat.`,
      `Peserta didik mampu menghubungkan konsep ${topik} dengan pemecahan persoalan nyata dalam diskusi kelompok dengan nalar kritis.`,
      `Peserta didik mampu menyajikan hasil karya atau laporan telaah terkait ${topik} secara sistematis dan percaya diri.`,
    ],
    pemahamanBermakna: `Memahami konsep ${topik} membantu peserta didik berpikir logis, mengenali keteraturan lingkungan, dan menerapkan solusi aplikatif dalam kehidupan sehari-hari.`,
    pertanyaanPemantik: [
      `Bagaimana konsep ${topik} ini dapat kita temui dalam peristiwa nyata sehari-hari?`,
      `Apa yang terjadi jika kita tidak memahami prinsip dasar dari ${topik} ini?`,
    ],
    profilKesiapanPesertaDidik: {
      perluBimbingan: `Peserta didik yang memerlukan representasi konkret dan bimbingan bertahap dalam memahami ${topik}.`,
      cakap: `Peserta didik yang telah memahami konsep dasar dan mampu bekerja mandiri dengan lembar kerja terstruktur.`,
      mahir: `Peserta didik yang mampu berpikir analitis tingkat tinggi, mengevaluasi studi kasus, dan membimbing rekan lain.`,
    },
  };
}

// Client-side offline Word export fallback (Word HTML XML wrapper with proper styling)
export function exportModulToWordOffline(modul: ModulAjar) {
  const sanitize = (str: string) => (str || 'Modul').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const filename = `Modul_Ajar_${sanitize(modul.identitas.mataPelajaran)}_Fase_${sanitize(modul.identitas.fase)}_Kelas_${sanitize(modul.identitas.kelas)}.doc`;

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${filename}</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      th, td { border: 1px solid #333; padding: 6px 10px; font-size: 11pt; vertical-align: top; }
      th { background-color: #f3f4f6; font-weight: bold; }
      .kop { text-align: center; border-bottom: 2px double #000; padding-bottom: 8px; margin-bottom: 14px; }
      h1 { font-size: 15pt; text-align: center; font-weight: bold; }
      h2 { font-size: 13pt; font-weight: bold; margin-top: 16px; border-bottom: 1px solid #333; }
      h3 { font-size: 12pt; font-weight: bold; }
    </style></head>
    <body>
      <div class="kop">
        <p style="margin: 0; font-size: 10pt; font-weight: bold;">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</p>
        <p style="margin: 2px 0; font-size: 14pt; font-weight: bold;">${(modul.identitas.instansi || 'SATUAN PENDIDIKAN').toUpperCase()}</p>
        <p style="margin: 0; font-size: 10pt; font-style: italic;">MODUL AJAR KURIKULUM MERDEKA TAHUN AJARAN 2026/2027</p>
      </div>

      <h1>MODUL AJAR KURIKULUM MERDEKA</h1>
      <p style="text-align: center; font-style: italic;">Mata Pelajaran: ${modul.identitas.mataPelajaran} | Fase ${modul.identitas.fase} / Kelas ${modul.identitas.kelas}</p>

      <h2>I. INFORMASI UMUM</h2>
      <table>
        <tr><td style="width: 30%; font-weight: bold;">Nama Penyusun</td><td>${modul.identitas.penyusun}</td></tr>
        <tr><td style="font-weight: bold;">Satuan Pendidikan</td><td>${modul.identitas.instansi}</td></tr>
        <tr><td style="font-weight: bold;">Mata Pelajaran</td><td>${modul.identitas.mataPelajaran}</td></tr>
        <tr><td style="font-weight: bold;">Fase / Kelas</td><td>Fase ${modul.identitas.fase} / Kelas ${modul.identitas.kelas}</td></tr>
        <tr><td style="font-weight: bold;">Alokasi Waktu</td><td>${modul.identitas.alokasiWaktu} (${modul.identitas.jumlahPertemuan} Pertemuan)</td></tr>
        <tr><td style="font-weight: bold;">Kompetensi Awal</td><td>${modul.informasiUmum.kompetensiAwal}</td></tr>
        <tr><td style="font-weight: bold;">Profil Pelajar Pancasila</td><td>${modul.informasiUmum.profilPelajarPancasila?.join(', ')}</td></tr>
        <tr><td style="font-weight: bold;">Target & Kesiapan Siswa</td><td>${modul.informasiUmum.targetPesertaDidik} - ${modul.informasiUmum.karakteristikKesiapanSiswa}</td></tr>
        <tr><td style="font-weight: bold;">Model Pembelajaran</td><td>${modul.informasiUmum.modelPembelajaran}</td></tr>
      </table>

      <h2>II. KOMPONEN INTI</h2>
      <h3>A. Capaian Pembelajaran (CP)</h3>
      <p>${modul.komponenInti.capaianPembelajaran}</p>
      <h3>B. Tujuan Pembelajaran (TP)</h3>
      <ol>${modul.komponenInti.tujuanPembelajaran?.map(t => `<li>${t}</li>`).join('')}</ol>
      <h3>C. Pemahaman Bermakna</h3>
      <p>${modul.komponenInti.pemahamanBermakna}</p>
      <h3>D. Pertanyaan Pemantik</h3>
      <ul>${modul.komponenInti.pertanyaanPemantik?.map(q => `<li>${q}</li>`).join('')}</ul>

      <h2>III. PEMBELAJARAN BERDIFERENSIASI (TaRL)</h2>
      <table>
        <tr><th>Aspek</th><th>Perlu Bimbingan</th><th>Cakap</th><th>Mahir</th></tr>
        <tr><td>Konten</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokPerluBimbingan}</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokCakap}</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokMahir}</td></tr>
        <tr><td>Proses</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokPerluBimbingan}</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokCakap}</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokMahir}</td></tr>
        <tr><td>Produk</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokPerluBimbingan}</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokCakap}</td><td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokMahir}</td></tr>
      </table>

      <h2>IV. URUTAN KEGIATAN PEMBELAJARAN</h2>
      ${modul.rencanaPembelajaran?.map(p => `
        <div style="margin: 10px 0; border: 1px solid #ccc; padding: 10px;">
          <h3>Pertemuan ke-${p.pertemuanKe} (${p.alokasiWaktu}) — ${p.tujuanKhususPertemuan}</h3>
          <p><strong>1. Pendahuluan:</strong></p>
          <ul>${p.kegiatanPendahuluan?.map(k => `<li>${k}</li>`).join('')}</ul>
          <p><strong>2. Kegiatan Inti (${modul.informasiUmum.modelPembelajaran}):</strong></p>
          <table>
            <tr><th>Sintaks</th><th>Aktivitas Guru</th><th>Aktivitas Siswa</th></tr>
            ${p.kegiatanInti?.map(s => `<tr><td>${s.faseSintaks}</td><td>${s.aktivitasGuru}</td><td>${s.aktivitasSiswa}</td></tr>`).join('')}
          </table>
          <p><strong>3. Penutup:</strong></p>
          <ul>${p.kegiatanPenutup?.map(k => `<li>${k}</li>`).join('')}</ul>
        </div>
      `).join('')}

      <h2>V. ASESMEN & KKTP</h2>
      <p><strong>Diagnostik:</strong> ${modul.asesmenPembelajaran.asesmenDiagnostik?.teknik}</p>
      <h3>Interval KKTP:</h3>
      <table>
        <tr><th>Kategori</th><th>Deskripsi</th></tr>
        ${modul.asesmenPembelajaran.kktp?.kriteriaKetercapaian?.map(k => `<tr><td>${k.kategori}</td><td>${k.deskripsi}</td></tr>`).join('')}
      </table>

      <h2>VI. LAMPIRAN LKPD</h2>
      <h3>${modul.lampiran.lkpd?.judul}</h3>
      <p><em>Petunjuk: ${modul.lampiran.lkpd?.petunjuk}</em></p>
      ${modul.lampiran.lkpd?.aktivitasKelompok?.map(a => `
        <div style="margin-top: 8px;">
          <p><strong>${a.bagian}</strong></p>
          <p><em>Instruksi:</em> ${a.instruksi}</p>
          <p><em>Tugas:</em> ${a.tugas}</p>
          <div style="border-bottom: 1px dotted #999; height: 30px;"></div>
        </div>
      `).join('')}
      <p><strong>Simpulan Siswa:</strong> ${modul.lampiran.lkpd?.kesimpulanSiswa}</p>

      <table style="border: none; width: 100%; margin-top: 40px;">
        <tr style="border: none;">
          <td style="border: none; text-align: center;">
            Mengetahui,<br>Kepala Satuan Pendidikan<br><br><br><br>
            <strong>.............................................</strong><br>
            NIP. .....................................
          </td>
          <td style="border: none; text-align: center;">
            .................., .............. 2026<br>Guru Mata Pelajaran<br><br><br><br>
            <strong>${modul.identitas.penyusun}</strong><br>
            NIP. .....................................
          </td>
        </tr>
      </table>
    </body></html>
  `;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
