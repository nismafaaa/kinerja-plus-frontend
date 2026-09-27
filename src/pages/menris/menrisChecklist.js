const SECTION_LABELS = [
  'Identifikasi Risiko',
  'Kategori Risiko',
  'Analisa Risiko Awal',
  'Pengendalian Eksisting',
  'Skor Pasca-Pengendalian',
  'Selera Risiko',
  'Perlakuan Risiko',
  'Pengendalian yg Masih Dibutuhkan',
  'Skor Setelah Pengendalian Lanjutan',
  'Penanggung Jawab',
  'Tenggat Waktu Mitigasi',
];

/**
 * Sticky "N Seksi" completion checklist, driven by real per-section
 * completion flags computed from actual field state (not the mockup's
 * hardcoded "all checked" placeholder).
 *
 * @param {boolean[]} completionFlags - length 11, index i = section i+1 complete
 */
export function renderMenrisChecklist(completionFlags = new Array(SECTION_LABELS.length).fill(false)) {
  const total = SECTION_LABELS.length;
  const doneCount = completionFlags.filter(Boolean).length;

  const items = SECTION_LABELS.map((label, i) => {
    const number = i + 1;
    const done = completionFlags[i];
    return `
      <a class="menris-checklist__item${done ? ' menris-checklist__item--done' : ''}" href="#seksi-${number}">
        <span class="menris-checklist__number">${number}</span>
        <span class="menris-checklist__label">${label}</span>
        ${done ? '<span class="menris-checklist__check">&#10003;</span>' : ''}
      </a>
    `;
  }).join('');

  return `
    <div class="menris-checklist" id="menris-checklist">
      <div class="menris-checklist__header">
        <span>Kelengkapan ${total} Seksi</span>
        <span class="menris-checklist__count">${doneCount}/${total}</span>
      </div>
      <div class="menris-checklist__progress">
        <div class="menris-checklist__progress-bar" style="width:${(doneCount / total) * 100}%"></div>
      </div>
      <div class="menris-checklist__items">${items}</div>
    </div>
  `;
}

/** Re-renders the checklist in place given fresh completion flags. */
export function updateMenrisChecklist(completionFlags) {
  const el = document.getElementById('menris-checklist');
  if (!el) return;
  el.outerHTML = renderMenrisChecklist(completionFlags);
}
