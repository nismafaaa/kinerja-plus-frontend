import { getForecastRecommendations } from '../services/apiClient.js';
import { AI_TIP_TEXT } from '../config/uiCopy.js';

const TARGET_YEARS = [2021, 2022, 2023, 2024, 2025];

/**
 * Render a single recommendation card.
 * @param {string} fieldKey - Unique key (e.g. 'uraianIndikator')
 * @param {object} data - { label, value, reasoning }
 * @param {number} index - Animation delay index
 * @param {object} [options] - Optional flags
 * @param {boolean} [options.readOnly] - If true, hides edit/accept/reject actions
 */
export function renderRecommendationCard(fieldKey, data, index = 0, options = {}) {
  const { readOnly = false } = options;
  const animDelay = index * 0.08;
  return `
    <div class="rec-card${readOnly ? ' rec-card--readonly' : ''}" id="rec-${fieldKey}" style="animation-delay: ${animDelay}s" data-field="${fieldKey}">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">AI</span>
          ${data.label}
        </div>
        <span class="rec-card__status ${readOnly ? 'rec-card__status--accepted' : 'rec-card__status--pending'}" id="status-${fieldKey}">${readOnly ? 'Terpilih' : 'Rekomendasi AI'}</span>
      </div>
      <div class="rec-card__value" id="value-${fieldKey}">${data.value}</div>
      ${!readOnly ? `
        <div class="rec-card__reasoning">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${data.reasoning}</span>
        </div>
        <div class="rec-card__edit-area" id="edit-area-${fieldKey}" style="display:none;">
          <textarea id="edit-input-${fieldKey}">${data.value}</textarea>
        </div>
        <div class="rec-card__actions" id="actions-${fieldKey}">
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${fieldKey}">Terima</button>
          <button class="btn btn--outline btn--sm" data-action="edit" data-field="${fieldKey}">Edit</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${fieldKey}">Tolak</button>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderForecastSection() {
  const fieldsHtml = TARGET_YEARS.map(
    (year) => `
      <div class="target-field-item">
        <label class="target-field-label" for="fc-val-${year}">Target ${year}</label>
        <input type="number" id="fc-val-${year}" class="forecast-input fc-value-input"
               placeholder="0" step="0.01" data-year="${year}" />
      </div>
    `
  ).join('');

  return `
    <div class="forecast-section" id="forecast-section">
      <div class="recs-section__title">Target</div>

      <div class="target-fields" id="fc-target-fields">${fieldsHtml}</div>

      <button class="btn btn--ai btn--sm" id="btn-run-forecast" disabled>
        Hitung Proyeksi Target
      </button>

      <div id="forecast-ai-preview" style="display:none;margin-top:var(--space-lg);">
        <div class="ai-forecast-card">
          <div class="ai-forecast-card__icon">Ai<span class="ai-forecast-card__icon-sparkle">✦</span></div>
          <div class="ai-forecast-card__info">
            <div class="ai-forecast-card__title-row">
              <span class="ai-forecast-card__title">Rekomendasi AI</span>
              <span class="badge-beta">Beta</span>
            </div>
            <div class="ai-forecast-card__desc" id="forecast-ai-desc"></div>
          </div>
          <div class="ai-forecast-card__divider"></div>
          <div class="ai-forecast-card__tiles" id="forecast-ai-tiles"></div>
        </div>

        <div id="forecast-ai-detail" class="forecast-ai-detail"></div>

        <div class="ai-tip-row">
          <span class="ai-tip-row__icon">💡</span>
          <span><span class="ai-tip-row__label">Tips AI:</span> ${AI_TIP_TEXT}</span>
        </div>
      </div>

      <div id="forecast-result" style="margin-top: var(--space-lg);"></div>
    </div>
  `;
}

/**
 * Initialize the forecast sub-feature inside the target card. The Target
 * fields are always visible; the "Hitung Proyeksi Target" button sits right
 * below them and stays disabled until every year field is filled in. On
 * click it shows a loading skeleton in the "Rekomendasi AI (Beta)" card while
 * the real forecast API call resolves, then fills in the result panel below it.
 *
 * @param {string} forecastContextKey - The exact field key to send to POST /api/v1/forecast.
 *   Must be one of: 'tujuan' | 'sasaran_strategis' | 'program' | 'kegiatan' | 'sub_kegiatan'.
 *   Comes from EntityConfig.forecastContextKey.
 * @param {string} value - The user's input text (the planning entity statement)
 */
