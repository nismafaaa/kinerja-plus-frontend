/**
 * Render a grid of selectable indicator option cards.
 *
 * @param {string[]} options  - Array of indicator name strings from the API
 * @param {'tujuan'|'sasaran'} type - used for aria labels
 */
export function renderIndicatorOptions(options, type) {
  const typeName = type === 'tujuan' ? 'Indikator Tujuan' : 'Indikator Sasaran';

  const cards = options
    .map(
      (name, i) => `
      <div
        class="indicator-option"
        id="indicator-opt-${i}"
        data-index="${i}"
        data-name="${encodeURIComponent(name)}"
        tabindex="0"
        role="radio"
        aria-checked="false"
        aria-label="${typeName}: ${name}"
        style="animation-delay: ${i * 0.07}s"
      >
        <div class="indicator-option__header">
          <span class="indicator-option__index">${String(i + 1).padStart(2, '0')}</span>
          <div class="indicator-option__label">${name}</div>
          <span class="indicator-option__check" aria-hidden="true"></span>
        </div>
      </div>
    `
    )
    .join('');

  return `
    <div class="indicator-options-grid" id="indicator-options-grid" role="radiogroup" aria-label="Pilih ${typeName}">
      ${cards}
    </div>
    <div class="indicator-options-actions">
      <button class="btn btn--ai" id="btn-confirm-indicator" disabled>
        <span>Lanjutkan dengan Indikator Terpilih</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>
  `;
}

/**
 * Initialize selection logic for indicator option cards.
 *
 * @param {function(selectedName: string): void} onConfirm
 */
export function initIndicatorSelector(onConfirm) {
  const grid = document.getElementById('indicator-options-grid');
  const confirmBtn = document.getElementById('btn-confirm-indicator');

  if (!grid || !confirmBtn) return;

  let selectedIndex = null;

  function selectCard(card) {
    grid.querySelectorAll('.indicator-option').forEach((c) => {
      c.classList.remove('indicator-option--selected');
      c.setAttribute('aria-checked', 'false');
    });

    card.classList.add('indicator-option--selected');
    card.setAttribute('aria-checked', 'true');
    selectedIndex = parseInt(card.dataset.index, 10);
    confirmBtn.disabled = false;
  }

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.indicator-option');
    if (card) selectCard(card);
  });

  grid.addEventListener('keydown', (e) => {
    const card = e.target.closest('.indicator-option');
    if (!card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectCard(card);
    }
  });

  confirmBtn.addEventListener('click', () => {
    if (selectedIndex === null) return;
    const card = grid.querySelector(`[data-index="${selectedIndex}"]`);
    if (!card) return;
    const selectedName = decodeURIComponent(card.dataset.name);
    onConfirm(selectedName);
  });
}