import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, FolderHeart, HelpCircle, FileText, Wifi, WifiOff } from 'lucide-react';

interface NavbarProps {
  onNewModul: () => void;
  onOpenSaved: () => void;
  onOpenGuide: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewModul,
  onOpenSaved,
  onOpenGuide,
  savedCount,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewModul}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">ModulAjar<span className="text-emerald-600">.AI</span></span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Kurikulum Merdeka
              </span>
              {!isOnline && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Generator Modul Ajar Berdiferensiasi & TaRL Otomatis
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onNewModul}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
            title="Mulai form baru"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Buat</span> Baru
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200 hover:border-emerald-300"
          >
            <FolderHeart className="w-4 h-4 text-slate-600" />
            <span>Koleksi</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Panduan Kurikulum Merdeka & Penggunaan Offline"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Panduan & Offline</span>
          </button>
        </div>
      </div>
    </header>
  );
};
