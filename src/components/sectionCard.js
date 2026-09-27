/**
 * Generalizes the .step-section / .step-label / .step-number markup that
 * indikatorPage.js previously duplicated per-step, since MenRis needs the
 * same wrapper 11 times. Adds an optional header-right AI-trigger button.
 *
 * @param {number} number
 * @param {string} title
 * @param {string} subtitle
 * @param {string} bodyHtml
 * @param {{id?:string, ai?:{id:string,label:string}}} [opts]
 */
export function renderSectionCard(number, title, subtitle, bodyHtml, opts = {}) {
  const { id = `seksi-${number}`, ai } = opts;

  return `
    <div class="step-section section-card" id="${id}">
      <div class="section-card__header">
        <div class="step-label section-card__title-block">
          <span class="step-number">${number}</span>
          <div>
            <div class="section-card__title">${title}</div>
            ${subtitle ? `<p class="section-card__subtitle">${subtitle}</p>` : ''}
          </div>
        </div>
        ${ai ? `
          <button class="btn btn--ai btn--sm section-card__ai-trigger" id="${ai.id}" type="button">
            ${ai.label}
          </button>
        ` : ''}
      </div>
      <div class="section-card__body">${bodyHtml}</div>
    </div>
  `;
}

/**
 * Shared inline error state, promoted out of indikatorPage.js's private
 * helper now that multiple MenRis sections need the same fetch-error markup.
 */
export function errorState(message) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">!</div>
      <div class="empty-state__text">Gagal memuat: ${message}</div>
    </div>
  `;
}
