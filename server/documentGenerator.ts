import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
} from 'docx';
import PDFDocument from 'pdfkit';
import { ModulAjar } from '../src/types/modulAjar.ts';

const tableBorderConfig = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
};

const cellPadding = { top: 100, bottom: 100, left: 140, right: 140 };

// 1. Generate Real DOCX Buffer
export async function generateDocxBuffer(modul: ModulAjar): Promise<Buffer> {
  const children: any[] = [];

  // Kop Document
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', font: 'Times New Roman', size: 20, bold: true }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: (modul.identitas.instansi || 'SATUAN PENDIDIKAN').toUpperCase(), font: 'Times New Roman', size: 24, bold: true }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'MODUL AJAR KURIKULUM MERDEKA TAHUN AJARAN 2026/2027', font: 'Times New Roman', size: 18, italics: true }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'MODUL AJAR KURIKULUM MERDEKA', font: 'Times New Roman', size: 26, bold: true, underline: {} }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${modul.identitas.mataPelajaran} | Fase ${modul.identitas.fase} / Kelas ${modul.identitas.kelas}`,
          font: 'Times New Roman',
          size: 20,
          italics: true,
        }),
      ],
      spacing: { after: 250 },
    })
  );

  // Section I: Informasi Umum
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: 'I. INFORMASI UMUM', font: 'Times New Roman', size: 22, bold: true })],
      spacing: { before: 150, after: 80 },
    })
  );

  const infoRows = [
    ['Nama Penyusun', modul.identitas.penyusun || '-'],
    ['Satuan Pendidikan', modul.identitas.instansi || '-'],
    ['Mata Pelajaran', modul.identitas.mataPelajaran || '-'],
    ['Fase / Kelas / Semester', `Fase ${modul.identitas.fase} / Kelas ${modul.identitas.kelas} / Semester ${modul.identitas.semester}`],
    ['Alokasi Waktu', `${modul.identitas.alokasiWaktu} (${modul.identitas.jumlahPertemuan} Pertemuan)`],
    ['Kompetensi Awal', modul.informasiUmum.kompetensiAwal || '-'],
    ['Profil Pelajar Pancasila', modul.informasiUmum.profilPelajarPancasila?.join(', ') || '-'],
    ['Sarana dan Prasarana', modul.informasiUmum.saranaPrasarana?.join(', ') || '-'],
    ['Target Peserta Didik', modul.informasiUmum.targetPesertaDidik || '-'],
    ['Karakteristik & Kesiapan Siswa', modul.informasiUmum.karakteristikKesiapanSiswa || '-'],
    ['Model Pembelajaran', modul.informasiUmum.modelPembelajaran || '-'],
    ['Metode Pembelajaran', modul.informasiUmum.metodePembelajaran?.join(', ') || '-'],
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorderConfig,
      rows: infoRows.map(([label, val]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: String(val), font: 'Times New Roman', size: 19 })] })],
            }),
          ],
        })
      ),
    })
  );

  // Section II: Komponen Inti
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: 'II. KOMPONEN INTI', font: 'Times New Roman', size: 22, bold: true })],
      spacing: { before: 250, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'A. Capaian Pembelajaran (CP)', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 80, after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: modul.komponenInti.capaianPembelajaran, font: 'Times New Roman', size: 19 })],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'B. Tujuan Pembelajaran (TP)', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 80, after: 40 },
    })
  );

  modul.komponenInti.tujuanPembelajaran?.forEach((tp, idx) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `${idx + 1}. ${tp}`, font: 'Times New Roman', size: 19 })],
        spacing: { after: 40 },
      })
    );
  });

  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'C. Pemahaman Bermakna', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 120, after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: modul.komponenInti.pemahamanBermakna, font: 'Times New Roman', size: 19 })],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'D. Pertanyaan Pemantik', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 120, after: 40 },
    })
  );

  modul.komponenInti.pertanyaanPemantik?.forEach(q => {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: q, font: 'Times New Roman', size: 19 })],
        spacing: { after: 40 },
      })
    );
  });

  // Tabel Pembelajaran Berdiferensiasi
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'E. Rencana Pembelajaran Berdiferensiasi (TaRL)', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 180, after: 80 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorderConfig,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'E5E7EB', type: ShadingType.CLEAR },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Aspek Diferensiasi', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'FEE2E2', type: ShadingType.CLEAR },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Perlu Bimbingan (Dasar)', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'DBEAFE', type: ShadingType.CLEAR },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Cakap (Sedang)', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'D1FAE5', type: ShadingType.CLEAR },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Mahir (Tinggi)', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Diferensiasi Konten', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokPerluBimbingan || '-', font: 'Times New Roman', size: 19 })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokCakap || '-', font: 'Times New Roman', size: 19 })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokMahir || '-', font: 'Times New Roman', size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Diferensiasi Proses', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokPerluBimbingan || '-', font: 'Times New Roman', size: 19 })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokCakap || '-', font: 'Times New Roman', size: 19 })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokMahir || '-', font: 'Times New Roman', size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Diferensiasi Produk', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokPerluBimbingan || '-', font: 'Times New Roman', size: 19 })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokCakap || '-', font: 'Times New Roman', size: 19 })] })],
            }),
            new TableCell({
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokMahir || '-', font: 'Times New Roman', size: 19 })] })],
            }),
          ],
        }),
      ],
    })
  );

  // Urutan Kegiatan Pembelajaran
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'F. Urutan Kegiatan Pembelajaran', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 180, after: 80 },
    })
  );

  modul.rencanaPembelajaran?.forEach(pertemuan => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Pertemuan ke-${pertemuan.pertemuanKe} (${pertemuan.alokasiWaktu}) — ${pertemuan.tujuanKhususPertemuan}`,
            font: 'Times New Roman',
            size: 20,
            bold: true,
          }),
        ],
        spacing: { before: 120, after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '1. Kegiatan Pendahuluan:', font: 'Times New Roman', size: 19, bold: true })],
      })
    );

    pertemuan.kegiatanPendahuluan?.forEach(item => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: item, font: 'Times New Roman', size: 19 })],
        })
      );
    });

    children.push(
      new Paragraph({
        children: [new TextRun({ text: `2. Kegiatan Inti (${modul.informasiUmum.modelPembelajaran}):`, font: 'Times New Roman', size: 19, bold: true })],
        spacing: { before: 80, after: 40 },
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorderConfig,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 25, type: WidthType.PERCENTAGE },
                shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
                margins: cellPadding,
                children: [new Paragraph({ children: [new TextRun({ text: 'Sintaks / Tahap', font: 'Times New Roman', size: 19, bold: true })] })],
              }),
              new TableCell({
                width: { size: 38, type: WidthType.PERCENTAGE },
                shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
                margins: cellPadding,
                children: [new Paragraph({ children: [new TextRun({ text: 'Aktivitas Guru', font: 'Times New Roman', size: 19, bold: true })] })],
              }),
              new TableCell({
                width: { size: 37, type: WidthType.PERCENTAGE },
                shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
                margins: cellPadding,
                children: [new Paragraph({ children: [new TextRun({ text: 'Aktivitas Siswa', font: 'Times New Roman', size: 19, bold: true })] })],
              }),
            ],
          }),
          ...(pertemuan.kegiatanInti || []).map(
            s =>
              new TableRow({
                children: [
                  new TableCell({
                    margins: cellPadding,
                    children: [new Paragraph({ children: [new TextRun({ text: s.faseSintaks, font: 'Times New Roman', size: 19, bold: true })] })],
                  }),
                  new TableCell({
                    margins: cellPadding,
                    children: [new Paragraph({ children: [new TextRun({ text: s.aktivitasGuru, font: 'Times New Roman', size: 19 })] })],
                  }),
                  new TableCell({
                    margins: cellPadding,
                    children: [new Paragraph({ children: [new TextRun({ text: s.aktivitasSiswa, font: 'Times New Roman', size: 19 })] })],
                  }),
                ],
              })
          ),
        ],
      }),
      new Paragraph({
        children: [new TextRun({ text: '3. Kegiatan Penutup:', font: 'Times New Roman', size: 19, bold: true })],
        spacing: { before: 80, after: 40 },
      })
    );

    pertemuan.kegiatanPenutup?.forEach(item => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: item, font: 'Times New Roman', size: 19 })],
        })
      );
    });
  });

  // Asesmen & KKTP
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'G. Asesmen dan Kriteria Ketercapaian (KKTP)', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 200, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `1. Asesmen Diagnostik: ${modul.asesmenPembelajaran.asesmenDiagnostik?.teknik || '-'}`, font: 'Times New Roman', size: 19, bold: true })],
    })
  );

  modul.asesmenPembelajaran.asesmenDiagnostik?.soalAtauInstrumen?.forEach(s => {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: s, font: 'Times New Roman', size: 19 })],
      })
    );
  });

  children.push(
    new Paragraph({
      children: [new TextRun({ text: '2. Interval Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):', font: 'Times New Roman', size: 19, bold: true })],
      spacing: { before: 120, after: 40 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorderConfig,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Kategori Capaian', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
              margins: cellPadding,
              children: [new Paragraph({ children: [new TextRun({ text: 'Deskripsi Kriteria Ketercapaian', font: 'Times New Roman', size: 19, bold: true })] })],
            }),
          ],
        }),
        ...(modul.asesmenPembelajaran.kktp?.kriteriaKetercapaian || []).map(
          k =>
            new TableRow({
              children: [
                new TableCell({
                  margins: cellPadding,
                  children: [new Paragraph({ children: [new TextRun({ text: k.kategori, font: 'Times New Roman', size: 19, bold: true })] })],
                }),
                new TableCell({
                  margins: cellPadding,
                  children: [new Paragraph({ children: [new TextRun({ text: k.deskripsi, font: 'Times New Roman', size: 19 })] })],
                }),
              ],
            })
        ),
      ],
    })
  );

  // Lampiran LKPD
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: 'III. LAMPIRAN', font: 'Times New Roman', size: 22, bold: true })],
      spacing: { before: 250, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: modul.lampiran.lkpd?.judul || 'LEMBAR KERJA PESERTA DIDIK (LKPD)', font: 'Times New Roman', size: 20, bold: true })],
      spacing: { before: 80, after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Petunjuk Kerja: ${modul.lampiran.lkpd?.petunjuk || '-'}`, font: 'Times New Roman', size: 19, italics: true })],
      spacing: { after: 80 },
    })
  );

  modul.lampiran.lkpd?.aktivitasKelompok?.forEach(akt => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: akt.bagian, font: 'Times New Roman', size: 19, bold: true })],
        spacing: { before: 60, after: 20 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `Instruksi: ${akt.instruksi}`, font: 'Times New Roman', size: 19, italics: true })],
      }),
      new Paragraph({
        children: [new TextRun({ text: `Tugas: ${akt.tugas}`, font: 'Times New Roman', size: 19 })],
        spacing: { after: 80 },
      })
    );
  });

  // Tanda Tangan
  children.push(
    new Paragraph({ spacing: { before: 250 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mengetahui,', font: 'Times New Roman', size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kepala Satuan Pendidikan', font: 'Times New Roman', size: 19, bold: true })] }),
                new Paragraph({ spacing: { after: 600 } }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '....................................................', font: 'Times New Roman', size: 19, bold: true })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NIP. .................................................', font: 'Times New Roman', size: 17 })] }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '.........................., .................... 2026', font: 'Times New Roman', size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Guru Mata Pelajaran', font: 'Times New Roman', size: 19, bold: true })] }),
                new Paragraph({ spacing: { after: 600 } }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: modul.identitas.penyusun || 'Guru Pengampu', font: 'Times New Roman', size: 19, bold: true, underline: {} })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NIP. .................................................', font: 'Times New Roman', size: 17 })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1200, right: 1000 },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// 2. Generate Real PDF Buffer using PDFKit
