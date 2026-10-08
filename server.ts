import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateDocxBuffer, generatePdfBuffer } from './server/documentGenerator.ts';
import { buildFallbackModulAjar } from './server/fallbackModulGenerator.ts';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory cache for reliable browser iframe downloads
const downloadCache = new Map<string, { modul: any; createdAt: number }>();

// Clean up old download tokens every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of downloadCache.entries()) {
    if (now - data.createdAt > 30 * 60 * 1000) {
      downloadCache.delete(token);
    }
  }
}, 15 * 60 * 1000);

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for Indonesian Kurikulum Merdeka expert
const KURIKULUM_MERDEKA_SYSTEM_INSTRUCTION = `
Anda adalah Pakar Kurikulum Merdeka Kemendikbudristek dan Konsultan Ahli Pengembangan Pembelajaran Berdiferensiasi di Indonesia.
Tugas Anda adalah menyusun Modul Ajar Kurikulum Merdeka yang komprehensif, operasional, berbasis diferensiasi (konten, proses, produk), serta mengacu pada Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), dan profil kesiapan/capaian peserta didik (Teaching at the Right Level - TaRL).

Prinsip Modul Ajar:
1. Esensial: Pemahaman konsep bermakna dan kontekstual.
2. Menarik, Bermakna, dan Menantang: Menumbuhkan minat dan Profil Pelajar Pancasila.
3. Relevan dan Kontekstual: Sesuai pengalaman nyata siswa Indonesia dan lingkungan hidupnya.
4. Berkesinambungan: Keterkaitan antara capaian awal, kegiatan bertahap, dan KKTP.
5. Berdiferensiasi Nyata: Pembagian jelas aktivitas untuk kelompok (Mahir/Tinggi, Cakap/Sedang, dan Perlu Bimbingan/Dasar).
Format yang dihasilkan harus sangat detail, terstruktur, formal, dan siap diterapkan di kelas oleh guru.
`;

// Helper: Resilient AI caller with retry on 503 / 429 and fallback to available models
async function generateWithRetryAndFallback(options: {
  contents: string;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}) {
  const modelsToTry = [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
  ];

  let lastError: any = null;

  for (let m = 0; m < modelsToTry.length; m++) {
    const currentModel = modelsToTry[m];
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini API] Requesting ${currentModel} (Attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction || KURIKULUM_MERDEKA_SYSTEM_INSTRUCTION,
            responseMimeType: options.responseMimeType || 'application/json',
            temperature: options.temperature ?? 0.7,
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(`[Gemini API] ${currentModel} returned: ${msg}`);

        const isDailyQuotaExhausted =
          msg.includes('GenerateRequestsPerDay') ||
          msg.includes('exceeded your current quota') ||
          msg.includes('Please retry in');

        if (isDailyQuotaExhausted) {
          // Immediately try the next model without wasting retries
          break;
        }

        const isTransient =
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('temporarily') ||
          msg.includes('429');

        if (isTransient && attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          break;
        }
      }
    }
  }

  throw lastError;
}