export function initForecastSection(forecastContextKey, value) {
  const fieldsContainer = document.getElementById('fc-target-fields');
  const runBtn = document.getElementById('btn-run-forecast');
  const aiPreview = document.getElementById('forecast-ai-preview');
  const descEl = document.getElementById('forecast-ai-desc');
  const tilesEl = document.getElementById('forecast-ai-tiles');
  const detailEl = document.getElementById('forecast-ai-detail');
  const resultContainer = document.getElementById('forecast-result');

  if (!fieldsContainer || !runBtn) return;

  function validateForecast() {
    const inputs = fieldsContainer.querySelectorAll('.fc-value-input');
    const allFilled = inputs.length > 0 && Array.from(inputs).every((inp) => inp.value.trim() !== '');
    runBtn.disabled = !allFilled;
  }

  fieldsContainer.addEventListener('input', validateForecast);

  runBtn.addEventListener('click', async () => {
    const inputs = fieldsContainer.querySelectorAll('.fc-value-input');
    const previousTargets = Array.from(inputs).map((inp) => parseFloat(inp.value) || 0);

    aiPreview.style.display = 'block';
    descEl.innerHTML = '<span class="skeleton skeleton-line--medium" style="display:inline-block;height:14px;width:70%;"></span>';
    tilesEl.innerHTML = '<div class="skeleton skeleton-block" style="height:56px;width:100%;"></div>';
    detailEl.innerHTML = '';

    const payload = {
      previous_period: `${TARGET_YEARS[0]}-${TARGET_YEARS[TARGET_YEARS.length - 1]}`,
      previous_targets: previousTargets,
    };
    // Dynamically set the context field — supports all 5 entity types:
    // tujuan | sasaran_strategis | program | kegiatan | sub_kegiatan
    payload[forecastContextKey] = value;

    runBtn.disabled = true;
    runBtn.innerHTML = 'Menganalisis...';
    resultContainer.innerHTML = '';

    try {
      const result = await getForecastRecommendations(payload);
      applyRealForecastResult(result, { descEl, tilesEl, detailEl });
    } catch (err) {
      resultContainer.innerHTML = `<p class="input-group__hint" style="color:var(--color-danger);">Gagal memproyeksikan target: ${err.message}</p>`;
    }

    runBtn.disabled = false;
    runBtn.innerHTML = 'Hitung Proyeksi Target';
  });
}

/**
 * Fold the real /api/v1/forecast response into the "Rekomendasi AI" card in
 * place — filling in the projected years, and adding the growth stats +
 * reasoning underneath it.
 */
function applyRealForecastResult(result, { descEl, tilesEl, detailEl }) {
  const { previousPeriod, forecastedPeriod, trendAnalysis } = result;
  // Output/projection section always shows at most as many boxes as the
  // Target input section (TARGET_YEARS.length), even if the API returns more.
  const forecastEntries = Object.entries(forecastedPeriod.values).slice(0, TARGET_YEARS.length);

  if (descEl) {
    descEl.innerHTML = `Berdasarkan ${previousPeriod.label || 'tren data historis'},<br>AI memproyeksikan target ${forecastEntries.length} tahun ke depan`;
  }

  if (tilesEl) {
    tilesEl.innerHTML = forecastEntries
      .map(
        ([year, val]) => `
        <div class="forecast-tile">
          <div class="forecast-tile__year">${year}</div>
          <div class="forecast-tile__value">${val}</div>
        </div>
      `
      )
      .join('');
  }

  if (detailEl) {
    detailEl.innerHTML = `
      <div class="forecast-trend-stats">
        <div class="forecast-stat">
          <span class="forecast-stat__label">Rata-rata/Tahun</span>
          <span class="forecast-stat__value">${trendAnalysis.avgGrowthPerYear}</span>
        </div>
        <div class="forecast-stat">
          <span class="forecast-stat__label">Total Pertumbuhan</span>
          <span class="forecast-stat__value">${trendAnalysis.totalGrowth}</span>
        </div>
        <div class="forecast-stat">
          <span class="forecast-stat__label">Tren</span>
          <span class="forecast-stat__value">${trendAnalysis.direction}</span>
        </div>
      </div>
      <div class="rec-card__reasoning">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${trendAnalysis.reasoning}</span>
      </div>
      <div class="rec-card__reasoning">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${forecastedPeriod.reasoning}</span>
      </div>
    `;
  }
}

/**
 * Initialize action button handlers for all recommendation cards.
 * Manages accept / edit / reject-and-regenerate state transitions.
 *
 * @param {object} recommendations - Full recommendation data
 * @param {function|null} onStateChange - Callback when any card changes state
 * @param {function(fieldKey: string): Promise<object>} onRegenerate
 *   Called when the user rejects a field. Must return a Promise that resolves
 *   to a fresh { label, value, reasoning } object for that field.
 */
