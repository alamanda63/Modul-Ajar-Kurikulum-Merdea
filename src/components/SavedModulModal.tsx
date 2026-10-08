import React, { useState } from 'react';
import { X, Search, Trash2, ExternalLink, Calendar, BookOpen, Download } from 'lucide-react';
import { ModulAjar } from '../types/modulAjar.ts';
import { exportModulToWord } from '../utils/exportUtils.ts';

interface SavedModulModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: ModulAjar[];
  onSelectModul: (modul: ModulAjar) => void;
  onDeleteModul: (id: string) => void;
}

export const SavedModulModal: React.FC<SavedModulModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onSelectModul,
  onDeleteModul,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = savedList.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      m.identitas.mataPelajaran.toLowerCase().includes(q) ||
      m.identitas.instansi.toLowerCase().includes(q) ||
      m.identitas.fase.toLowerCase().includes(q) ||
      m.komponenInti.tujuanPembelajaran.some(tp => tp.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Koleksi Modul Ajar Tersimpan</h3>
            <p className="text-xs text-slate-500">
              {savedList.length} modul tersimpan di perangkat lokal Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan mata pelajaran, fase, topik..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-500" />
              <p className="text-sm font-medium text-slate-600">
                {savedList.length === 0
                  ? 'Belum ada modul ajar yang disimpan.'
                  : 'Tidak ditemukan modul ajar yang cocok.'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan tombol "Simpan Modul" pada hasil modul yang sudah dibuat.
              </p>
            </div>
          ) : (
            filtered.map(modul => (
              <div
                key={modul.id || Math.random().toString()}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {modul.identitas.mataPelajaran}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      Fase {modul.identitas.fase} - Kelas {modul.identitas.kelas}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {modul.komponenInti.tujuanPembelajaran[0] || 'Modul Ajar'}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>{modul.identitas.instansi}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {modul.createdAt ? new Date(modul.createdAt).toLocaleDateString('id-ID') : 'Tersimpan'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => exportModulToWord(modul)}
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-colors"
                    title="Unduh Word"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectModul(modul);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => modul.id && onDeleteModul(modul.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
