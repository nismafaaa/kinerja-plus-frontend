import { renderScoreSection, initScoreSection } from './scoreSectionHelper.js';

export function renderSection3(data = { kemungkinan: null, dampak: null }) {
  return renderScoreSection(
    3,
    'seksi-3',
    'Analisa Risiko Awal (Inherent Risk)',
    'Penilaian tingkat risiko murni sebelum mempertimbangkan pengendalian yang terpasang.',
    'skor-awal',
    'Skor Status Awal',
    data
  );
}

export function initSection3(data, onChange) {
  initScoreSection('skor-awal', data, onChange);
}