export function initCardActions(recommendations, onStateChange, onRegenerate) {
  const state = {};
  const fieldKeys = Object.keys(recommendations);
  fieldKeys.forEach((key) => {
    state[key] = { status: 'pending', value: recommendations[key].value || '' };
  });

  document.addEventListener('click', function handler(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const field = btn.dataset.field;
    if (!field || !state[field]) return;

    const card = document.getElementById(`rec-${field}`);
    const statusEl = document.getElementById(`status-${field}`);
    const actionsEl = document.getElementById(`actions-${field}`);
    const editArea = document.getElementById(`edit-area-${field}`);
    const valueEl = document.getElementById(`value-${field}`);

    if (action === 'accept') {
      if (state[field].status === 'editing' && editArea) {
        const editInput = document.getElementById(`edit-input-${field}`);
        if (editInput) {
          state[field].value = editInput.value;
          if (valueEl) valueEl.textContent = editInput.value;
        }
        editArea.style.display = 'none';
      }

      state[field].status = 'accepted';
      card.classList.remove('rec-card--rejected');
      card.classList.add('rec-card--accepted');
      statusEl.className = 'rec-card__status rec-card__status--accepted';
      statusEl.textContent = 'Diterima';

      actionsEl.innerHTML = `
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${field}">
          Batalkan
        </button>
      `;

      showToast('Rekomendasi diterima', 'success');
    }

    if (action === 'edit') {
      state[field].status = 'editing';
      statusEl.className = 'rec-card__status rec-card__status--editing';
      statusEl.textContent = 'Sedang Diedit';

      if (editArea) editArea.style.display = 'block';

      actionsEl.innerHTML = `
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">
          Simpan
        </button>
        <button class="btn btn--outline btn--sm" data-action="cancel-edit" data-field="${field}">
          Batal
        </button>
      `;
    }

    if (action === 'cancel-edit') {
      state[field].status = 'pending';
      statusEl.className = 'rec-card__status rec-card__status--pending';
      statusEl.textContent = 'Rekomendasi AI';

      if (editArea) editArea.style.display = 'none';

      actionsEl.innerHTML = `
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">Terima</button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${field}">Edit</button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">Tolak</button>
      `;
    }

    if (action === 'reject') {
      card.classList.remove('rec-card--accepted', 'rec-card--rejected');
      card.style.pointerEvents = 'none';
      card.innerHTML = `
        <div class="rec-card__header">
          <div class="rec-card__label">
            <span class="rec-card__ai-icon">AI</span>
            ${recommendations[field]?.label || field}
          </div>
          <span class="rec-card__status rec-card__status--pending">Memperbarui...</span>
        </div>
        <div class="skeleton skeleton-block" style="height:56px;margin-bottom:var(--space-md);"></div>
        <div class="skeleton skeleton-line--medium" style="height:12px;margin-bottom:var(--space-lg);"></div>
        <div class="skeleton-actions">
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
        </div>
      `;

      if (onRegenerate) {
        onRegenerate(field)
          .then((newData) => {
            state[field] = { status: 'pending', value: newData.value || '' };
            const temp = document.createElement('div');
            temp.innerHTML = renderRecommendationCard(field, newData, 0);
            const newCard = temp.firstElementChild;
            card.replaceWith(newCard);
            showToast('Rekomendasi diperbarui', 'success');
          })
          .catch((err) => {
            const originalData = recommendations[field];
            card.innerHTML = `
              <div class="rec-card__header">
                <div class="rec-card__label">
                  <span class="rec-card__ai-icon">AI</span>
                  ${originalData?.label || field}
                </div>
                <span class="rec-card__status rec-card__status--pending" id="status-${field}">Rekomendasi AI</span>
              </div>
              <div class="rec-card__value" id="value-${field}">${state[field].value}</div>
              <div class="rec-card__reasoning">
                <span class="rec-card__reasoning-icon">i</span>
                <span>Gagal memperbarui: ${err.message}. Silakan coba tolak kembali.</span>
              </div>
              <div class="rec-card__actions" id="actions-${field}">
                <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">Terima</button>
                <button class="btn btn--outline btn--sm" data-action="edit" data-field="${field}">Edit</button>
                <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">Tolak</button>
              </div>
            `;
            card.style.pointerEvents = 'auto';
            showToast('Gagal memperbarui rekomendasi', 'error');
          });
      }
    }

    if (action === 'undo') {
      state[field].status = 'pending';
      card.classList.remove('rec-card--accepted', 'rec-card--rejected');
      statusEl.className = 'rec-card__status rec-card__status--pending';
      statusEl.textContent = 'Rekomendasi AI';

      actionsEl.innerHTML = `
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">Terima</button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${field}">Edit</button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">Tolak</button>
      `;
    }

    if (onStateChange) onStateChange(state);
  });

  return state;
}

export function showToast(message, type = 'info') {
  document.querySelectorAll('.toast').forEach((t) => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}