// Endpoint: Generate Full Modul Ajar
app.post('/api/generate-modul', async (req: Request, res: Response) => {
  try {
    const {
      mataPelajaran,
      jenjang,
      fase,
      kelas,
      semester,
      alokasiWaktu,
      jumlahPertemuan,
      capaianPembelajaran,
      tujuanPembelajaran,
      karakteristikSiswa, // Profil / Capaian Awal Peserta Didik
      modelPembelajaran,
      dimensiProfilPancasila,
      saranaPrasarana,
      namaGuru,
      namaSekolah,
    } = req.body;

    if (!mataPelajaran || !tujuanPembelajaran) {
      return res.status(400).json({ error: 'Mata pelajaran dan Tujuan Pembelajaran wajib diisi.' });
    }

    const prompt = `
Susunlah sebuah Modul Ajar Kurikulum Merdeka Lengkap dan Terperinci dengan parameter berikut:
- Mata Pelajaran: ${mataPelajaran}
- Jenjang & Fase: ${jenjang} (Fase ${fase}), Kelas ${kelas}, Semester ${semester || 'Ganjil'}
- Alokasi Waktu: ${alokasiWaktu || '2 x 35/45 Menit'} (${jumlahPertemuan || 2} Pertemuan)
- Nama Guru: ${namaGuru || 'Guru Pengampu'}
- Sekolah: ${namaSekolah || 'Satuan Pendidikan'}
- Capaian Pembelajaran (CP): ${capaianPembelajaran || 'Disesuaikan dengan fase dan mata pelajaran'}
- Tujuan Pembelajaran (TP): ${tujuanPembelajaran}
- Karakteristik / Capaian Awal Peserta Didik: ${karakteristikSiswa || 'Bervariasi: Terdapat siswa yang mahir cepat memahami, kelompok sedang/cakap, dan kelompok yang memerlukan bimbingan khusus/konkret.'}
- Model Pembelajaran: ${modelPembelajaran || 'Problem Based Learning (PBL)'}
- Dimensi Profil Pelajar Pancasila: ${Array.isArray(dimensiProfilPancasila) ? dimensiProfilPancasila.join(', ') : (dimensiProfilPancasila || 'Bernalar Kritis, Bergotong Royong, Mandiri')}
- Sarana dan Prasarana: ${saranaPrasarana || 'Buku pegangan, proyektor/gambar visual, benda konkrit sekitar, LKPD'}

Hasilkan respon JSON dengan struktur yang lengkap dan mendalam:
{
  "identitas": {
    "penyusun": "${namaGuru || 'Guru Pengampu'}",
    "instansi": "${namaSekolah || 'Satuan Pendidikan'}",
    "mataPelajaran": "${mataPelajaran}",
    "fase": "${fase}",
    "kelas": "${kelas}",
    "semester": "${semester || '1 (Ganjil)'}",
    "alokasiWaktu": "${alokasiWaktu || '2 Pertemuan (4 JP)'}",
    "jumlahPertemuan": ${Number(jumlahPertemuan) || 2}
  },
  "informasiUmum": {
    "kompetensiAwal": "Deskripsi pengetahuan/keterampilan awal yang perlu dimiliki siswa sebelum materi ini",
    "profilPelajarPancasila": ["Daftar dimensi terpilih dan uraian penerapannya dalam kegiatan"],
    "saranaPrasarana": ["Daftar alat, media, ruang, sumber belajar konkret & digital"],
    "targetPesertaDidik": "Penjelasan target siswa (reguler, kesulitan belajar, pencapaian tinggi)",
    "karakteristikKesiapanSiswa": "Analisis capaian awal siswa berdasarkan asesmen diagnostik awal",
    "modelPembelajaran": "${modelPembelajaran || 'Problem Based Learning (PBL)'}",
    "metodePembelajaran": ["Diskusi kelompok", "Eksplorasi/Praktik", "Tanya Jawab Bermakna", "Presentasi"]
  },
  "komponenInti": {
    "capaianPembelajaran": "Rumusan CP resmi dan elemen terkait",
    "tujuanPembelajaran": ["Daftar TP yang spesifik, terukur, dan berorientasi HOTS/A-B-C-D"],
    "pemahamanBermakna": "Intisari pelajaran berharga yang akan terus berguna dalam kehidupan nyata siswa",
    "pertanyaanPemantik": ["3-5 pertanyaan esensial pemantik rasa ingin tahu dan nalar kritis siswa"]
  },
  "rencanaPembelajaran": [
    {
      "pertemuanKe": 1,
      "alokasiWaktu": "2 x 40 menit (atau sesuai jenjang)",
      "tujuanKhususPertemuan": "Fokus capaian pada pertemuan ini",
      "kegiatanPendahuluan": [
        "Langkah 1: Pengkondisian kelas, salam, doa bersama, dan presensi",
        "Langkah 2: Apersepsi dan pengaitan dengan capaian/pengetahuan awal siswa",
        "Langkah 3: Pemberian pertanyaan pemantik dan motivasi kontekstual",
        "Langkah 4: Penyampaian tujuan pembelajaran dan alur aktivitas"
      ],
      "kegiatanInti": [
        {
          "faseSintaks": "Fase 1: Orientasi Siswa pada Masalah",
          "aktivitasGuru": "Uraian tindakan fasilitator guru",
          "aktivitasSiswa": "Uraian tindakan siswa aktif"
        },
        {
          "faseSintaks": "Fase 2: Mengorganisasi Siswa untuk Belajar",
          "aktivitasGuru": "...",
          "aktivitasSiswa": "..."
        },
        {
          "faseSintaks": "Fase 3: Membimbing Penyelidikan Mandiri/Kelompok (Diferensiasi Proses)",
          "aktivitasGuru": "...",
          "aktivitasSiswa": "..."
        },
        {
          "faseSintaks": "Fase 4: Mengembangkan dan Menyajikan Hasil Karya (Diferensiasi Produk)",
          "aktivitasGuru": "...",
          "aktivitasSiswa": "..."
        },
        {
          "faseSintaks": "Fase 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah",
          "aktivitasGuru": "...",
          "aktivitasSiswa": "..."
        }
      ],
      "kegiatanPenutup": [
        "Refleksi pembelajaran bersama seluruh siswa",
        "Penyimpulan konsep esensial yang dipelajari",
        "Umpan balik formatif dan apresiasi kelompok",
        "Penyampaian rencana materi pertemuan berikutnya dan doa penutup"
      ]
    }
  ],
  "pembelajaranBerdiferensiasi": {
    "diferensiasiKonten": {
      "kelompokPerluBimbingan": "Bahan ajar disederhanakan dengan gambar/alat peraga nyata/panduan visual",
      "kelompokCakap": "Bahan ajar standar berupa teks panduan, infografis, dan studi kasus",
      "kelompokMahir": "Bahan ajar lanjutan berupa artikel/data terbuka untuk eksplorasi mandiri"
    },
    "diferensiasiProses": {
      "kelompokPerluBimbingan": "Guru mendampingi secara intensif (scaffolding terarah) langkah demi langkah",
      "kelompokCakap": "Siswa berdiskusi kelompok dengan lembar kerja terstruktur dan bimbingan berkala",
      "kelompokMahir": "Siswa bekerja secara mandiri dan memimpin investigasi mandiri/menjadi tutor sebaya"
    },
    "diferensiasiProduk": {
      "kelompokPerluBimbingan": "Bentuk laporan sederhana (menjodohkan, mengisi bagan terpandu, atau penjelasan lisan)",
      "kelompokCakap": "Laporan berbentuk diagram alur, mindmap, atau presentasi ringkas",
      "kelompokMahir": "Laporan komparatif, infografis digital, poster solusi kreatif, atau video simulasi"
    }
  },
  "asesmenPembelajaran": {
    "asesmenDiagnostik": {
      "teknik": "Tanya jawab lisan / kuis singkat sebelum pembelajaran",
      "soalAtauInstrumen": ["Contoh pertanyaan diagnostik untuk memetakan kesiapan peserta didik"]
    },
    "asesmenFormatif": {
      "teknik": "Observasi diskusi, performa pengerjaan LKPD, cek pemahaman berkala",
      "rubrikObservasi": [
        {"aspek": "Partisipasi Kelompok", "kriteria": "Aktif bertanya, berpendapat, dan bekerja sama"},
        {"aspek": "Bernalar Kritis", "kriteria": "Mampu mengaitkan data dengan solusi nyata"}
      ]
    },
    "asesmenSumatif": {
      "teknik": "Tes tertulis / Penilaian Unjuk Kerja Proyek Akhir",
      "instrumenSoal": [
        {
          "nomor": 1,
          "soal": "Soal pemahaman bermakna berorientasi HOTS",
          "kunciAtauKriteria": "Kunci jawaban / panduan penilaian",
          "skor": 25
        }
      ]
    },
    "kktp": {
      "kriteriaKetercapaian": [
        {
          "kategori": "Perlu Bimbingan (0-60%)",
          "deskripsi": "Belum mampu mengidentifikasi konsep dasar tanpa bimbingan intensif"
        },
        {
          "kategori": "Cukup (61-74%)",
          "deskripsi": "Mampu menjelaskan konsep dasar namun masih ada beberapa kekeliruan"
        },
        {
          "kategori": "Baik (75-88%)",
          "deskripsi": "Mampu menerapkan konsep dan menganalisis masalah dengan tepat"
        },
        {
          "kategori": "Sangat Baik (89-100%)",
          "deskripsi": "Mampu mengevaluasi, menciptakan solusi orisinal, serta membantu rekan lain"
        }
      ]
    }
  },
  "pengayaanDanRemedial": {
    "programRemedial": "Rencana tindakan bimbingan ulang bagi siswa yang belum mencapai KKTP",
    "programPengayaan": "Tantangan atau proyek eksploratif bagi siswa yang telah melampaui KKTP"
  },
  "refleksi": {
    "refleksiGuru": ["3 pertanyaan refleksi diri guru terkait keberhasilan strategi dan manajemen kelas"],
    "refleksiSiswa": ["3 pertanyaan refleksi pengalaman dan perasaan siswa setelah belajar"]
  },
  "lampiran": {
    "lkpd": {
      "judul": "Lembar Kerja Peserta Didik (LKPD)",
      "petunjuk": "Petunjuk pengerjaan terperinci untuk peserta didik",
      "aktivitasKelompok": [
        {
          "bagian": "Bagian 1: Eksplorasi Masalah Nyata",
          "instruksi": "Instruksi pengerjaan",
          "tugas": "Daftar tugas/pertanyaan yang harus dijawab di lembar kerja"
        },
        {
          "bagian": "Bagian 2: Analisis dan Penemuan Solusi",
          "instruksi": "Instruksi pengerjaan berjenjang",
          "tugas": "Tugas penyelidikan kelompok"
        }
      ],
      "kesimpulanSiswa": "Tempat siswa merumuskan simpulan"
    },
    "bahanBacaan": {
      "ringkasanMateri": "Materi ajar ringkas, padat, mudah dipahami siswa, dilengkapi analogi kehidupan nyata",
      "panduanGuru": "Tips pedagogis penting bagi guru saat membimbing siswa dengan aneka capaian"
    },
    "glosarium": [
      {"istilah": "Istilah 1", "arti": "Definisi jelas dalam bahasa sederhana"}
    ],
    "daftarPustaka": [
      "Buku Guru dan Buku Siswa Kemendikbudristek terkait",
      "Referensi sumber ilmiah/kredibel terkini"
    ]
  }
}

Pastikan format output strictly JSON valid tanpa backticks markdown atau penjelasan tambahan di luar JSON.
`;

    const response = await generateWithRetryAndFallback({
      contents: prompt,
      systemInstruction: KURIKULUM_MERDEKA_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      temperature: 0.7,
    });

    const rawText = response.text || '{}';
    let modulData;
    try {
      modulData = JSON.parse(rawText);
    } catch (parseErr) {
      // Fallback if wrapped in markdown code fence
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      modulData = JSON.parse(cleaned);
    }

    return res.json({ success: true, data: modulData });
  } catch (err: any) {
    console.warn('AI generation encountered error, invoking pedagogical engine fallback:', err?.message || err);
    try {
      const fallbackModul = buildFallbackModulAjar(req.body);
      return res.json({
        success: true,
        data: fallbackModul,
        isFallback: true,
      });
    } catch (fallbackErr: any) {
      console.error('Fallback synthesis failed:', fallbackErr);
      return res.status(500).json({
        error: 'Gagal menyusun modul ajar: ' + (fallbackErr.message || String(fallbackErr)),
      });
    }
  }
});

