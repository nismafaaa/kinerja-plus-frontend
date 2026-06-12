import { getForecastRecommendations } from '../services/apiClient.js';

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
  return `
    <div class="forecast-section" id="forecast-section">
      <!-- CTA Card -->
      <div class="forecast-cta" id="forecast-cta">
        <div class="forecast-cta__icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div class="forecast-cta__text">
          <div class="forecast-cta__title">Proyeksi Target dari Data Historis</div>
          <div class="forecast-cta__desc">Masukkan data historis untuk mendapatkan proyeksi target menggunakan metode Holt's Linear Trend secara deterministik.</div>
        </div>
        <button class="btn btn--forecast" id="btn-toggle-forecast">
          Hitung Proyeksi
        </button>
      </div>

      <!-- Expandable body -->
      <div class="forecast-section__body" id="forecast-body" style="display:none;">
        <div class="forecast-period-row">
          <div class="input-group forecast-period-field">
            <label class="input-group__label" for="fc-year-start">Tahun Awal</label>
            <input type="number" id="fc-year-start" class="forecast-input" value="2021" min="2000" max="2099" />
          </div>
          <span class="forecast-period-separator">&ndash;</span>
          <div class="input-group forecast-period-field">
            <label class="input-group__label" for="fc-year-end">Tahun Akhir</label>
            <input type="number" id="fc-year-end" class="forecast-input" value="2025" min="2000" max="2099" />
          </div>
        </div>
        <div class="input-group">
          <label class="input-group__label">Target per Tahun</label>
          <div id="fc-target-fields" class="target-fields"></div>
        </div>
        <button class="btn btn--ai btn--sm" id="btn-run-forecast" disabled style="margin-top: var(--space-md);">
          Hitung Proyeksi Target
        </button>
        <div id="forecast-result" style="margin-top: var(--space-lg);"></div>
      </div>
    </div>
  `;
}

/**
 * Initialize the forecast sub-feature inside the target card.
 * @param {'tujuan' | 'sasaran'} type - Which page is calling
 * @param {string} value - The user's input text
 */
export function initForecastSection(type, value) {
  const toggleBtn = document.getElementById('btn-toggle-forecast');
  const body = document.getElementById('forecast-body');
  const yearStart = document.getElementById('fc-year-start');
  const yearEnd = document.getElementById('fc-year-end');
  const fieldsContainer = document.getElementById('fc-target-fields');
  const runBtn = document.getElementById('btn-run-forecast');
  const resultContainer = document.getElementById('forecast-result');

  if (!toggleBtn || !body) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    toggleBtn.textContent = isHidden ? 'Sembunyikan Proyeksi Target' : 'Tampilkan Proyeksi Target dari Data Historis';
    if (isHidden) renderFields();
  });

  function renderFields() {
    const start = parseInt(yearStart.value, 10) || 2021;
    const end = parseInt(yearEnd.value, 10) || 2025;
    const count = Math.max(0, Math.min(end - start + 1, 20));
    let html = '';
    for (let i = 0; i < count; i++) {
      const year = start + i;
      html += `
        <div class="target-field-item">
          <label class="target-field-label" for="fc-val-${year}">${year}</label>
          <input type="number" id="fc-val-${year}" class="forecast-input fc-value-input"
                 placeholder="0" step="0.01" data-year="${year}" />
        </div>
      `;
    }
    fieldsContainer.innerHTML = html;
    validateForecast();
  }

  function validateForecast() {
    const inputs = fieldsContainer.querySelectorAll('.fc-value-input');
    const allFilled = inputs.length > 0 && Array.from(inputs).every((inp) => inp.value.trim() !== '');
    runBtn.disabled = !allFilled;
  }

  yearStart.addEventListener('change', renderFields);
  yearEnd.addEventListener('change', renderFields);
  fieldsContainer.addEventListener('input', validateForecast);

  runBtn.addEventListener('click', async () => {
    const start = parseInt(yearStart.value, 10);
    const end = parseInt(yearEnd.value, 10);
    const inputs = fieldsContainer.querySelectorAll('.fc-value-input');
    const previousTargets = Array.from(inputs).map((inp) => parseFloat(inp.value) || 0);

    const payload = {
      previous_period: `${start}-${end}`,
      previous_targets: previousTargets,
    };
    if (type === 'tujuan') {
      payload.tujuan = value;
    } else {
      payload.sasaran_strategis = value;
    }

    runBtn.disabled = true;
    runBtn.innerHTML = 'Menganalisis...';
    resultContainer.innerHTML = '<div class="skeleton skeleton-block" style="height:80px;"></div>';

    try {
      const result = await getForecastRecommendations(payload);
      resultContainer.innerHTML = renderForecastResult(result);
    } catch (err) {
      resultContainer.innerHTML = `<p class="input-group__hint" style="color:var(--color-danger);">Gagal memproyeksikan target: ${err.message}</p>`;
    }

    runBtn.disabled = false;
    runBtn.innerHTML = 'Proyeksikan Target';
  });
}

function renderForecastResult(result) {
  const { previousPeriod, forecastedPeriod, trendAnalysis } = result;

  const prevGrid = Object.entries(previousPeriod.values)
    .map(([year, val]) => `
      <div class="target-grid__item">
        <div class="target-grid__year">${year}</div>
        <div class="target-grid__value">${val}</div>
      </div>`)
    .join('');

  const forecastGrid = Object.entries(forecastedPeriod.values)
    .map(([year, val]) => `
      <div class="target-grid__item target-grid__item--forecast">
        <div class="target-grid__year">${year}</div>
        <div class="target-grid__value">${val}</div>
      </div>`)
    .join('');

  return `
    <div class="forecast-result-panel">
      <!-- Trend stats -->
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
      <div class="rec-card__reasoning" style="margin-bottom: var(--space-md);">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${trendAnalysis.reasoning}</span>
      </div>

      <!-- Previous period -->
      <p class="input-group__label" style="margin-bottom: var(--space-sm);">${previousPeriod.label}</p>
      <div class="target-grid" style="margin-bottom: var(--space-lg);">${prevGrid}</div>

      <!-- Forecasted period -->
      <p class="input-group__label" style="margin-bottom: var(--space-sm);">${forecastedPeriod.label}</p>
      <div class="target-grid" style="margin-bottom: var(--space-md);">${forecastGrid}</div>
      <div class="rec-card__reasoning">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${forecastedPeriod.reasoning}</span>
      </div>
    </div>
  `;
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

function showToast(message, type = 'info') {
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