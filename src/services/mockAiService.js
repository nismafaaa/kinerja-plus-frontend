/**
 * Mock AI Service for Kinerja Plus IPVS Prototype
 *
 * This module simulates the AI recommendation API.
 * Replace the functions here with real API calls when the backend is ready.
 *
 * Usage:
 *   import { getRecommendations } from './mockAiService.js';
 *   const result = await getRecommendations('tujuan', 'Meningkatkan ...');
 */

// Simulated delay (1.5 – 3 seconds)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return delay(1500 + Math.random() * 1500);
}

// --- Dummy datasets ---

const DATASET_KESEHATAN = {
  uraianIndikator: {
    value: 'Indeks Kesehatan Masyarakat',
    reasoning:
      'Berdasarkan analisis semantic similarity terhadap tujuan strategis yang diinput, indikator ini memiliki relevansi tinggi (skor 0.92) dengan konteks peningkatan kualitas layanan kesehatan. Referensi: Kepmendagri No. 050-5889 Tahun 2021.',
  },
  indikatorMinimum: {
    value: 'Tidak',
    reasoning:
      'Indeks Kesehatan bersifat positif — semakin tinggi nilainya semakin baik. Oleh karena itu, indikator ini bukan indikator minimum. AI merekomendasikan target yang meningkat setiap periode.',
  },
  definisiOperasional: {
    value:
      'Indeks komposit yang mengukur derajat kesehatan masyarakat berdasarkan angka harapan hidup, angka kesakitan, dan cakupan layanan kesehatan dasar sesuai standar SPM Kesehatan.',
    reasoning:
      'Definisi disusun berdasarkan referensi BPS dan standar Dinas Kesehatan. Mencakup aspek outcome sesuai prinsip cascading indikator SAKIP.',
  },
  rumusHitung: {
    value:
      '(Angka Harapan Hidup × 0.4) + (Cakupan Layanan Kesehatan Dasar × 0.35) + (Indeks Kepuasan Layanan Kesehatan × 0.25)',
    reasoning:
      'Formula berbasis komposit indeks tertimbang, mengacu pada metodologi BPS dan Kemenkes RI. Bobot disesuaikan dengan prioritas pembangunan kesehatan daerah.',
  },
  sumberData: {
    value: 'Dinas Kesehatan, BPS Kabupaten/Kota, Laporan SPM Kesehatan Tahunan',
    reasoning:
      'Sumber data dipilih berdasarkan ketersediaan dan validitas data. Dinas Kesehatan sebagai sumber primer, BPS sebagai sumber verifikasi.',
  },
  targetPeriode: {
    values: {
      2027: '75.50',
      2028: '77.20',
      2029: '79.00',
      2030: '80.80',
      2031: '82.50',
    },
    reasoning:
      'Target diproyeksikan berdasarkan tren historis 2021–2026 dengan pertumbuhan rata-rata 2.1% per tahun. Mempertimbangkan target RPJMD dan kapasitas daerah.',
  },
};

const DATASET_PENDIDIKAN = {
  uraianIndikator: {
    value: 'Angka Partisipasi Murni (APM) Pendidikan Dasar',
    reasoning:
      'Indikator APM dipilih karena relevansi tinggi (skor 0.89) dengan sasaran strategis peningkatan akses pendidikan. Sesuai nomenklatur Kepmendagri No. 050-5889 Tahun 2021.',
  },
  indikatorMinimum: {
    value: 'Tidak',
    reasoning:
      'APM bersifat positif — semakin tinggi partisipasi semakin baik. Bukan indikator minimum, sehingga target direkomendasikan meningkat.',
  },
  definisiOperasional: {
    value:
      'Persentase penduduk usia sekolah (7-12 tahun) yang bersekolah pada jenjang pendidikan dasar (SD/MI) terhadap total penduduk usia 7-12 tahun di wilayah tersebut.',
    reasoning:
      'Definisi mengacu pada standar Kemendikbud dan BPS. Fokus pada outcome akses pendidikan, bukan output kegiatan.',
  },
  rumusHitung: {
    value:
      '(Jumlah siswa usia 7–12 tahun yang bersekolah di SD/MI ÷ Jumlah penduduk usia 7–12 tahun) × 100%',
    reasoning:
      'Rumus standar BPS untuk penghitungan APM. Sumber data: Data Pokok Pendidikan (Dapodik) dan data kependudukan.',
  },
  sumberData: {
    value: 'Dinas Pendidikan, Dapodik, BPS Kabupaten/Kota',
    reasoning:
      'Dapodik menyediakan data siswa terdaftar, BPS menyediakan data kependudukan sebagai denominator.',
  },
  targetPeriode: {
    values: {
      2027: '96.50',
      2028: '97.00',
      2029: '97.50',
      2030: '98.00',
      2031: '98.40',
    },
    reasoning:
      'Target diproyeksikan mendekati universal enrollment (100%). Pertumbuhan melambat karena mendekati saturasi. Mempertimbangkan kondisi geografis daerah.',
  },
};

