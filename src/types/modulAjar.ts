export interface IdentitasModul {
  penyusun: string;
  instansi: string;
  mataPelajaran: string;
  fase: string;
  kelas: string;
  semester: string;
  alokasiWaktu: string;
  jumlahPertemuan: number;
}

export interface InformasiUmum {
  kompetensiAwal: string;
  profilPelajarPancasila: string[];
  saranaPrasarana: string[];
  targetPesertaDidik: string;
  karakteristikKesiapanSiswa: string;
  modelPembelajaran: string;
  metodePembelajaran: string[];
}

export interface KomponenInti {
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
}

export interface SintaksLangkah {
  faseSintaks: string;
  aktivitasGuru: string;
  aktivitasSiswa: string;
}

export interface RencanaPertemuan {
  pertemuanKe: number;
  alokasiWaktu: string;
  tujuanKhususPertemuan: string;
  kegiatanPendahuluan: string[];
  kegiatanInti: SintaksLangkah[];
  kegiatanPenutup: string[];
}

export interface PembelajaranBerdiferensiasi {
  diferensiasiKonten: {
    kelompokPerluBimbingan: string;
    kelompokCakap: string;
    kelompokMahir: string;
  };
  diferensiasiProses: {
    kelompokPerluBimbingan: string;
    kelompokCakap: string;
    kelompokMahir: string;
  };
  diferensiasiProduk: {
    kelompokPerluBimbingan: string;
    kelompokCakap: string;
    kelompokMahir: string;
  };
}

export interface KriteriaKKTP {
  kategori: string;
  deskripsi: string;
}

export interface AsesmenFormatifItem {
  aspek: string;
  kriteria: string;
}

export interface AsesmenSumatifSoal {
  nomor: number;
  soal: string;
  kunciAtauKriteria: string;
  skor: number;
}

export interface AsesmenPembelajaran {
  asesmenDiagnostik: {
    teknik: string;
    soalAtauInstrumen: string[];
  };
  asesmenFormatif: {
    teknik: string;
    rubrikObservasi: AsesmenFormatifItem[];
  };
  asesmenSumatif: {
    teknik: string;
    instrumenSoal: AsesmenSumatifSoal[];
  };
  kktp: {
    kriteriaKetercapaian: KriteriaKKTP[];
  };
}

export interface PengayaanDanRemedial {
  programRemedial: string;
  programPengayaan: string;
}

export interface Refleksi {
  refleksiGuru: string[];
  refleksiSiswa: string[];
}

export interface AktivitasLKPD {
  bagian: string;
  instruksi: string;
  tugas: string;
}

export interface LKPDData {
  judul: string;
  petunjuk: string;
  aktivitasKelompok: AktivitasLKPD[];
  kesimpulanSiswa: string;
}

export interface GlosariumItem {
  istilah: string;
  arti: string;
}

export interface LampiranModul {
  lkpd: LKPDData;
  bahanBacaan: {
    ringkasanMateri: string;
    panduanGuru: string;
  };
  glosarium: GlosariumItem[];
  daftarPustaka: string[];
}

export interface ModulAjar {
  id?: string;
  createdAt?: string;
  identitas: IdentitasModul;
  informasiUmum: InformasiUmum;
  komponenInti: KomponenInti;
  rencanaPembelajaran: RencanaPertemuan[];
  pembelajaranBerdiferensiasi: PembelajaranBerdiferensiasi;
  asesmenPembelajaran: AsesmenPembelajaran;
  pengayaanDanRemedial: PengayaanDanRemedial;
  refleksi: Refleksi;
  lampiran: LampiranModul;
}

export interface PresetTemplate {
  id: string;
  title: string;
  fase: string;
  jenjang: string;
  kelas: string;
  mataPelajaran: string;
  topik: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  karakteristikSiswa: string;
  modelPembelajaran: string;
  dimensiProfilPancasila: string[];
  alokasiWaktu: string;
  jumlahPertemuan: number;
}
