import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { GeneratorForm } from './components/GeneratorForm.tsx';
import { ModulViewer } from './components/ModulViewer.tsx';
import { SavedModulModal } from './components/SavedModulModal.tsx';
import { GuideModal } from './components/GuideModal.tsx';
import { ModulAjar } from './types/modulAjar.ts';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'modul_ajar_merdeka_collection';

export default function App() {
  const [currentModul, setCurrentModul] = useState<ModulAjar | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedList, setSavedList] = useState<ModulAjar[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved modules from localStorage on start
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedList(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse saved modules:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Save or update module in collection
  const handleSaveModul = (modulToSave: ModulAjar) => {
    const existingIndex = savedList.findIndex(m => m.id === modulToSave.id);
    let updatedList: ModulAjar[];
    if (existingIndex >= 0) {
      updatedList = [...savedList];
      updatedList[existingIndex] = modulToSave;
      showToast('Perubahan modul berhasil disimpan di koleksi!');
    } else {
      const newEntry = {
        ...modulToSave,
        id: modulToSave.id || 'modul_' + Date.now(),
        createdAt: modulToSave.createdAt || new Date().toISOString(),
      };
      updatedList = [newEntry, ...savedList];
      showToast('Modul ajar berhasil ditambahkan ke koleksi tersimpan!');
    }
    setSavedList(updatedList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  };

  // Delete from collection
  const handleDeleteModul = (id: string) => {
    const updated = savedList.filter(m => m.id !== id);
    setSavedList(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
    showToast('Modul dihapus dari koleksi.');
  };

  // Check if current modul is saved
  const isCurrentSaved = currentModul
    ? savedList.some(m => m.id === currentModul.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        onNewModul={() => setCurrentModul(null)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        savedCount={savedList.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentModul ? (
          <ModulViewer
            modul={currentModul}
            onBackToForm={() => setCurrentModul(null)}
            onSaveModul={handleSaveModul}
            isSaved={isCurrentSaved}
            onUpdateModul={updated => setCurrentModul(updated)}
          />
        ) : (
          <GeneratorForm
            onGenerated={modul => {
              setCurrentModul(modul);
              showToast('✨ Modul Ajar berhasil disusun secara otomatis!');
            }}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer (Hidden when printing) */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ModulAjar.AI</span>
            <span>—</span>
            <span>Platform Kolaboratif Guru Kurikulum Merdeka</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Didedikasikan untuk kemajuan pendidikan Indonesia</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>

      {/* Saved Modul Modal */}
      <SavedModulModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedList={savedList}
        onSelectModul={modul => setCurrentModul(modul)}
        onDeleteModul={handleDeleteModul}
      />

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
