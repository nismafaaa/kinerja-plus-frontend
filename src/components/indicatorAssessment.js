import { renderAiSuggestionCard, initAiSuggestionCard } from './aiSuggestionCard.js';

const LEVEL_COLOR = {
  1: 'var(--color-danger)',
  2: 'var(--color-warning)',
  3: 'var(--color-primary)',
  4: 'var(--color-success)',
};

// The meter always shows 4 bars; `level` (1-4) from the backend maps
// directly to how many segments are filled.
const METER_SEGMENTS = 4;

const CRITERIA_TITLES = {
  specific: 'Specific (Spesifik)',
  measurable: 'Measurable (Terukur)',
  achievable: 'Achievable (Dapat Dicapai)',
  relevant: 'Relevant (Relevan)',
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Render the "Kesesuaian Indikator" block from a real
 * POST /api/v1/recommendations/smart-assessment response.
 *
 * @param {object} assessment - { level, label, overall_score, criteria, suggestion }
 */
function renderKesesuaianBlock(assessment) {
  const color = LEVEL_COLOR[assessment.level] || LEVEL_COLOR[1];
  const filled = assessment.level || 0;
  const segments = Array.from({ length: METER_SEGMENTS })
    .map(
      (_, i) => `
      <span class="kesesuaian-meter__segment${i < filled ? ' kesesuaian-meter__segment--filled' : ''}"
        style="${i < filled ? `background:${color};` : ''}"></span>
    `
    )
    .join('');

  const rows = Object.entries(assessment.criteria || {})
    .map(
      ([key, c]) => `
      <div class="smart-criteria-item${c.pass ? ' smart-criteria-item--pass' : ' smart-criteria-item--fail'}">
        <span class="smart-criteria-item__icon">${c.pass ? '✓' : '✕'}</span>
        <div class="smart-criteria-item__body">
          <div class="smart-criteria-item__title">${CRITERIA_TITLES[key] || key}</div>
          <div class="smart-criteria-item__note">${escapeHtml(c.reason)}</div>
        </div>
      </div>
    `
    )
    .join('');

  return `
    <div class="kesesuaian-row">
      <span class="kesesuaian-row__label">Kesesuaian Indikator: <span style="color:${color};">${assessment.label}</span></span>
      <div class="kesesuaian-meter">
        <div class="kesesuaian-meter__track">${segments}</div>
        <span class="kesesuaian-meter__caption" style="color:${color};">${assessment.label}</span>
      </div>
    </div>
    <details class="smart-details">
      <summary>Lihat rincian penilaian SMART</summary>
      <div class="smart-criteria-list">${rows}</div>
      ${assessment.suggestion ? `
        <div class="rec-card__reasoning" style="margin-top:var(--space-sm);">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${escapeHtml(assessment.suggestion)}</span>
        </div>
      ` : ''}
    </details>
  `;
}

function renderKesesuaianLoading() {
  return `
    <div class="skeleton skeleton-line--medium" style="height:12px;margin-bottom:var(--space-md);"></div>
    <div class="skeleton skeleton-block" style="height:56px;"></div>
  `;
}

function renderKesesuaianError(message) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">!</div>
      <div class="empty-state__text">Gagal menilai kesesuaian SMART: ${escapeHtml(message)}</div>
    </div>
  `;
}

function renderKesesuaianEmpty() {
  // Same meter/row layout as a real result, but with every segment inactive
  // (no `--filled` class, no color) and a muted "Belum dinilai" caption.
  const segments = Array.from({ length: METER_SEGMENTS })
    .map(() => '<span class="kesesuaian-meter__segment"></span>')
    .join('');

  return `
    <div class="kesesuaian-row">
      <span class="kesesuaian-row__label">Kesesuaian Indikator: <span style="color:var(--color-text-muted);">Belum dinilai</span></span>
      <div class="kesesuaian-meter">
        <div class="kesesuaian-meter__track">${segments}</div>
        <span class="kesesuaian-meter__caption" style="color:var(--color-text-muted);">Belum dinilai</span>
      </div>
    </div>
    <p class="input-group__hint" style="margin-top:var(--space-sm);margin-bottom:0;">
      Klik "Nilai Kesesuaian SMART" untuk menilai indikator pada kolom Uraian Indikator di atas.
    </p>
  `;
}

/**
 * Update the "Kesesuaian Indikator" block for a given namespace to a
 * loading state, an error state, an empty/stale-cleared state, or a
 * rendered assessment.
 */
export function setKesesuaianLoading(namespace) {
  const el = document.getElementById(`kesesuaian-block-${namespace}`);
  if (el) el.innerHTML = renderKesesuaianLoading();
}

export function setKesesuaianEmpty(namespace) {
  const el = document.getElementById(`kesesuaian-block-${namespace}`);
  if (el) el.innerHTML = renderKesesuaianEmpty();
}

export function setKesesuaianError(namespace, message) {
  const el = document.getElementById(`kesesuaian-block-${namespace}`);
  if (el) el.innerHTML = renderKesesuaianError(message);
}

export function setKesesuaianResult(namespace, assessment) {
  const el = document.getElementById(`kesesuaian-block-${namespace}`);
  if (el) el.innerHTML = renderKesesuaianBlock(assessment);
}

/**
 * Render the editable "Uraian Indikator" field together with a compact
 * SMART/"Kesesuaian Indikator" meter (empty until the user asks for an
 * assessment) and the AI recommendation reference row + reasoning.
 *
 * The field itself starts empty — the AI recommendation is only a
 * reference shown below it until the user clicks "Gunakan" (or types
 * their own text). The SMART evaluation has no source of its own: it is
 * always generated from whatever text is currently in this field, and
 * starts empty because the field itself starts empty.
 *
 * @param {string} recommendedText - the single AI-recommended indicator
 * @param {string} reasoning - why the AI recommended this indicator (Step 1)
 * @param {string} label - entity label (e.g. 'Tujuan')
 * @param {string} namespace - unique id suffix for this page (entity type)
 */
export function renderIndicatorAssessment(recommendedText, reasoning, label, namespace) {
  const n = namespace;

  return `
    <div class="indicator-assessment" id="indicator-assessment-${n}">
      <div class="input-group">
        <label class="input-group__label" for="indicator-input-${n}">Uraian Indikator ${label}</label>
        <textarea id="indicator-input-${n}" placeholder="Ketik indikator ${label.toLowerCase()} Anda, atau gunakan rekomendasi AI di bawah"></textarea>
      </div>

      <div id="kesesuaian-block-${n}">
        ${renderKesesuaianEmpty()}
      </div>

      <div id="ai-suggestion-block-${n}">
        ${renderAiSuggestionCard(recommendedText, `indicator-${n}`)}
        ${reasoning ? `
          <div class="rec-card__reasoning" style="margin-top:var(--space-sm);">
            <span class="rec-card__reasoning-icon">i</span>
            <span>${escapeHtml(reasoning)}</span>
          </div>
        ` : ''}
      </div>

      <div class="indicator-assessment__actions">
        <button class="btn btn--outline" id="btn-evaluate-smart-${n}">
          Nilai Kesesuaian SMART
        </button>
        <button class="btn btn--ai" id="btn-next-${n}">
          Lanjutkan ke Metadata
        </button>
      </div>
    </div>
  `;
}

/**
 * Wire up interactions for the Uraian Indikator field: "Gunakan" to fill it
 * with the AI recommendation, "Nilai Kesesuaian SMART" to run the SMART
 * assessment for whatever text is currently in the field (the field is the
 * only source of truth — there is no separate assessment for the AI
 * recommendation), and "Lanjutkan ke Metadata" to move on to the metadata
 * page using the final indicator text.
 *
 * @param {object} opts
 * @param {string} opts.namespace
 * @param {string} opts.recommendedText
 * @param {function(currentText: string): void} [opts.onIndicatorEdited] -
 *   called whenever the indicator field's raw text changes. Used to clear a
 *   now-stale SMART result when it no longer matches the field's text.
 * @param {function(finalText: string): void} opts.onEvaluateSmart
 * @param {function(finalText: string): void} opts.onNext
 */
export function initIndicatorAssessment({ namespace, recommendedText, onIndicatorEdited, onEvaluateSmart, onNext }) {
  const n = namespace;
  const textarea = document.getElementById(`indicator-input-${n}`);
  const evaluateBtn = document.getElementById(`btn-evaluate-smart-${n}`);
  const nextBtn = document.getElementById(`btn-next-${n}`);

  if (!textarea || !evaluateBtn || !nextBtn) return;

  initAiSuggestionCard({
    idSuffix: `indicator-${n}`,
    recommendedText,
    targetTextarea: textarea,
  });

  textarea.addEventListener('input', () => {
    onIndicatorEdited?.(textarea.value.trim());
  });

  evaluateBtn.addEventListener('click', () => {
    const finalText = textarea.value.trim();
    if (!finalText) return;
    onEvaluateSmart(finalText);
  });

  nextBtn.addEventListener('click', () => {
    let finalText = textarea.value.trim();
    if (!finalText) {
      // Accepting the AI recommendation implicitly: populate the field so
      // it remains the single source of truth for the chosen indicator.
      finalText = recommendedText;
      textarea.value = recommendedText;
    }
    if (!finalText) return;
    onNext(finalText);
  });
}

export function renderSkeletonAssessment() {
  return `
    <div class="indicator-assessment">
      <div class="input-group">
        <div class="skeleton skeleton-block" style="height:90px;"></div>
      </div>
      <div class="skeleton skeleton-line--medium" style="height:12px;margin-bottom:var(--space-md);"></div>
      <div class="skeleton skeleton-block" style="height:56px;"></div>
    </div>
  `;
}