// Endpoint: Suggest Learning Objectives (TP) & Diagnostik based on CP & Phase
app.post('/api/suggest-tp', async (req: Request, res: Response) => {
  const { mataPelajaran, jenjang, fase, capaianPembelajaran, topikUtama } = req.body;

  try {
    const prompt = `
Sebagai pakar penyusun kurikulum sekolah di Indonesia, berikan saran Tujuan Pembelajaran (TP) berkualitas tinggi dan rumusan Asesmen Awal/Diagnostik berdasarkan:
- Mata Pelajaran: ${mataPelajaran || 'Umum'}
- Jenjang / Fase: ${jenjang || 'SD/SMP/SMA'} (Fase ${fase || 'B'})
- Topik / Materi Pokok: ${topikUtama || 'Materi Inti'}
- Capaian Pembelajaran (CP) yang dirujuk: ${capaianPembelajaran || 'Umum untuk fase ini'}

Hasilkan format JSON berikut:
{
  "tujuanPembelajaran": [
    "TP 1: (Formula Audience, Behavior, Condition, Degree - HOTS)",
    "TP 2: ...",
    "TP 3: ..."
  ],
  "pemahamanBermakna": "Intisari esensial dari topik ini dalam kehidupan nyata siswa",
  "pertanyaanPemantik": [
    "Pertanyaan 1 yang memancing rasa ingin tahu",
    "Pertanyaan 2 yang menstimulasi nalar kritis"
  ],
  "profilKesiapanPesertaDidik": {
    "perluBimbingan": "Karakteristik siswa yang belum menguasai prasyarat",
    "cakap": "Karakteristik siswa yang sudah menguasai konsep dasar",
    "mahir": "Karakteristik siswa yang mampu berpikir tingkat tinggi dan mandiri"
  }
}
`;

    const response = await generateWithRetryAndFallback({
      contents: prompt,
      systemInstruction: KURIKULUM_MERDEKA_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      temperature: 0.6,
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.warn('AI TP suggestion failed, generating pedagogical recommendations:', err?.message || err);
    const topik = topikUtama || 'materi pembelajaran';
    const mapel = mataPelajaran || 'pelajaran';

    return res.json({
      success: true,
      data: {
        tujuanPembelajaran: [
          `Peserta didik mampu mengidentifikasi dan menganalisis konsep ${topik} pada mata pelajaran ${mapel} melalui penyelidikan terstruktur secara tepat.`,
          `Peserta didik mampu menghubungkan konsep ${topik} dengan pemecahan persoalan kontekstual sehari-hari dalam diskusi kelompok secara kritis.`,
          `Peserta didik mampu menyajikan hasil karya atau laporan telaah mengenai ${topik} dengan penuh tanggung jawab dan percaya diri.`,
        ],
        pemahamanBermakna: `Memahami konsep ${topik} membekali peserta didik nalar logis dan kepekaan dalam memecahkan tantangan nyata di lingkungan sekitar.`,
        pertanyaanPemantik: [
          `Mengapa kita perlu mempelajari konsep ${topik} ini dan bagaimana hal ini bermanfaat bagi keseharian kita?`,
          `Tantangan apa yang paling sering muncul terkait topik ini dan bagaimana solusi kreatif yang bisa kita tawarkan?`,
        ],
        profilKesiapanPesertaDidik: {
          perluBimbingan: `Peserta didik yang membutuhkan media konkret, kosakata kunci, dan pendampingan intensif untuk memahami ${topik}.`,
          cakap: `Peserta didik yang telah menguasai pemahaman dasar dan mampu menyelesaikan tugas terstruktur secara mandiri.`,
          mahir: `Peserta didik yang mampu berpikir tingkat tinggi (HOTS), menganalisis studi kasus kompleks, dan menjadi tutor sebaya.`,
        },
      },
    });
  }
});

// Endpoint: Refine specific section (e.g., Enrich LKPD, Add HOTS questions, Simplify wording)
app.post('/api/refine-section', async (req: Request, res: Response) => {
  try {
    const { sectionType, originalContent, instruction, mataPelajaran, fase } = req.body;

    const prompt = `
Anda diminta menyempurnakan bagian berikut dari Modul Ajar Kurikulum Merdeka (Mata Pelajaran: ${mataPelajaran || ''}, Fase: ${fase || ''}):
Bagian: ${sectionType}
Instruksi Guru: ${instruction}
Konten Asli:
${JSON.stringify(originalContent, null, 2)}

Sempurnakan konten tersebut sesuai instruksi, tetap profesional, mendalam, aplikatif, dan sesuai kaidah Kurikulum Merdeka.
Keluarkan respon dalam format JSON:
{
  "refinedContent": ... (struktur data yang sepadan dengan konten asli yang diperbarui)
}
`;

    const response = await generateWithRetryAndFallback({
      contents: prompt,
      systemInstruction: KURIKULUM_MERDEKA_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed.refinedContent || parsed });
  } catch (err: any) {
    console.error('Error refining section:', err);
    return res.status(500).json({ error: 'Gagal memperbarui bagian: ' + err.message });
  }
});

// Endpoint: Prepare download and return persistent download links
app.post('/api/prepare-download', (req: Request, res: Response) => {
  try {
    const { modul } = req.body;
    if (!modul) {
      return res.status(400).json({ error: 'Data modul diperlukan.' });
    }
    const token = crypto.randomBytes(16).toString('hex');
    downloadCache.set(token, { modul, createdAt: Date.now() });

    const sanitize = (str: string) => (str || 'Modul').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const baseName = `Modul_Ajar_${sanitize(modul.identitas?.mataPelajaran)}_Fase_${sanitize(modul.identitas?.fase)}_Kelas_${sanitize(modul.identitas?.kelas)}`;

    return res.json({
      success: true,
      token,
      docxUrl: `/api/download/docx/${token}`,
      pdfUrl: `/api/download/pdf/${token}`,
      filenameDocx: `${baseName}.docx`,
      filenamePdf: `${baseName}.pdf`,
    });
  } catch (err: any) {
    console.error('Error preparing download:', err);
    return res.status(500).json({ error: 'Gagal menyiapkan unduhan: ' + err.message });
  }
});

// Endpoint: Download DOCX or PDF via direct GET (compatible with all sandboxed iframes)
app.get('/api/download/:type/:token', async (req: Request, res: Response) => {
  try {
    const { type, token } = req.params;
    const entry = downloadCache.get(token);
    if (!entry) {
      return res.status(404).send('Tautan unduhan telah kedaluwarsa atau tidak ditemukan. Silakan klik unduh kembali dari aplikasi.');
    }

    const { modul } = entry;
    const sanitize = (str: string) => (str || 'Modul').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const baseName = `Modul_Ajar_${sanitize(modul.identitas?.mataPelajaran)}_Fase_${sanitize(modul.identitas?.fase)}_Kelas_${sanitize(modul.identitas?.kelas)}`;

    if (type === 'docx') {
      const buffer = await generateDocxBuffer(modul);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${baseName}.docx"`);
      return res.send(buffer);
    } else if (type === 'pdf') {
      const buffer = await generatePdfBuffer(modul);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${baseName}.pdf"`);
      return res.send(buffer);
    } else {
      return res.status(400).send('Format unduhan tidak valid. Gunakan docx atau pdf.');
    }
  } catch (err: any) {
    console.error(`Error processing download ${req.params.type}:`, err);
    return res.status(500).send('Gagal mengunduh berkas: ' + err.message);
  }
});

// Endpoint: Direct POST export for DOCX
app.post('/api/export-docx', async (req: Request, res: Response) => {
  try {
    const { modul } = req.body;
    if (!modul) {
      return res.status(400).json({ error: 'Data modul diperlukan.' });
    }
    const sanitize = (str: string) => (str || 'Modul').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `Modul_Ajar_${sanitize(modul.identitas?.mataPelajaran)}_Fase_${sanitize(modul.identitas?.fase)}_Kelas_${sanitize(modul.identitas?.kelas)}.docx`;

    const buffer = await generateDocxBuffer(modul);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err: any) {
    console.error('Error generating docx:', err);
    return res.status(500).json({ error: 'Gagal membuat file docx: ' + err.message });
  }
});

// Endpoint: Direct POST export for PDF
app.post('/api/export-pdf', async (req: Request, res: Response) => {
  try {
    const { modul } = req.body;
    if (!modul) {
      return res.status(400).json({ error: 'Data modul diperlukan.' });
    }
    const sanitize = (str: string) => (str || 'Modul').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `Modul_Ajar_${sanitize(modul.identitas?.mataPelajaran)}_Fase_${sanitize(modul.identitas?.fase)}_Kelas_${sanitize(modul.identitas?.kelas)}.pdf`;

    const buffer = await generatePdfBuffer(modul);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err: any) {
    console.error('Error generating pdf:', err);
    return res.status(500).json({ error: 'Gagal membuat file pdf: ' + err.message });
  }
});

// API Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Modul Ajar Kurikulum Merdeka AI Service is running.',
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middlewares for development or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const portNumber = Number(process.env.PORT) || 3000;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${portNumber}`);
  });
}

startServer();
