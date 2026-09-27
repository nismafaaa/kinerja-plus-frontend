import { renderScoreSection, initScoreSection } from './scoreSectionHelper.js';

export function renderSection5(data = { kemungkinan: null, dampak: null }) {
  return renderScoreSection(
    5,
    'seksi-5',
    'Skor Setelah Ada Pengendalian (Evaluasi Sisa Risiko)',
    'Tingkat kemungkinan dan dampak setelah kontrol eksisting di Seksi 4 berjalan.',
    'skor-existing',
    'Skor Pasca-Kontrol',
    data
  );
}

export function initSection5(data, onChange) {
  initScoreSection('skor-existing', data, onChange);
}