const DATASET_DEFAULT = {
  uraianIndikator: {
    value: 'Indeks Kinerja Pembangunan Daerah',
    reasoning:
      'Rekomendasi indikator umum berdasarkan konteks perencanaan pembangunan daerah. Dapat disesuaikan lebih lanjut sesuai bidang urusan spesifik.',
  },
  indikatorMinimum: {
    value: 'Tidak',
    reasoning:
      'Secara default, indikator kinerja pembangunan bersifat positif. Nilai yang lebih tinggi menunjukkan kinerja yang lebih baik.',
  },
  definisiOperasional: {
    value:
      'Ukuran komposit yang menggambarkan capaian kinerja pembangunan daerah berdasarkan indikator-indikator utama sesuai RPJMD dan standar pemerintah.',
    reasoning:
      'Definisi umum yang dapat diperdalam sesuai konteks spesifik indikator.',
  },
  rumusHitung: {
    value: 'Realisasi Capaian ÷ Target × 100%',
    reasoning:
      'Rumus dasar pengukuran capaian kinerja. Dapat dikustomisasi sesuai jenis indikator spesifik.',
  },
  sumberData: {
    value: 'OPD Terkait, BPS, Laporan Kinerja Tahunan',
    reasoning:
      'Sumber data umum. Disarankan untuk diverifikasi dan dilengkapi sesuai bidang urusan.',
  },
  targetPeriode: {
    values: {
      2027: '80.00',
      2028: '82.50',
      2029: '85.00',
      2030: '87.50',
      2031: '90.00',
    },
    reasoning:
      'Target dasar dengan pertumbuhan linear 2.5% per tahun. Perlu disesuaikan berdasarkan data historis aktual.',
  },
};

/**
 * Determine which dataset to use based on input text keywords.
 */
function selectDataset(inputText) {
  const lower = inputText.toLowerCase();
  if (
    lower.includes('kesehatan') ||
    lower.includes('stunting') ||
    lower.includes('gizi') ||
    lower.includes('harapan hidup')
  ) {
    return DATASET_KESEHATAN;
  }
  if (
    lower.includes('pendidikan') ||
    lower.includes('sekolah') ||
    lower.includes('literasi') ||
    lower.includes('partisipasi')
  ) {
    return DATASET_PENDIDIKAN;
  }
  return DATASET_DEFAULT;
}

/**
 * Get AI recommendations for indicator fields.
 *
 * @param {'tujuan' | 'sasaran'} type - Page type
 * @param {string} inputText - The user's strategic goal text
 * @returns {Promise<object>} Recommendation data
 */
export async function getRecommendations(type, inputText) {
  // Simulate network delay
  await randomDelay();

  const dataset = selectDataset(inputText);

  // Adjust label for tujuan vs sasaran
  const labelPrefix = type === 'tujuan' ? 'Tujuan' : 'Sasaran';

  return {
    uraianIndikator: {
      label: `Uraian Indikator ${labelPrefix}`,
      ...dataset.uraianIndikator,
    },
    indikatorMinimum: {
      label: 'Indikator Minimum',
      ...dataset.indikatorMinimum,
    },
    definisiOperasional: {
      label: 'Definisi Operasional',
      ...dataset.definisiOperasional,
    },
    rumusHitung: {
      label: 'Rumus Hitung',
      ...dataset.rumusHitung,
    },
    sumberData: {
      label: 'Sumber Data',
      ...dataset.sumberData,
    },
    targetPeriode: {
      label: 'Target Periode Berikutnya',
      ...dataset.targetPeriode,
    },
  };
}
