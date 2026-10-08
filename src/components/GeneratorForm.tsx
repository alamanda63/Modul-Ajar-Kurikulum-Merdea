import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  GraduationCap,
  Users,
  Clock,
  Target,
  Wand2,
  CheckCircle2,
  HelpCircle,
  School,
  User,
  ArrowRight,
  BookOpenCheck,
  Compass,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import {
  DAFTAR_FASE,
  MATA_PELAJARAN_POPULER,
  DIMENSI_P3,
  MODEL_PEMBELAJARAN,
  KARAKTERISTIK_SISWA_PRESETS,
  PRESET_TEMPLATES,
} from '../data/kurikulumData.ts';
import { ModulAjar, PresetTemplate } from '../types/modulAjar.ts';
import { buildOfflineModulAjar } from '../utils/offlineModulGenerator.ts';

interface GeneratorFormProps {
  onGenerated: (modul: ModulAjar) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerated,
  isLoading,
  setIsLoading,
}) => {
  // Form states
  const [fase, setFase] = useState('B');
  const [jenjang, setJenjang] = useState('SD / MI');
  const [kelas, setKelas] = useState('4');
  const [mataPelajaran, setMataPelajaran] = useState('IPAS (Ilmu Pengetahuan Alam & Sosial)');
  const [topikMateri, setTopikMateri] = useState('Wujud Zat dan Perubahannya');
  const [capaianPembelajaran, setCapaianPembelajaran] = useState(
    'Peserta didik mengidentifikasi proses perubahan wujud zat dan mendeskripsikan bagaimana energi kalor berperan dalam perubahan wujud zat serta kaitannya dengan siklus air di lingkungan sekitar.'
  );
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState(
    '1. Peserta didik dapat menganalisis proses perubahan wujud zat (mencair, membeku, menguap, mengembun) melalui percobaan sederhana secara kritis.\n2. Peserta didik dapat menghubungkan pengaruh panas (kalor) terhadap perubahan wujud zat dalam kehidupan sehari-hari.\n3. Peserta didik dapat menyajikan laporan hasil penyelidikan kelompok mengenai siklus air dengan penuh tanggung jawab.'
  );
  const [karakteristikSiswa, setKarakteristikSiswa] = useState(
    KARAKTERISTIK_SISWA_PRESETS[0].value
  );
  const [modelPembelajaran, setModelPembelajaran] = useState('Problem Based Learning (PBL)');
  const [selectedP3, setSelectedP3] = useState<string[]>([
    'Bernalar Kritis',
    'Bergotong Royong',
    'Mandiri',
  ]);
  const [alokasiWaktu, setAlokasiWaktu] = useState('2 Pertemuan (4 JP x 35 Menit)');
  const [jumlahPertemuan, setJumlahPertemuan] = useState(2);
  const [semester, setSemester] = useState('1 (Ganjil)');
  const [namaGuru, setNamaGuru] = useState('Ibu Siti Rahmawati, S.Pd.');
  const [namaSekolah, setNamaSekolah] = useState('SD Negeri Nusantara Merdeka');
  const [saranaPrasarana, setSaranaPrasarana] = useState(
    'Buku teks siswa, benda konkret sekitar kelas (es batu, air, lilin), proyektor, lembar kerja siswa'
  );

  // Suggestion state
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTemporaryError, setIsTemporaryError] = useState(false);

  // Network & Offline Mode States
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [generatorMode, setGeneratorMode] = useState<'ai' | 'offline'>('ai');

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setGeneratorMode('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Loading indicator step messages
  const [loadingStep, setLoadingStep] = useState(0);

  // Change Fase updates Jenjang and default Kelas
  const handleFaseChange = (newFase: string) => {
    setFase(newFase);
    const faseObj = DAFTAR_FASE.find(f => f.fase === newFase);
    if (faseObj) {
      setJenjang(faseObj.jenjang);
      setKelas(faseObj.kelas[0]);
    }
  };

  // Toggle P3 Dimension
  const toggleP3 = (dimensiLabel: string) => {
    if (selectedP3.includes(dimensiLabel)) {
      if (selectedP3.length > 1) {
        setSelectedP3(selectedP3.filter(p => p !== dimensiLabel));
      }
    } else {
      setSelectedP3([...selectedP3, dimensiLabel]);
    }
  };

  // Apply Preset
  const handleApplyPreset = (preset: PresetTemplate) => {
    setFase(preset.fase);
    setJenjang(preset.jenjang);
    setKelas(preset.kelas);
    setMataPelajaran(preset.mataPelajaran);
    setTopikMateri(preset.topik);
    setCapaianPembelajaran(preset.capaianPembelajaran);
    setTujuanPembelajaran(preset.tujuanPembelajaran);
    setKarakteristikSiswa(preset.karakteristikSiswa);
    setModelPembelajaran(preset.modelPembelajaran);
    setSelectedP3(preset.dimensiProfilPancasila);
    setAlokasiWaktu(preset.alokasiWaktu);
    setJumlahPertemuan(preset.jumlahPertemuan);
  };

  // Auto-Suggest TP from CP & Topik
  const handleSuggestTP = async () => {
    if (!topikMateri.trim()) {
      setErrorMessage('Harap isi Topik / Materi terlebih dahulu sebelum meminta rekomendasi TP.');
      return;
    }
    setErrorMessage(null);

    // If offline, provide intelligent template suggestion locally without network
    if (!isOnline) {
      const suggestedTP = [
        `1. Peserta didik mampu menganalisis konsep ${topikMateri} pada mata pelajaran ${mataPelajaran} melalui pengamatan terstruktur.`,
        `2. Peserta didik mampu menghubungkan penerapan ${topikMateri} dengan permasalahan kontekstual di lingkungan sekitar.`,
        `3. Peserta didik mampu menyajikan hasil karya pemecahan masalah terkait ${topikMateri} secara mandiri dan bertanggung jawab.`,
      ].join('\n');
      setTujuanPembelajaran(suggestedTP);
      setKarakteristikSiswa(
        `Kesiapan Peserta Didik:\n• Perlu Bimbingan: Memerlukan media konkret dan pendampingan bertahap memahami ${topikMateri}.\n• Cakap: Mampu menganalisis tugas terstruktur secara mandiri.\n• Mahir: Mampu bernalar kritis tinggi dan memimpin penyelidikan terbuka.`
      );
      return;
    }

    setIsSuggesting(true);
    try {
      const res = await fetch('/api/suggest-tp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mataPelajaran,
          jenjang,
          fase,
          capaianPembelajaran,
          topikUtama: topikMateri,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { tujuanPembelajaran: tps, profilKesiapanPesertaDidik } = data.data;
        if (Array.isArray(tps) && tps.length > 0) {
          setTujuanPembelajaran(tps.map((tp: string, idx: number) => `${idx + 1}. ${tp}`).join('\n'));
        }
        if (profilKesiapanPesertaDidik) {
          setKarakteristikSiswa(
            `Kesiapan Peserta Didik:\n• Perlu Bimbingan: ${profilKesiapanPesertaDidik.perluBimbingan || '-'}\n• Cakap: ${profilKesiapanPesertaDidik.cakap || '-'}\n• Mahir: ${profilKesiapanPesertaDidik.mahir || '-'}`
          );
        }
      } else {
        setErrorMessage(data.error || 'Gagal mengambil saran TP.');
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kendala jaringan saat meminta rekomendasi TP: ' + err.message);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Generate Offline Locally
  const handleGenerateOffline = () => {
    if (!mataPelajaran.trim() || !tujuanPembelajaran.trim()) {
      setErrorMessage('Mata Pelajaran dan Tujuan Pembelajaran (TP) wajib diisi.');
      setIsTemporaryError(false);
      return;
    }
    setErrorMessage(null);
    setIsTemporaryError(false);
    setIsLoading(true);

    try {
      const offlineModul = buildOfflineModulAjar({
        mataPelajaran,
        jenjang,
        fase,
        kelas,
        semester,
        alokasiWaktu,
        jumlahPertemuan,
        capaianPembelajaran,
        tujuanPembelajaran,
        karakteristikSiswa,
        modelPembelajaran,
        dimensiProfilPancasila: selectedP3,
        saranaPrasarana,
        namaGuru,
        namaSekolah,
      });

      // Quick smooth transition
      setTimeout(() => {
        onGenerated(offlineModul);
        setIsLoading(false);
      }, 400);
    } catch (err: any) {
      setErrorMessage('Gagal menyusun modul offline: ' + (err.message || err));
      setIsLoading(false);
    }
  };

  // Generate Full Modul
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If offline or user chose offline generator mode, run locally immediately
    if (!isOnline || generatorMode === 'offline') {
      handleGenerateOffline();
      return;
    }

    if (!mataPelajaran.trim() || !tujuanPembelajaran.trim()) {
      setErrorMessage('Mata Pelajaran dan Tujuan Pembelajaran (TP) wajib diisi.');
      setIsTemporaryError(false);
      return;
    }

    setErrorMessage(null);
    setIsTemporaryError(false);
    setIsLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 2800);

    try {
      const res = await fetch('/api/generate-modul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mataPelajaran,
          jenjang,
          fase,
          kelas,
          semester,
          alokasiWaktu,
          jumlahPertemuan,
          capaianPembelajaran,
          tujuanPembelajaran,
          karakteristikSiswa,
          modelPembelajaran,
          dimensiProfilPancasila: selectedP3,
          saranaPrasarana,
          namaGuru,
          namaSekolah,
        }),
      });

      const result = await res.json();
      clearInterval(stepInterval);

      if (result.success && result.data) {
        const fullModul: ModulAjar = {
          ...result.data,
          id: 'modul_' + Date.now(),
          createdAt: new Date().toISOString(),
        };
        onGenerated(fullModul);
      } else {
        const msg = result.error || 'Terjadi kesalahan dalam menyusun modul ajar.';
        setErrorMessage(msg);
        setIsTemporaryError(result.isTemporary || msg.includes('503') || msg.includes('lonjakan') || msg.includes('antrean'));
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      const msg = err.message || 'Gagal menghubungi server';
      setErrorMessage('Gagal menghubungi server AI: ' + msg);
      setIsTemporaryError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadingSteps = [
    'Menganalisis Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP)...',
    'Menyusun Sintaks Model Pembelajaran dan Langkah Berurutan...',
    'Merancang Strategi Diferensiasi (Konten, Proses, Produk) & TaRL...',
    'Menyiapkan Rubrik Asesmen KKTP, Instrumen Soal & Lembar LKPD...',
    'Menyempurnakan Format Resmi Modul Ajar Kurikulum Merdeka...',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sesuai Panduan Pembelajaran & Asesmen Kemendikbudristek</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Penyusun Modul Ajar <span className="text-emerald-600">Kurikulum Merdeka</span>
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Otomatisasi penyusunan Modul Ajar operasional dengan diferensiasi nyata (Konten, Proses, Produk), sintaks model pembelajaran, rubrik KKTP, dan LKPD siap cetak.
        </p>
      </div>

      {/* Preset Quick Picks */}
      <div className="mb-8 bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Template Contoh Cepat (1-Klik Isi)
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Pilih untuk mencoba modul ajar berbagai jenjang
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_TEMPLATES.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div className="font-semibold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700 line-clamp-1">
                {preset.title}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                  Fase {preset.fase}
                </span>
                <span className="truncate">{preset.modelPembelajaran}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Connection & Engine Mode Toggle */}
      <div className="mb-6 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl flex items-center justify-center ${isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {isOnline ? 'Status Jaringan: Terhubung (Online)' : 'Status Jaringan: Offline (Tanpa Internet)'}
              </span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isOnline
                ? 'Pilih mode AI untuk variasi ide kreatif, atau Mode Mandiri untuk kecepatan instan tanpa kuota.'
                : 'Aplikasi berjalan otomatis dalam Mode Mandiri (Pedagogis Kurikulum Merdeka lokal).'}
            </p>
          </div>
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setGeneratorMode('ai')}
            disabled={!isOnline}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              generatorMode === 'ai' && isOnline
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mode AI Cloud</span>
          </button>

          <button
            type="button"
            onClick={() => setGeneratorMode('offline')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              generatorMode === 'offline' || !isOnline
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mode Mandiri (Offline)</span>
          </button>
        </div>
      </div>

      {/* Offline Notice if not online */}
      {!isOnline && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Mode Offline Aktif Sepenuhnya</span>
            <p className="text-amber-800">
              Anda tidak memiliki koneksi internet, namun Anda tetap dapat menyusun modul ajar lengkap, mencetak lembar kerja ke kertas/PDF, dan mengunduh berkas dengan mesin pedagogis mandiri.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div
          className={`mb-6 p-4 rounded-xl border text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
            isTemporaryError
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-lg leading-none mt-0.5">{isTemporaryError ? '⏳' : '⚠️'}</span>
            <div>
              <div className="font-bold text-xs uppercase tracking-wide mb-0.5">
                {isTemporaryError ? 'Antrean Layanan AI Penuh / Kuota Terbatas' : 'Pemberitahuan'}
              </div>
              <p className="text-xs sm:text-sm">{errorMessage}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
            {/* Quick Instant Offline Fallback button */}
            <button
              type="button"
              onClick={handleGenerateOffline}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Susun Mandiri (Offline / Instan)</span>
            </button>

            {isTemporaryError && (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>🔄 Coba Lagi AI</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Generator Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Section 1: Jenjang & Mata Pelajaran */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>1. JENJANG, FASE & MATA PELAJARAN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fase */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Fase Kurikulum Merdeka *
              </label>
              <select
                value={fase}
                onChange={e => handleFaseChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {DAFTAR_FASE.map(item => (
                  <option key={item.fase} value={item.fase}>
                    Fase {item.fase} ({item.jenjang} - Kelas {item.kelas.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Jenjang & Kelas */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jenjang
                </label>
                <input
                  type="text"
                  value={jenjang}
                  onChange={e => setJenjang(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kelas
                </label>
                <select
                  value={kelas}
                  onChange={e => setKelas(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {DAFTAR_FASE.find(f => f.fase === fase)?.kelas.map(k => (
                    <option key={k} value={k}>
                      Kelas {k}
                    </option>
                  )) || <option value={kelas}>Kelas {kelas}</option>}
                </select>
              </div>
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                list="mapel-list"
                value={mataPelajaran}
                onChange={e => setMataPelajaran(e.target.value)}
                placeholder="Pilih atau ketik mata pelajaran..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
              <datalist id="mapel-list">
                {MATA_PELAJARAN_POPULER.map(m => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Topik Materi */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Topik / Pokok Bahasan Utama *
            </label>
            <input
              type="text"
              value={topikMateri}
              onChange={e => setTopikMateri(e.target.value)}
              placeholder="Contoh: Perubahan Wujud Zat, Pola Aljabar, Ekosistem Sawah..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>
        </div>

        {/* Section 2: CP & TP (Tujuan Pembelajaran) */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>2. CAPAIAN PEMBELAJARAN (CP) & TUJUAN PEMBELAJARAN (TP)</span>
            </div>
            <button
              type="button"
              onClick={handleSuggestTP}
              disabled={isSuggesting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isSuggesting ? 'Merumuskan TP...' : '✨ Rekomendasikan TP & Diagnostik'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* CP */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Capaian Pembelajaran (CP) Elemen Terkait
                </label>
                <span className="text-[11px] text-slate-400">Dapat disalin dari Keputusan BSKAP</span>
              </div>
              <textarea
                rows={2}
                value={capaianPembelajaran}
                onChange={e => setCapaianPembelajaran(e.target.value)}
                placeholder="Tuliskan rumusan Capaian Pembelajaran resmi pada fase ini..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans"
              />
            </div>

            {/* TP */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Tujuan Pembelajaran (TP) *
                </label>
                <span className="text-[11px] text-emerald-600 font-medium">
                  Formula A-B-C-D / Berorientasi Nalar Kritis & HOTS
                </span>
              </div>
              <textarea
                rows={3}
                value={tujuanPembelajaran}
                onChange={e => setTujuanPembelajaran(e.target.value)}
                placeholder="1. Peserta didik dapat menganalisis...\n2. Peserta didik dapat merancang...\n3. Peserta didik dapat menyajikan..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Diferensiasi & Karakteristik Kesiapan Siswa */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold text-sm">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>3. CAPAIAN & PROFIL KESIAPAN PESERTA DIDIK (TaRL)</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            AI akan menyusun diferensiasi <strong>Konten, Proses, dan Produk</strong> secara spesifik sesuai kondisi kesiapan peserta didik di bawah ini:
          </p>

          {/* Quick preset buttons for student profile */}
          <div className="flex flex-wrap gap-2 mb-3">
            {KARAKTERISTIK_SISWA_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setKarakteristikSiswa(p.value)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                  karakteristikSiswa === p.value
                    ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={karakteristikSiswa}
            onChange={e => setKarakteristikSiswa(e.target.value)}
            placeholder="Jelaskan kondisi keberagaman murid: kelompok mahir, kelompok cakap, dan kelompok yang butuh bimbingan intensif / konkret..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Section 4: Model Pembelajaran & Profil Pelajar Pancasila */}
        <div className="p-6 border-b border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Pembelajaran */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>MODEL PEMBELAJARAN</span>
              </div>
              <select
                value={modelPembelajaran}
                onChange={e => setModelPembelajaran(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2"
              >
                {MODEL_PEMBELAJARAN.map(m => (
                  <option key={m.nama} value={m.nama}>
                    {m.nama}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                {MODEL_PEMBELAJARAN.find(m => m.nama === modelPembelajaran)?.deskripsi}
              </p>
            </div>

            {/* Waktu & Pertemuan */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>ALOKASI WAKTU & PERTEMUAN</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Jumlah Pertemuan</label>
                  <select
                    value={jumlahPertemuan}
                    onChange={e => setJumlahPertemuan(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value={1}>1 Pertemuan</option>
                    <option value={2}>2 Pertemuan</option>
                    <option value={3}>3 Pertemuan</option>
                    <option value={4}>4 Pertemuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Alokasi Waktu (JP)</label>
                  <input
                    type="text"
                    value={alokasiWaktu}
                    onChange={e => setAlokasiWaktu(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profil Pelajar Pancasila (P3) */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Dimensi Profil Pelajar Pancasila (Pilih yang relevan):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {DIMENSI_P3.map(p3 => {
                const checked = selectedP3.includes(p3.label);
                return (
                  <label
                    key={p3.id}
                    onClick={() => toggleP3(p3.label)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                      checked
                        ? 'bg-emerald-50/80 border-emerald-500 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors ${
                        checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{p3.label}</div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{p3.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Identitas Sekolah & Guru */}
        <div className="p-6 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold text-sm">
            <School className="w-5 h-5 text-emerald-600" />
            <span>5. IDENTITAS SATUAN PENDIDIKAN & SARANA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Nama Guru Penyusun</label>
              <input
                type="text"
                value={namaGuru}
                onChange={e => setNamaGuru(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Nama Satuan Pendidikan / Sekolah</label>
              <input
                type="text"
                value={namaSekolah}
                onChange={e => setNamaSekolah(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="1 (Ganjil)">1 (Ganjil)</option>
                <option value="2 (Genap)">2 (Genap)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Sarana dan Prasarana</label>
            <input
              type="text"
              value={saranaPrasarana}
              onChange={e => setSaranaPrasarana(e.target.value)}
              placeholder="Media konkrit, alat praktik, bahan tayang, ruangan..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
            <span>Menghasilkan modul utuh: Informasi Umum, Sintaks, LKPD, dan KKTP.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{generatorMode === 'offline' || !isOnline ? 'Menyusun Modul Mandiri...' : 'Menyusun Modul Ajar via AI...'}</span>
              </>
            ) : (
              <>
                {generatorMode === 'offline' || !isOnline ? (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Susun Modul Ajar (Mode Mandiri / Offline)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Susun Modul Ajar dengan AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading Overlay Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">
              Merancang Modul Ajar...
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              AI sedang menyelaraskan Tujuan Pembelajaran dengan model pembelajaran & profil murid
            </p>

            <div className="space-y-3 text-left">
              {loadingSteps.map((step, idx) => {
                const isDone = idx < loadingStep;
                const isCurrent = idx === loadingStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 text-xs transition-opacity ${
                      isDone
                        ? 'text-emerald-700 font-medium'
                        : isCurrent
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'border-2 border-emerald-600 text-emerald-600 animate-spin'
                          : 'border border-slate-300'
                      }`}
                    >
                      {isDone ? '✓' : ''}
                    </div>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
