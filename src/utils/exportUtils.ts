import { ModulAjar } from '../types/modulAjar.ts';

export interface PreparedDownload {
  docxUrl: string;
  pdfUrl: string;
  filenameDocx: string;
  filenamePdf: string;
  token: string;
}

// Prepare download URLs from server
export async function prepareDownloadUrls(modul: ModulAjar): Promise<PreparedDownload> {
  const res = await fetch('/api/prepare-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modul }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Gagal menyiapkan berkas unduhan.');
  }

  return {
    docxUrl: data.docxUrl,
    pdfUrl: data.pdfUrl,
    filenameDocx: data.filenameDocx,
    filenamePdf: data.filenamePdf,
    token: data.token,
  };
}

// Download file via Blob with fallback
export async function triggerFileDownload(url: string, filename: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Server returned ' + res.status);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    return true;
  } catch (err) {
    console.warn('Direct blob click failed, falling back to direct navigation:', err);
    // Fallback: navigate or open link directly
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return false;
  }
}

// Client-side offline Word document export (.doc)
export function exportModulOfflineDoc(modul: ModulAjar): void {
  const mapel = (modul.identitas.mataPelajaran || 'Mata_Pelajaran').replace(/[^a-zA-Z0-9]/g, '_');
  const kelas = (modul.identitas.kelas || '').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Modul_Ajar_${mapel}_Kelas_${kelas}_Offline.doc`;

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Modul Ajar Kurikulum Merdeka</title>
      <style>
        body { font-family: 'Calibri', 'Times New Roman', sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; margin: 20mm; }
        h1 { font-size: 16pt; color: #047857; text-align: center; margin-bottom: 4px; text-transform: uppercase; font-weight: bold; }
        h2 { font-size: 13pt; color: #065f46; border-bottom: 2px solid #10b981; padding-bottom: 4px; margin-top: 20px; font-weight: bold; }
        h3 { font-size: 11pt; color: #0f172a; margin-top: 14px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10pt; }
        th, td { border: 1px solid #94a3b8; padding: 6px 10px; text-align: left; vertical-align: top; }
        th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
        .badge { display: inline-block; padding: 2px 8px; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 9pt; border-radius: 4px; }
        ul, ol { margin-top: 4px; margin-bottom: 8px; padding-left: 20px; }
        li { margin-bottom: 4px; }
        .text-center { text-align: center; }
        .lead { text-align: center; color: #64748b; font-size: 10pt; margin-bottom: 24px; }
      </style>
    </head>
    <body>
      <h1>MODUL AJAR KURIKULUM MERDEKA</h1>
      <p class="lead">${modul.identitas.instansi || 'Satuan Pendidikan'} • Tahun Ajaran 2026/2027</p>

      <h2>I. INFORMASI UMUM</h2>
      <table>
        <tr><th width="30%">Mata Pelajaran</th><td><strong>${modul.identitas.mataPelajaran}</strong></td></tr>
        <tr><th>Jenjang / Fase / Kelas</th><td>Fase ${modul.identitas.fase} / Kelas ${modul.identitas.kelas}</td></tr>
        <tr><th>Semester / Alokasi Waktu</th><td>${modul.identitas.semester} / ${modul.identitas.alokasiWaktu} (${modul.identitas.jumlahPertemuan} Pertemuan)</td></tr>
        <tr><th>Penyusun</th><td>${modul.identitas.penyusun} (${modul.identitas.instansi})</td></tr>
        <tr><th>Model & Metode Pembelajaran</th><td><strong>${modul.informasiUmum.modelPembelajaran}</strong><br/>${modul.informasiUmum.metodePembelajaran?.join(', ')}</td></tr>
        <tr><th>Profil Pelajar Pancasila</th><td>${modul.informasiUmum.profilPelajarPancasila?.join(', ')}</td></tr>
        <tr><th>Sarana & Prasarana</th><td>${modul.informasiUmum.saranaPrasarana?.join(', ')}</td></tr>
        <tr><th>Target & Kesiapan Peserta Didik</th><td>${modul.informasiUmum.karakteristikKesiapanSiswa}</td></tr>
      </table>

      <h2>II. KOMPONEN INTI</h2>
      <h3>A. Capaian Pembelajaran (CP)</h3>
      <p>${modul.komponenInti.capaianPembelajaran}</p>

      <h3>B. Tujuan Pembelajaran (TP)</h3>
      <ol>
        ${modul.komponenInti.tujuanPembelajaran?.map(tp => `<li>${tp}</li>`).join('')}
      </ol>

      <h3>C. Pemahaman Bermakna</h3>
      <p>${modul.komponenInti.pemahamanBermakna}</p>

      <h3>D. Pertanyaan Pemantik</h3>
      <ul>
        ${modul.komponenInti.pertanyaanPemantik?.map(q => `<li>${q}</li>`).join('')}
      </ul>

      <h3>E. Pembelajaran Berdiferensiasi (TaRL)</h3>
      <table>
        <tr>
          <th>Aspek</th>
          <th>Kelompok Perlu Bimbingan</th>
          <th>Kelompok Cakap</th>
          <th>Kelompok Mahir</th>
        </tr>
        <tr>
          <td><strong>Diferensiasi Konten</strong></td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokPerluBimbingan || '-'}</td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokCakap || '-'}</td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokMahir || '-'}</td>
        </tr>
        <tr>
          <td><strong>Diferensiasi Proses</strong></td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokPerluBimbingan || '-'}</td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokCakap || '-'}</td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokMahir || '-'}</td>
        </tr>
        <tr>
          <td><strong>Diferensiasi Produk</strong></td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokPerluBimbingan || '-'}</td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokCakap || '-'}</td>
          <td>${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokMahir || '-'}</td>
        </tr>
      </table>

      <h2>III. URUTAN KEGIATAN PEMBELAJARAN</h2>
      ${modul.rencanaPembelajaran?.map(p => `
        <h3>Pertemuan ke-${p.pertemuanKe} (${p.alokasiWaktu})</h3>
        <p><strong>Fokus Capaian:</strong> ${p.tujuanKhususPertemuan}</p>
        
        <h4>1. Pendahuluan</h4>
        <ul>${p.kegiatanPendahuluan?.map(k => `<li>${k}</li>`).join('')}</ul>

        <h4>2. Kegiatan Inti</h4>
        <table>
          <tr><th width="30%">Fase Sintaks</th><th width="35%">Aktivitas Guru</th><th width="35%">Aktivitas Peserta Didik</th></tr>
          ${p.kegiatanInti?.map(s => `<tr><td><strong>${s.faseSintaks}</strong></td><td>${s.aktivitasGuru}</td><td>${s.aktivitasSiswa}</td></tr>`).join('')}
        </table>

        <h4>3. Penutup</h4>
        <ul>${p.kegiatanPenutup?.map(k => `<li>${k}</li>`).join('')}</ul>
      `).join('')}

      <h2>IV. ASESMEN & KRITERIA KETERCAPAIAN (KKTP)</h2>
      <p><strong>Asesmen Diagnostik:</strong> ${modul.asesmenPembelajaran.asesmenDiagnostik?.teknik}</p>
      <p><strong>Asesmen Formatif:</strong> ${modul.asesmenPembelajaran.asesmenFormatif?.teknik}</p>
      
      <h3>Rubrik Asesmen Formatif:</h3>
      <table>
        <tr><th>Aspek Pengamatan</th><th>Kriteria Ketercapaian</th></tr>
        ${modul.asesmenPembelajaran.asesmenFormatif?.rubrikObservasi?.map(r => `<tr><td>${r.aspek}</td><td>${r.kriteria}</td></tr>`).join('')}
      </table>

      <h3>Kriteria KKTP:</h3>
      <table>
        <tr><th>Kategori</th><th>Deskripsi Ketercapaian</th></tr>
        ${modul.asesmenPembelajaran.kktp?.kriteriaKetercapaian?.map(k => `<tr><td><strong>${k.kategori}</strong></td><td>${k.deskripsi}</td></tr>`).join('')}
      </table>

      <h2>V. LAMPIRAN LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
      <h3>${modul.lampiran.lkpd?.judul || 'LEMBAR KERJA PESERTA DIDIK'}</h3>
      <p><strong>Petunjuk:</strong> ${modul.lampiran.lkpd?.petunjuk}</p>
      ${modul.lampiran.lkpd?.aktivitasKelompok?.map((akt, i) => `
        <div style="margin: 10px 0; padding: 10px; border: 1px solid #cbd5e1; background-color: #f8fafc;">
          <h4>${akt.bagian}</h4>
          <p><em>${akt.instruksi}</em></p>
          <p><strong>Tugas:</strong> ${akt.tugas}</p>
        </div>
      `).join('')}

      <h3>Ringkasan Bahan Bacaan</h3>
      <p>${modul.lampiran.bahanBacaan?.ringkasanMateri}</p>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// Export Modul as DOCX with automatic offline fallback
export async function exportModulToDocx(modul: ModulAjar): Promise<PreparedDownload> {
  try {
    const prepared = await prepareDownloadUrls(modul);
    await triggerFileDownload(prepared.docxUrl, prepared.filenameDocx);
    return prepared;
  } catch (err) {
    console.warn('Online Word preparation failed, falling back to client-side offline Word doc:', err);
    exportModulOfflineDoc(modul);
    return {
      docxUrl: '#',
      pdfUrl: '#',
      filenameDocx: `Modul_Ajar_${modul.identitas.mataPelajaran}_Offline.doc`,
      filenamePdf: `Modul_Ajar_${modul.identitas.mataPelajaran}_Offline.pdf`,
      token: 'offline',
    };
  }
}

// Export Modul as PDF with automatic offline print fallback
export async function exportModulToPdf(modul: ModulAjar): Promise<PreparedDownload> {
  try {
    const prepared = await prepareDownloadUrls(modul);
    await triggerFileDownload(prepared.pdfUrl, prepared.filenamePdf);
    return prepared;
  } catch (err) {
    console.warn('Online PDF preparation failed, falling back to browser print PDF:', err);
    safePrintModul();
    return {
      docxUrl: '#',
      pdfUrl: '#',
      filenameDocx: `Modul_Ajar_${modul.identitas.mataPelajaran}_Offline.doc`,
      filenamePdf: `Modul_Ajar_${modul.identitas.mataPelajaran}_Offline.pdf`,
      token: 'offline',
    };
  }
}

// Safe print
export function safePrintModul(): boolean {
  try {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('window.print() not permitted in this iframe:', err);
    return false;
  }
}

// Copy plain formatted text to clipboard
export function copyModulTextToClipboard(modul: ModulAjar): Promise<void> {
  const text = `
MODUL AJAR KURIKULUM MERDEKA
Mata Pelajaran: ${modul.identitas.mataPelajaran}
Fase: ${modul.identitas.fase} | Kelas: ${modul.identitas.kelas} | Semester: ${modul.identitas.semester}
Penyusun: ${modul.identitas.penyusun} - ${modul.identitas.instansi}
Alokasi Waktu: ${modul.identitas.alokasiWaktu}

=== I. INFORMASI UMUM ===
1. Kompetensi Awal: ${modul.informasiUmum.kompetensiAwal}
2. Profil Pelajar Pancasila: ${modul.informasiUmum.profilPelajarPancasila?.join(', ')}
3. Sarana & Prasarana: ${modul.informasiUmum.saranaPrasarana?.join(', ')}
4. Karakteristik & Kesiapan Siswa: ${modul.informasiUmum.karakteristikKesiapanSiswa}
5. Model Pembelajaran: ${modul.informasiUmum.modelPembelajaran}

=== II. KOMPONEN INTI ===
A. Capaian Pembelajaran (CP):
${modul.komponenInti.capaianPembelajaran}

B. Tujuan Pembelajaran (TP):
${modul.komponenInti.tujuanPembelajaran?.map((tp, i) => `${i + 1}. ${tp}`).join('\n')}

C. Pemahaman Bermakna:
${modul.komponenInti.pemahamanBermakna}

D. Pertanyaan Pemantik:
${modul.komponenInti.pertanyaanPemantik?.map((q, i) => `${i + 1}. ${q}`).join('\n')}

E. Pembelajaran Berdiferensiasi (TaRL):
- Konten:
  * Perlu Bimbingan: ${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokPerluBimbingan}
  * Cakap: ${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokCakap}
  * Mahir: ${modul.pembelajaranBerdiferensiasi?.diferensiasiKonten?.kelompokMahir}
- Proses:
  * Perlu Bimbingan: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokPerluBimbingan}
  * Cakap: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokCakap}
  * Mahir: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProses?.kelompokMahir}
