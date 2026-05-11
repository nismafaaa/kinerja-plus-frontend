/**
 * Recommendation card component with Accept / Edit / Reject actions.
 *
 * Each card has a unique ID based on fieldKey to manage state.
 */
import { getForecastRecommendations } from '../services/mockAiService.js';

/**
 * Render a single recommendation card.
 * @param {string} fieldKey - Unique key (e.g. 'uraianIndikator')
 * @param {object} data - { label, value, reasoning }
 * @param {number} index - Animation delay index
 */
export function renderRecommendationCard(fieldKey, data, index = 0) {
  const animDelay = index * 0.08;
  return `
    <div class="rec-card" id="rec-${fieldKey}" style="animation-delay: ${animDelay}s" data-field="${fieldKey}">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">AI</span>
          ${data.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-${fieldKey}">Rekomendasi AI</span>
      </div>
      <div class="rec-card__value" id="value-${fieldKey}">${data.value}</div>
      <div class="rec-card__reasoning">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${data.reasoning}</span>
      </div>
      <div class="rec-card__edit-area" id="edit-area-${fieldKey}" style="display:none;">
        <textarea id="edit-input-${fieldKey}">${data.value}</textarea>
      </div>
      <div class="rec-card__actions" id="actions-${fieldKey}">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${fieldKey}">
          Terima
        </button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${fieldKey}">
          Edit
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${fieldKey}">
          Tolak
        </button>
      </div>
    </div>
  `;
}

/**
 * Render the target period card with embedded forecasting sub-feature.
 */
export function renderTargetCard(data, index = 0) {
  const animDelay = index * 0.08;
  const gridItems = Object.entries(data.values)
    .map(
      ([year, val]) => `
      <div class="target-grid__item">
        <div class="target-grid__year">Target ${year}</div>
        <div class="target-grid__value">${val}</div>
      </div>
    `
    )
    .join('');

  return `
    <div class="rec-card" id="rec-targetPeriode" style="animation-delay: ${animDelay}s" data-field="targetPeriode">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">AI</span>
          ${data.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-targetPeriode">Rekomendasi AI</span>
      </div>
      <div class="target-grid" id="value-targetPeriode">
        ${gridItems}
      </div>
      <div class="rec-card__reasoning" style="margin-top: var(--space-md);">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${data.reasoning}</span>
      </div>
      <div class="rec-card__actions" id="actions-targetPeriode">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="targetPeriode">
          Terima Semua Target
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="targetPeriode">
          Tolak
        </button>
      </div>

      <!-- Forecast sub-feature -->
      <div class="forecast-section" id="forecast-section">
        <div class="forecast-section__toggle">
          <button class="btn btn--outline btn--sm" id="btn-toggle-forecast">
            Proyeksi dari Data Historis
          </button>
        </div>
        <div class="forecast-section__body" id="forecast-body" style="display:none;">
          <p class="input-group__hint" style="margin-bottom: var(--space-md);">
            Masukkan data target periode sebelumnya untuk mendapatkan proyeksi AI yang lebih akurat.
          </p>
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
          <button class="btn btn--ai btn--sm" id="btn-run-forecast" disabled>
            Proyeksikan Target
          </button>
          <div id="forecast-result" style="margin-top: var(--space-lg);"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize the forecast sub-feature inside the target card.
 * @param {string} tujuan - The tujuan/sasaran text from user input
 * @param {string} sasaran - The sasaran strategis text
 */
export function initForecastSection(tujuan, sasaran) {
  const toggleBtn = document.getElementById('btn-toggle-forecast');
  const body = document.getElementById('forecast-body');
  const yearStart = document.getElementById('fc-year-start');
  const yearEnd = document.getElementById('fc-year-end');
  const fieldsContainer = document.getElementById('fc-target-fields');
  const runBtn = document.getElementById('btn-run-forecast');
  const resultContainer = document.getElementById('forecast-result');

  if (!toggleBtn || !body) return;

  // Toggle visibility
  toggleBtn.addEventListener('click', () => {
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    toggleBtn.textContent = isHidden ? 'Sembunyikan Proyeksi' : 'Proyeksi dari Data Historis';
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

  // Run forecast
  runBtn.addEventListener('click', async () => {
    const start = parseInt(yearStart.value, 10);
    const end = parseInt(yearEnd.value, 10);
    const inputs = fieldsContainer.querySelectorAll('.fc-value-input');
    const previousTargets = Array.from(inputs).map((inp) => parseFloat(inp.value) || 0);

    const payload = {
      tujuan: tujuan,
      sasaran_strategis: sasaran,
      previous_period: `${start}-${end}`,
      previous_targets: previousTargets,
    };

    runBtn.disabled = true;
    runBtn.innerHTML = 'Menganalisis...';
    resultContainer.innerHTML = '<div class="skeleton skeleton-block" style="height:80px;"></div>';

    try {
      const result = await getForecastRecommendations(payload);
      resultContainer.innerHTML = renderForecastResult(result);
    } catch (err) {
      resultContainer.innerHTML = '<p class="input-group__hint" style="color:var(--color-danger);">Gagal memproyeksikan target.</p>';
    }

    runBtn.disabled = false;
    runBtn.innerHTML = 'Proyeksikan Target';
  });
}

/**
 * Render forecast result HTML.
 */
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
 * Manages accept/edit/reject state transitions.
 *
 * @param {object} recommendations - Full recommendation data
 * @param {function} onStateChange - Callback when any card changes state
 */
export function initCardActions(recommendations, onStateChange) {
  // Track state per field
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
      state[field].status = 'rejected';
      card.classList.add('rec-card--rejected');
      statusEl.className = 'rec-card__status';
      statusEl.textContent = 'Ditolak';

      actionsEl.innerHTML = `
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${field}">
          Kembalikan
        </button>
      `;

      showToast('Rekomendasi ditolak', 'info');
    }

    if (action === 'undo') {
      state[field].status = 'pending';
      card.classList.remove('rec-card--accepted', 'rec-card--rejected');
      statusEl.className = 'rec-card__status rec-card__status--pending';
      statusEl.textContent = 'Rekomendasi AI';

      const isTarget = field === 'targetPeriode';
      actionsEl.innerHTML = isTarget
        ? `
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">Terima Semua Target</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">Tolak</button>
        `
        : `
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">Terima</button>
          <button class="btn btn--outline btn--sm" data-action="edit" data-field="${field}">Edit</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">Tolak</button>
        `;
    }

    if (onStateChange) onStateChange(state);
  });

  return state;
}

/**
 * Show a temporary toast notification.
 */
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