export async function generatePdfBuffer(modul: ModulAjar): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 36, bottom: 36, left: 40, right: 40 },
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', err => reject(err));

      // Header / Kop
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', { align: 'center' });
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text((modul.identitas.instansi || 'SATUAN PENDIDIKAN').toUpperCase(), { align: 'center' });
      doc
        .fontSize(9)
        .font('Helvetica-Oblique')
        .text('MODUL AJAR KURIKULUM MERDEKA TAHUN AJARAN 2026/2027', { align: 'center' });

      doc.moveDown(0.5);
      doc.strokeColor('#222222').lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.8);

      // Title
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#065f46')
        .text('MODUL AJAR KURIKULUM MERDEKA', { align: 'center' });
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#333333')
        .text(
          `${modul.identitas.mataPelajaran} — Fase ${modul.identitas.fase} / Kelas ${modul.identitas.kelas} (Semester ${modul.identitas.semester})`,
          { align: 'center' }
        );

      doc.moveDown(1);

      // Helper section heading
      const printSectionTitle = (title: string) => {
        doc.moveDown(0.5);
        doc.fillColor('#047857').fontSize(11).font('Helvetica-Bold').text(title);
        doc.fillColor('#111827').fontSize(9).font('Helvetica');
        doc.moveDown(0.3);
      };

      // I. INFORMASI UMUM
      printSectionTitle('I. INFORMASI UMUM');
      const addField = (lbl: string, val: string) => {
        doc.font('Helvetica-Bold').text(`${lbl}: `, { continued: true }).font('Helvetica').text(val);
      };

      addField('Nama Penyusun', modul.identitas.penyusun || '-');
      addField('Satuan Pendidikan', modul.identitas.instansi || '-');
      addField('Mata Pelajaran', modul.identitas.mataPelajaran || '-');
      addField('Alokasi Waktu', `${modul.identitas.alokasiWaktu} (${modul.identitas.jumlahPertemuan} Pertemuan)`);
      addField('Kompetensi Awal', modul.informasiUmum.kompetensiAwal || '-');
      addField('Profil Pelajar Pancasila', modul.informasiUmum.profilPelajarPancasila?.join(', ') || '-');
      addField('Sarana & Prasarana', modul.informasiUmum.saranaPrasarana?.join(', ') || '-');
      addField('Target Peserta Didik', modul.informasiUmum.targetPesertaDidik || '-');
      addField('Model Pembelajaran', modul.informasiUmum.modelPembelajaran || '-');

      // II. KOMPONEN INTI
      printSectionTitle('II. KOMPONEN INTI');
      addField('Capaian Pembelajaran (CP)', modul.komponenInti.capaianPembelajaran || '-');
      doc.moveDown(0.3);

      doc.font('Helvetica-Bold').text('Tujuan Pembelajaran (TP):');
      modul.komponenInti.tujuanPembelajaran?.forEach((tp, i) => {
        doc.font('Helvetica').text(`  ${i + 1}. ${tp}`);
      });
      doc.moveDown(0.3);

      addField('Pemahaman Bermakna', modul.komponenInti.pemahamanBermakna || '-');
      doc.moveDown(0.3);

      doc.font('Helvetica-Bold').text('Pertanyaan Pemantik:');
      modul.komponenInti.pertanyaanPemantik?.forEach(q => {
        doc.font('Helvetica').text(`  • ${q}`);
      });
      doc.moveDown(0.3);

      // Pembelajaran Berdiferensiasi
      printSectionTitle('III. RENCANA PEMBELAJARAN BERDIFERENSIASI (TaRL)');
      doc.font('Helvetica-Bold').text('1. Diferensiasi Konten:');
      doc.font('Helvetica').text(`   • Perlu Bimbingan: ${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokPerluBimbingan || '-'}`);
      doc.font('Helvetica').text(`   • Cakap: ${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokCakap || '-'}`);
      doc.font('Helvetica').text(`   • Mahir: ${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokMahir || '-'}`);

      doc.font('Helvetica-Bold').text('2. Diferensiasi Proses:');
      doc.font('Helvetica').text(`   • Perlu Bimbingan: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokPerluBimbingan || '-'}`);
      doc.font('Helvetica').text(`   • Cakap: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokCakap || '-'}`);
      doc.font('Helvetica').text(`   • Mahir: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokMahir || '-'}`);

      doc.font('Helvetica-Bold').text('3. Diferensiasi Produk:');
      doc.font('Helvetica').text(`   • Perlu Bimbingan: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokPerluBimbingan || '-'}`);
      doc.font('Helvetica').text(`   • Cakap: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokCakap || '-'}`);
      doc.font('Helvetica').text(`   • Mahir: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokMahir || '-'}`);

      // IV. URUTAN KEGIATAN PEMBELAJARAN
      printSectionTitle('IV. URUTAN KEGIATAN PEMBELAJARAN');
      modul.rencanaPembelajaran?.forEach(p => {
        doc.font('Helvetica-Bold').text(`Pertemuan ke-${p.pertemuanKe} (${p.alokasiWaktu}) — ${p.tujuanKhususPertemuan}`);
        doc.font('Helvetica-Bold').text('  Pendahuluan:');
        p.kegiatanPendahuluan?.forEach(k => doc.font('Helvetica').text(`    - ${k}`));

        doc.font('Helvetica-Bold').text(`  Kegiatan Inti (Sintaks ${modul.informasiUmum.modelPembelajaran}):`);
        p.kegiatanInti?.forEach(s => {
          doc.font('Helvetica-Bold').text(`    [${s.faseSintaks}]`);
          doc.font('Helvetica').text(`      Guru: ${s.aktivitasGuru}`);
          doc.font('Helvetica').text(`      Siswa: ${s.aktivitasSiswa}`);
        });

        doc.font('Helvetica-Bold').text('  Penutup:');
        p.kegiatanPenutup?.forEach(k => doc.font('Helvetica').text(`    - ${k}`));
        doc.moveDown(0.5);
      });

      // V. ASESMEN & KKTP
      printSectionTitle('V. ASESMEN & KRITERIA KETERCAPAIAN (KKTP)');
      addField('Asesmen Diagnostik', modul.asesmenPembelajaran.asesmenDiagnostik?.teknik || '-');
      doc.font('Helvetica-Bold').text('Interval Nilai KKTP:');
      modul.asesmenPembelajaran.kktp?.kriteriaKetercapaian?.forEach(k => {
        doc.font('Helvetica').text(`  • ${k.kategori}: ${k.deskripsi}`);
      });

      // VI. LAMPIRAN LKPD
      printSectionTitle('VI. LEMBAR KERJA PESERTA DIDIK (LKPD)');
      doc.font('Helvetica-Bold').text(modul.lampiran.lkpd?.judul || 'LKPD');
      doc.font('Helvetica-Oblique').text(`Petunjuk: ${modul.lampiran.lkpd?.petunjuk || '-'}`);
      modul.lampiran.lkpd?.aktivitasKelompok?.forEach(a => {
        doc.font('Helvetica-Bold').text(`  ${a.bagian}`);
        doc.font('Helvetica-Oblique').text(`    Instruksi: ${a.instruksi}`);
        doc.font('Helvetica').text(`    Tugas: ${a.tugas}`);
      });
      doc.font('Helvetica-Bold').text('Simpulan Siswa:');
      doc.font('Helvetica').text(`  ${modul.lampiran.lkpd?.kesimpulanSiswa || '-'}`);

      // Tanda Tangan
      doc.moveDown(1);
      const y = doc.y;
      doc.font('Helvetica').text('Mengetahui,\nKepala Satuan Pendidikan\n\n\n\n__________________________\nNIP. ....................................', 60, y, { width: 200, align: 'center' });
      doc.font('Helvetica').text(`..................., .................. 2026\nGuru Mata Pelajaran\n\n\n\n${modul.identitas.penyusun || 'Guru Pengampu'}\nNIP. ....................................`, 340, y, { width: 200, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