- Produk:
  * Perlu Bimbingan: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokPerluBimbingan}
  * Cakap: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokCakap}
  * Mahir: ${modul.pembelajaranBerdiferensiasi?.diferensiasiProduk?.kelompokMahir}

=== III. URUTAN KEGIATAN PEMBELAJARAN ===
${modul.rencanaPembelajaran
  ?.map(
    p => `
[Pertemuan ke-${p.pertemuanKe}] (${p.alokasiWaktu}) - ${p.tujuanKhususPertemuan}
Pendahuluan:
${p.kegiatanPendahuluan?.map(k => ` - ${k}`).join('\n')}

Kegiatan Inti:
${p.kegiatanInti?.map(s => ` - [${s.faseSintaks}]\n   Guru: ${s.aktivitasGuru}\n   Siswa: ${s.aktivitasSiswa}`).join('\n')}

Penutup:
${p.kegiatanPenutup?.map(k => ` - ${k}`).join('\n')}
`
  )
  .join('\n')}

=== IV. ASESMEN & KKTP ===
- Diagnostik: ${modul.asesmenPembelajaran.asesmenDiagnostik?.teknik}
- Formatif: ${modul.asesmenPembelajaran.asesmenFormatif?.rubrikObservasi?.map(r => `${r.aspek} (${r.kriteria})`).join('; ')}
- Kriteria KKTP:
${modul.asesmenPembelajaran.kktp?.kriteriaKetercapaian?.map(k => ` * ${k.kategori}: ${k.deskripsi}`).join('\n')}

=== V. LAMPIRAN LKPD ===
Judul: ${modul.lampiran.lkpd?.judul}
Petunjuk: ${modul.lampiran.lkpd?.petunjuk}
Aktivitas:
${modul.lampiran.lkpd?.aktivitasKelompok?.map(a => ` - ${a.bagian}\n   ${a.instruksi}\n   Tugas: ${a.tugas}`).join('\n')}
`.trim();

  return navigator.clipboard.writeText(text);
}

// Backward compatible alias
export const exportModulToWord = exportModulToDocx;
