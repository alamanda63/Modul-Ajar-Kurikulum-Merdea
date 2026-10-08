import React, { useState } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Edit3,
  Sparkles,
  FileText,
  Compass,
  Layers,
  Users,
  Target,
  BookOpen,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Clock,
  ArrowRight,
  ListOrdered,
  FileCheck,
  Wand2,
  FileDown,
} from 'lucide-react';
import { ModulAjar } from '../types/modulAjar.ts';
import {
  exportModulToDocx,
  exportModulToPdf,
  safePrintModul,
  copyModulTextToClipboard,
} from '../utils/exportUtils.ts';

interface ModulViewerProps {
  modul: ModulAjar;
  onBackToForm: () => void;
  onSaveModul: (modul: ModulAjar) => void;
  isSaved: boolean;
  onUpdateModul: (updated: ModulAjar) => void;
}

export const ModulViewer: React.FC<ModulViewerProps> = ({
  modul,
  onBackToForm,
  onSaveModul,
  isSaved,
  onUpdateModul,
}) => {
  const [activeTab, setActiveTab] = useState<'dokumen' | 'identitas' | 'kegiatan' | 'diferensiasi' | 'lkpd' | 'asesmen' | 'materi'>('dokumen');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState<string | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportStatusMsg, setExportStatusMsg] = useState<string | null>(null);
  const [directDownload, setDirectDownload] = useState<{ url: string; filename: string; label: string } | null>(null);

  // Local state for editable modul
  const [editableModul, setEditableModul] = useState<ModulAjar>(modul);

  const handleCopy = async () => {
    await copyModulTextToClipboard(editableModul);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    setExportStatusMsg('Menyusun dokumen Microsoft Word (.docx)...');
    try {
      const prepared = await exportModulToDocx(editableModul);
      setDirectDownload({
        url: prepared.docxUrl,
        filename: prepared.filenameDocx,
        label: 'Unduh Berkas Word (.docx)',
      });
      setExportStatusMsg('Dokumen Word (.docx) siap diunduh!');
    } catch (err: any) {
      console.error('Docx export failed:', err);
      setExportStatusMsg('Gagal mengunduh docx: ' + (err.message || err));
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setExportStatusMsg('Menyusun berkas PDF resmi dari server...');
    try {
      const prepared = await exportModulToPdf(editableModul);
      setDirectDownload({
        url: prepared.pdfUrl,
        filename: prepared.filenamePdf,
        label: 'Unduh Berkas PDF (.pdf)',
      });
      setExportStatusMsg('Berkas PDF berhasil dibuat dan siap diunduh!');
    } catch (err: any) {
      console.error('PDF export failed:', err);
      setExportStatusMsg('Gagal membuat PDF: ' + (err.message || err));
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = async () => {
    if (activeTab !== 'dokumen') {
      setActiveTab('dokumen');
      await new Promise(r => setTimeout(r, 200));
    }

    const ok = safePrintModul();
    if (!ok) {
      setExportStatusMsg('Fungsi cetak langsung dibatasi di pratinjau iFrame. Otomatis menyiapkan unduhan PDF...');
      await handleDownloadPdf();
    }
  };

  // Quick AI Refine function
  const handleAiRefine = async (actionType: 'bahasa' | 'hots' | 'lkpd' | 'inklusif') => {
    setIsRefining(true);
    setRefineFeedback(null);

    const prompts = {
      bahasa: 'Sederhanakan bahasa teks pemahaman bermakna dan LKPD agar lebih ramah anak, mudah dipahami siswa, dan tetap bermakna.',
      hots: 'Perkaya pertanyaan pemantik dan instrumen asesmen dengan soal berbasis nalar kritis HOTS (analisis, evaluasi, kreasi).',
      lkpd: 'Perdalam dan perkaya lembar kerja peserta didik (LKPD) dengan instruksi langkah investigasi penemuan konsep yang lebih seru dan kontekstual.',
      inklusif: 'Perkuat strategi diferensiasi dan scaffolding untuk mengakomodasi murid dengan kebutuhan khusus atau yang memerlukan bimbingan konkret.',
    };

    try {
      const res = await fetch('/api/refine-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: actionType,
          originalContent: editableModul,
          instruction: prompts[actionType],
          mataPelajaran: editableModul.identitas.mataPelajaran,
          fase: editableModul.identitas.fase,
        }),
      });

      const data = await res.json();
      if (data && typeof data === 'object') {
        const merged: ModulAjar = {
          ...editableModul,
          ...(data.komponenInti ? { komponenInti: { ...editableModul.komponenInti, ...data.komponenInti } } : {}),
          ...(data.pembelajaranBerdiferensiasi ? { pembelajaranBerdiferensiasi: data.pembelajaranBerdiferensiasi } : {}),
          ...(data.lampiran ? { lampiran: { ...editableModul.lampiran, ...data.lampiran } } : {}),
          ...(data.asesmenPembelajaran ? { asesmenPembelajaran: { ...editableModul.asesmenPembelajaran, ...data.asesmenPembelajaran } } : {}),
        };
        setEditableModul(merged);
        onUpdateModul(merged);
        setRefineFeedback(`Berhasil diperbarui dengan AI (${actionType})!`);
      }
    } catch (err: any) {
      setRefineFeedback('Gagal memperbarui: ' + err.message);
    } finally {
      setIsRefining(false);
      setTimeout(() => setRefineFeedback(null), 3500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Form</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isEditing
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Selesai Mengedit' : 'Edit Teks Langsung'}</span>
          </button>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onSaveModul(editableModul)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Tersimpan' : 'Simpan Modul'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          {/* Unduh Word .docx */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50"
            title="Unduh berkas asli .docx yang bisa diedit di Microsoft Word & Google Docs"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingDocx ? 'Menyiapkan...' : 'Unduh Word (.docx)'}</span>
          </button>

          {/* Unduh PDF .pdf */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
            title="Unduh langsung sebagai berkas PDF resmi"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExportingPdf ? 'Menyusun PDF...' : 'Unduh PDF (.pdf)'}</span>
          </button>

          {/* Cetak */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
            title="Cetak langsung atau simpan via dialog cetak browser"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Export Status Notification Banner */}
      {(exportStatusMsg || directDownload) && (
        <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="font-bold">{exportStatusMsg || 'Berkas Anda siap diunduh!'}</div>
              <div className="text-xs text-blue-700 mt-0.5">
                {directDownload ? 'Jika unduhan otomatis peramban terhambat, klik tombol di sebelah kanan:' : 'Sedang menyiapkan berkas resmi dari server...'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {directDownload && (
              <a
                href={directDownload.url}
                download={directDownload.filename}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{directDownload.label}</span>
              </a>
            )}
            <button
              onClick={() => {
                setExportStatusMsg(null);
                setDirectDownload(null);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* AI Refinement Toolbar */}
      <div className="bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-slate-50 rounded-2xl border border-emerald-100 p-3.5 mb-6 no-print flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
          <Wand2 className="w-4 h-4 text-emerald-600" />
          <span>Sempurnakan dengan AI Cepat:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAiRefine('bahasa')}
            disabled={isRefining}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all disabled:opacity-50"
          >
            ✨ Sederhanakan Bahasa
          </button>
          <button
            onClick={() => handleAiRefine('hots')}
            disabled={isRefining}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all disabled:opacity-50"
          >
            🎯 Perkuat Soal HOTS
          </button>
          <button
            onClick={() => handleAiRefine('lkpd')}
            disabled={isRefining}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all disabled:opacity-50"
          >
            📝 Perluas Aktivitas LKPD
          </button>
          <button
            onClick={() => handleAiRefine('inklusif')}
            disabled={isRefining}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all disabled:opacity-50"
          >
            ⚖️ Perkuat Diferensiasi TaRL
          </button>
        </div>
      </div>

      {refineFeedback && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center no-print">
          {refineFeedback}
        </div>
      )}

      {/* Tabs Header */}
      <div className="border-b border-slate-200 mb-6 flex overflow-x-auto no-print space-x-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('dokumen')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'dokumen'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📄 Dokumen Resmi Lengkap</span>
        </button>

        <button
          onClick={() => setActiveTab('identitas')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'identitas'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Informasi Umum & TP</span>
        </button>

        <button
          onClick={() => setActiveTab('kegiatan')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'kegiatan'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Langkah Pembelajaran ({editableModul.rencanaPembelajaran?.length || 1} Pertemuan)</span>
        </button>

        <button
          onClick={() => setActiveTab('diferensiasi')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'diferensiasi'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>⚖️ Diferensiasi Siswa</span>
        </button>

        <button
          onClick={() => setActiveTab('lkpd')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'lkpd'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>📝 Lembar LKPD</span>
        </button>

        <button
          onClick={() => setActiveTab('asesmen')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'asesmen'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Asesmen & KKTP</span>
        </button>

        <button
          onClick={() => setActiveTab('materi')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'materi'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi & Glosarium</span>
        </button>
      </div>

      {/* Main Document Content Container */}
      <div id="modul-dokumen-cetak" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 font-sans print-container">
        {/* TAB 1: DOKUMEN RESMI UTUH (Ideal for Printing and Official Viewing) */}
        {activeTab === 'dokumen' && (
          <div className="space-y-8">
            {/* Kop Surat Resmi */}
            <div className="text-center pb-4 border-b-2 border-slate-900 border-double">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
              </h3>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                {editableModul.identitas.instansi}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                MODUL AJAR KURIKULUM MERDEKA TAHUN AJARAN 2026/2027
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center py-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                MODUL AJAR KURIKULUM MERDEKA
              </h1>
              <p className="text-sm font-semibold text-emerald-700 mt-1">
                {editableModul.identitas.mataPelajaran} — FASE {editableModul.identitas.fase} / KELAS {editableModul.identitas.kelas}
              </p>
            </div>

            {/* 1. INFORMASI UMUM */}
            <section>
              <div className="flex items-center gap-2 border-b-2 border-emerald-600 pb-1 mb-4">
                <span className="font-black text-emerald-800 text-base">I. INFORMASI UMUM</span>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs sm:text-sm">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="w-1/3 p-2.5 font-bold bg-slate-50 text-slate-700">Nama Penyusun</td>
                      <td className="p-2.5 text-slate-900">{editableModul.identitas.penyusun}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Satuan Pendidikan</td>
                      <td className="p-2.5 text-slate-900">{editableModul.identitas.instansi}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Mata Pelajaran</td>
                      <td className="p-2.5 text-slate-900">{editableModul.identitas.mataPelajaran}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Fase / Kelas / Semester</td>
                      <td className="p-2.5 text-slate-900">
                        Fase {editableModul.identitas.fase} / Kelas {editableModul.identitas.kelas} / Semester {editableModul.identitas.semester}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Alokasi Waktu</td>
                      <td className="p-2.5 text-slate-900">
                        {editableModul.identitas.alokasiWaktu} ({editableModul.identitas.jumlahPertemuan} Pertemuan)
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Kompetensi Awal</td>
                      <td className="p-2.5 text-slate-900">{editableModul.informasiUmum.kompetensiAwal}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Profil Pelajar Pancasila</td>
                      <td className="p-2.5 text-slate-900">{editableModul.informasiUmum.profilPelajarPancasila.join(', ')}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Sarana & Prasarana</td>
                      <td className="p-2.5 text-slate-900">{editableModul.informasiUmum.saranaPrasarana.join(', ')}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Target & Kesiapan Peserta Didik</td>
                      <td className="p-2.5 text-slate-900">
                        <div className="font-semibold">{editableModul.informasiUmum.targetPesertaDidik}</div>
                        <div className="text-slate-600 mt-1">{editableModul.informasiUmum.karakteristikKesiapanSiswa}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Model & Metode Pembelajaran</td>
                      <td className="p-2.5 text-slate-900">
                        <span className="font-semibold">{editableModul.informasiUmum.modelPembelajaran}</span>
                        <div className="text-slate-600 text-xs mt-0.5">
                          Metode: {editableModul.informasiUmum.metodePembelajaran.join(', ')}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* II. KOMPONEN INTI */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-emerald-600 pb-1 mb-4">
                <span className="font-black text-emerald-800 text-base">II. KOMPONEN INTI</span>
              </div>

              {/* Capaian Pembelajaran */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">A. Capaian Pembelajaran (CP)</h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {editableModul.komponenInti.capaianPembelajaran}
                </p>
              </div>

              {/* Tujuan Pembelajaran */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">B. Tujuan Pembelajaran (TP)</h4>
                <ul className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-800">
                  {editableModul.komponenInti.tujuanPembelajaran.map((tp, idx) => (
                    <li key={idx} className="leading-relaxed font-medium">
                      {tp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pemahaman Bermakna & Pertanyaan Pemantik */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
                  <h4 className="font-bold text-emerald-900 text-xs uppercase mb-1">C. Pemahaman Bermakna</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {editableModul.komponenInti.pemahamanBermakna}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40">
                  <h4 className="font-bold text-amber-900 text-xs uppercase mb-1">D. Pertanyaan Pemantik</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm text-slate-700">
                    {editableModul.komponenInti.pertanyaanPemantik.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tabel Diferensiasi Pembelajaran */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">
                  E. Rencana Pembelajaran Berdiferensiasi (TaRL)
                </h4>
                <div className="overflow-x-auto border border-slate-300 rounded-lg">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                        <th className="p-2.5 text-left font-bold w-1/4">Aspek Diferensiasi</th>
                        <th className="p-2.5 text-left font-bold w-1/4 text-rose-800 bg-rose-50/40">
                          Perlu Bimbingan (Dasar)
                        </th>
                        <th className="p-2.5 text-left font-bold w-1/4 text-blue-800 bg-blue-50/40">
                          Cakap (Sedang)
                        </th>
                        <th className="p-2.5 text-left font-bold w-1/4 text-emerald-800 bg-emerald-50/40">
                          Mahir (Tinggi)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50">Diferensiasi Konten</td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiKonten.kelompokPerluBimbingan}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiKonten.kelompokCakap}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiKonten.kelompokMahir}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50">Diferensiasi Proses</td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiProses.kelompokPerluBimbingan}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiProses.kelompokCakap}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiProses.kelompokMahir}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50">Diferensiasi Produk</td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiProduk.kelompokPerluBimbingan}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiProduk.kelompokCakap}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {editableModul.pembelajaranBerdiferensiasi.diferensiasiProduk.kelompokMahir}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rencana Pertemuan Lengkap */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-3">
                  F. Urutan Kegiatan Pembelajaran
                </h4>

                <div className="space-y-6">
                  {editableModul.rencanaPembelajaran.map(pertemuan => (
                    <div
                      key={pertemuan.pertemuanKe}
                      className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs"
                    >
                      <div className="bg-slate-100 p-3 border-b border-slate-300 flex flex-wrap items-center justify-between gap-2">
                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                          Pertemuan ke-{pertemuan.pertemuanKe} ({pertemuan.alokasiWaktu})
                        </div>
                        <div className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Fokus: {pertemuan.tujuanKhususPertemuan}
                        </div>
                      </div>

                      <div className="p-4 space-y-4 text-xs sm:text-sm">
                        {/* Pendahuluan */}
                        <div>
                          <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span>1. Kegiatan Pendahuluan (15% Alokasi Waktu)</span>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            {pertemuan.kegiatanPendahuluan.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Kegiatan Inti */}
                        <div>
                          <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>2. Kegiatan Inti — Sintaks Model {editableModul.informasiUmum.modelPembelajaran} (70% Alokasi Waktu)</span>
                          </div>
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                                  <th className="p-2 text-left font-bold w-1/4">Tahapan / Sintaks</th>
                                  <th className="p-2 text-left font-bold w-3/8">Aktivitas Guru (Fasilitator)</th>
                                  <th className="p-2 text-left font-bold w-3/8">Aktivitas Peserta Didik</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {pertemuan.kegiatanInti.map((sintaks, sIdx) => (
                                  <tr key={sIdx}>
                                    <td className="p-2 font-bold text-slate-900 bg-slate-50/50 align-top">
                                      {sintaks.faseSintaks}
                                    </td>
                                    <td className="p-2 text-slate-700 align-top">{sintaks.aktivitasGuru}</td>
                                    <td className="p-2 text-slate-700 align-top">{sintaks.aktivitasSiswa}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Penutup */}
                        <div>
                          <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-600" />
                            <span>3. Kegiatan Penutup (15% Alokasi Waktu)</span>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            {pertemuan.kegiatanPenutup.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asesmen & KKTP */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-3">
                  G. Asesmen Pembelajaran & Kriteria Ketercapaian (KKTP)
                </h4>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Diagnostik */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">
                      1. Asesmen Diagnostik (Awal Pembelajaran):
                    </div>
                    <div className="text-slate-600 mb-1">
                      Teknik: {editableModul.asesmenPembelajaran.asesmenDiagnostik.teknik}
                    </div>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                      {editableModul.asesmenPembelajaran.asesmenDiagnostik.soalAtauInstrumen.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Formatif */}
                  <div>
                    <div className="font-bold text-slate-900 mb-1.5">
                      2. Asesmen Formatif (Rubrik Observasi Proses):
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                            <th className="p-2 text-left w-1/3">Aspek yang Dinilai</th>
                            <th className="p-2 text-left">Indikator Ketercapaian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {editableModul.asesmenPembelajaran.asesmenFormatif.rubrikObservasi.map((rubrik, idx) => (
                            <tr key={idx}>
                              <td className="p-2 font-semibold text-slate-800">{rubrik.aspek}</td>
                              <td className="p-2 text-slate-700">{rubrik.kriteria}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sumatif */}
                  <div>
                    <div className="font-bold text-slate-900 mb-1.5">
                      3. Asesmen Sumatif (Kisi-kisi & Butir Instrumen):
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                            <th className="p-2 text-center w-12">No</th>
                            <th className="p-2 text-left">Soal / Tugas HOTS</th>
                            <th className="p-2 text-left w-1/3">Kunci Jawaban / Kriteria</th>
                            <th className="p-2 text-center w-16">Skor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {editableModul.asesmenPembelajaran.asesmenSumatif.instrumenSoal.map(soal => (
                            <tr key={soal.nomor}>
                              <td className="p-2 text-center font-bold text-slate-800">{soal.nomor}</td>
                              <td className="p-2 text-slate-800">{soal.soal}</td>
                              <td className="p-2 text-slate-600">{soal.kunciAtauKriteria}</td>
                              <td className="p-2 text-center font-bold text-emerald-700">{soal.skor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* KKTP Interval */}
                  <div>
                    <div className="font-bold text-slate-900 mb-1.5">
                      4. Interval Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {editableModul.asesmenPembelajaran.kktp.kriteriaKetercapaian.map((kktp, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                          <div className="font-bold text-slate-900 text-xs mb-1 text-emerald-800">
                            {kktp.kategori}
                          </div>
                          <div className="text-[11px] text-slate-600 leading-snug">{kktp.deskripsi}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pengayaan & Remedial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30">
                  <h4 className="font-bold text-rose-900 text-xs uppercase mb-1">H. Program Remedial</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {editableModul.pengayaanDanRemedial.programRemedial}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <h4 className="font-bold text-emerald-900 text-xs uppercase mb-1">I. Program Pengayaan</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {editableModul.pengayaanDanRemedial.programPengayaan}
                  </p>
                </div>
              </div>
            </section>

            {/* III. LAMPIRAN */}
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 border-b-2 border-emerald-600 pb-1 mb-4">
                <span className="font-black text-emerald-800 text-base">III. LAMPIRAN MODUL</span>
              </div>

              {/* LKPD Box */}
              <div className="border-2 border-slate-800 rounded-xl p-5 bg-white space-y-4">
                <div className="text-center border-b border-slate-300 pb-3">
                  <h3 className="font-black text-sm sm:text-base text-slate-900 uppercase">
                    {editableModul.lampiran.lkpd.judul}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mata Pelajaran: {editableModul.identitas.mataPelajaran} | Kelas {editableModul.identitas.kelas}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-semibold text-slate-700">Nama Kelompok:</span> ............................................
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Anggota:</span> ....................................................
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 mb-1">Petunjuk Kerja:</div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {editableModul.lampiran.lkpd.petunjuk}
                  </p>
                </div>

                <div className="space-y-3">
                  {editableModul.lampiran.lkpd.aktivitasKelompok.map((akt, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200">
                      <div className="font-bold text-xs text-slate-900 mb-0.5">{akt.bagian}</div>
                      <div className="text-xs text-slate-600 mb-1 italic">{akt.instruksi}</div>
                      <div className="text-xs font-semibold text-slate-800">{akt.tugas}</div>
                      <div className="mt-3 border-b border-dashed border-slate-300 h-8" />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 mb-1">Simpulan Hasil Diskusi Siswa:</div>
                  <div className="p-3 rounded-lg border border-dashed border-slate-300 min-h-16 text-xs text-slate-500">
                    {editableModul.lampiran.lkpd.kesimpulanSiswa}
                  </div>
                </div>
              </div>

              {/* Glosarium & Daftar Pustaka */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">Glosarium Istilah</h4>
                  <div className="space-y-1.5 text-xs">
                    {editableModul.lampiran.glosarium.map((item, idx) => (
                      <div key={idx}>
                        <span className="font-bold text-emerald-800">{item.istilah}: </span>
                        <span className="text-slate-700">{item.arti}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">Daftar Pustaka</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                    {editableModul.lampiran.daftarPustaka.map((pustaka, idx) => (
                      <li key={idx}>{pustaka}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Lembar Tanda Tangan Resmi */}
            <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs sm:text-sm text-slate-800 border-t border-slate-200">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala Satuan Pendidikan</p>
                <div className="h-20" />
                <p className="font-bold underline">........................................................</p>
                <p className="text-xs text-slate-500">NIP. ..................................................</p>
              </div>
              <div>
                <p>..........................., ....................... 2026</p>
                <p className="font-semibold">Guru Mata Pelajaran</p>
                <div className="h-20" />
                <p className="font-bold underline">{editableModul.identitas.penyusun}</p>
                <p className="text-xs text-slate-500">NIP. ..................................................</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IDENTITAS & INFORMASI UMUM */}
        {activeTab === 'identitas' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Informasi Umum & Tujuan Pembelajaran</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Identitas Modul</h4>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <p><strong>Penyusun:</strong> {editableModul.identitas.penyusun}</p>
                  <p><strong>Sekolah:</strong> {editableModul.identitas.instansi}</p>
                  <p><strong>Mata Pelajaran:</strong> {editableModul.identitas.mataPelajaran}</p>
                  <p><strong>Fase / Kelas:</strong> Fase {editableModul.identitas.fase} / Kelas {editableModul.identitas.kelas}</p>
                  <p><strong>Alokasi Waktu:</strong> {editableModul.identitas.alokasiWaktu}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <h4 className="font-bold text-xs uppercase text-emerald-800 mb-2">Capaian Pembelajaran (CP)</h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {editableModul.komponenInti.capaianPembelajaran}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Tujuan Pembelajaran (TP)</h4>
              <ul className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-800">
                {editableModul.komponenInti.tujuanPembelajaran.map((tp, idx) => (
                  <li key={idx} className="font-medium">{tp}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Profil Pelajar Pancasila</h4>
                <div className="flex flex-wrap gap-1.5">
                  {editableModul.informasiUmum.profilPelajarPancasila.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Karakteristik & Kesiapan Siswa</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {editableModul.informasiUmum.karakteristikKesiapanSiswa}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LANGKAH PEMBELAJARAN */}
        {activeTab === 'kegiatan' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Langkah Kegiatan Pembelajaran (Model: {editableModul.informasiUmum.modelPembelajaran})
              </h2>
            </div>

            <div className="space-y-6">
              {editableModul.rencanaPembelajaran.map(pertemuan => (
                <div key={pertemuan.pertemuanKe} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      Pertemuan ke-{pertemuan.pertemuanKe} ({pertemuan.alokasiWaktu})
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {pertemuan.tujuanKhususPertemuan}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Pendahuluan */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-600 mb-1">A. Kegiatan Pendahuluan</h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
                        {pertemuan.kegiatanPendahuluan.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Inti */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-600 mb-2">B. Kegiatan Inti</h4>
                      <div className="space-y-2">
                        {pertemuan.kegiatanInti.map((s, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200">
                            <div className="font-bold text-xs text-emerald-800 mb-1">{s.faseSintaks}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                              <div><strong>Aktivitas Guru:</strong> {s.aktivitasGuru}</div>
                              <div><strong>Aktivitas Siswa:</strong> {s.aktivitasSiswa}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Penutup */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-600 mb-1">C. Kegiatan Penutup</h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
                        {pertemuan.kegiatanPenutup.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DIFERENSIASI SISWA (TaRL) */}
        {activeTab === 'diferensiasi' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pembelajaran Berdiferensiasi Berdasarkan Capaian / Kesiapan Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Implementasi Teaching at the Right Level (TaRL) yang memfasilitasi kebutuhan murid sesuai kesiapan belajarnya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Perlu Bimbingan */}
              <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-900 text-sm">Kelompok Perlu Bimbingan</h3>
                    <p className="text-[11px] text-rose-700">Perlu penguatan konsep konkret & pendampingan</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-800">
                  <div className="p-2.5 bg-white rounded-lg border border-rose-200/80">
                    <span className="font-bold text-rose-800 block mb-0.5">Konten:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiKonten.kelompokPerluBimbingan}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-rose-200/80">
                    <span className="font-bold text-rose-800 block mb-0.5">Proses:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiProses.kelompokPerluBimbingan}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-rose-200/80">
                    <span className="font-bold text-rose-800 block mb-0.5">Produk:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiProduk.kelompokPerluBimbingan}
                  </div>
                </div>
              </div>

              {/* Kelompok Cakap */}
              <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm">Kelompok Cakap</h3>
                    <p className="text-[11px] text-blue-700">Mampu bekerja mandiri dalam kelompok</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-800">
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
                    <span className="font-bold text-blue-800 block mb-0.5">Konten:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiKonten.kelompokCakap}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
                    <span className="font-bold text-blue-800 block mb-0.5">Proses:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiProses.kelompokCakap}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
                    <span className="font-bold text-blue-800 block mb-0.5">Produk:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiProduk.kelompokCakap}
                  </div>
                </div>
              </div>

              {/* Kelompok Mahir */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 text-sm">Kelompok Mahir</h3>
                    <p className="text-[11px] text-emerald-700">Eksplorasi mandiri & menjadi tutor sebaya</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-800">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200/80">
                    <span className="font-bold text-emerald-800 block mb-0.5">Konten:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiKonten.kelompokMahir}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200/80">
                    <span className="font-bold text-emerald-800 block mb-0.5">Proses:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiProses.kelompokMahir}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200/80">
                    <span className="font-bold text-emerald-800 block mb-0.5">Produk:</span>
                    {editableModul.pembelajaranBerdiferensiasi.diferensiasiProduk.kelompokMahir}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LKPD SIAP CETAK */}
        {activeTab === 'lkpd' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lembar Kerja Peserta Didik (LKPD)</h2>
                <p className="text-xs text-slate-500">Format siap digunakan dan dicetak untuk aktivitas siswa di kelas</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak LKPD</span>
                </button>
              </div>
            </div>

            <div className="border-2 border-slate-900 rounded-2xl p-6 bg-white space-y-5">
              <div className="text-center border-b pb-4">
                <h3 className="font-black text-base text-slate-900 uppercase">
                  {editableModul.lampiran.lkpd.judul}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Mata Pelajaran: {editableModul.identitas.mataPelajaran} — Kelas {editableModul.identitas.kelas}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-b pb-3">
                <div>Nama Kelompok: _________________________</div>
                <div>Tanggal: ________________________________</div>
                <div className="col-span-2">
                  Anggota Kelompok: 1. ______________ 2. ______________ 3. ______________ 4. ______________
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 mb-1">Petunjuk Belajar:</div>
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {editableModul.lampiran.lkpd.petunjuk}
                </div>
              </div>

              <div className="space-y-4">
                {editableModul.lampiran.lkpd.aktivitasKelompok.map((akt, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-xs text-emerald-900 mb-1">{akt.bagian}</h4>
                    <p className="text-xs text-slate-600 mb-2 italic">Petunjuk: {akt.instruksi}</p>
                    <p className="text-xs font-semibold text-slate-800 mb-4">{akt.tugas}</p>
                    <div className="border-b border-dashed border-slate-300 h-10" />
                    <div className="border-b border-dashed border-slate-300 h-10" />
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 mb-1">Kesimpulan Kelompok:</div>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-xs text-slate-500 min-h-20">
                  {editableModul.lampiran.lkpd.kesimpulanSiswa}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ASESMEN & KKTP */}
        {activeTab === 'asesmen' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Asesmen & Rubrik KKTP</h2>

            {/* KKTP Cards */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-500">
                Kriteria Ketercapaian Tujuan Pembelajaran (Interval Nilai KKTP)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {editableModul.asesmenPembelajaran.kktp.kriteriaKetercapaian.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-bold text-xs text-emerald-800 mb-1">{item.kategori}</div>
                    <div className="text-xs text-slate-600 leading-relaxed">{item.deskripsi}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instrumen Soal Sumatif */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-500">Instrumen Soal Sumatif (HOTS)</h3>
              <div className="space-y-2">
                {editableModul.asesmenPembelajaran.asesmenSumatif.instrumenSoal.map(soal => (
                  <div key={soal.nomor} className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-bold text-xs text-slate-900">Soal {soal.nomor}:</div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Skor: {soal.skor}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 mt-1 mb-2">{soal.soal}</p>
                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Kunci Jawaban / Kriteria:</strong> {soal.kunciAtauKriteria}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MATERI & GLOSARIUM */}
        {activeTab === 'materi' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Bahan Bacaan Guru & Peserta Didik</h2>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-900 mb-2">Ringkasan Materi Esensial</h3>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {editableModul.lampiran.bahanBacaan.ringkasanMateri}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/40">
              <h3 className="font-bold text-sm text-emerald-900 mb-1">Panduan & Tips untuk Guru</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {editableModul.lampiran.bahanBacaan.panduanGuru}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Glosarium Istilah Penting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editableModul.lampiran.glosarium.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                    <span className="font-bold text-slate-900">{item.istilah}: </span>
                    <span className="text-slate-600">{item.arti}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
