import { renderScoreSection, initScoreSection } from './scoreSectionHelper.js';

export function renderSection9(data = { kemungkinan: null, dampak: null }) {
  return renderScoreSection(
    9,
    'seksi-9',
    'Skor Setelah Pengendalian Yang Masih Dibutuhkan',
    'Proyeksi target residual risiko akhir setelah rencana aksi mitigasi tambahan (Seksi 8) dijalankan.',
    'skor-final',
    'Status Risiko Akhir',
    data
  );
}

export function initSection9(data, onChange) {
  initScoreSection('skor-final', data, onChange);
}
