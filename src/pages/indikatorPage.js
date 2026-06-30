import { renderHeader } from '../components/header.js';
import { renderSkeletonCards } from '../components/skeletonLoader.js';
import {
  renderIndicatorOptions,
  initIndicatorSelector,
} from '../components/indicatorSelector.js';
import {
  renderRecommendationCard,
  renderForecastSection,
  initCardActions,
  initForecastSection,
} from '../components/recommendationCard.js';
import { getIndicatorOptions, getRecommendations } from '../services/apiClient.js';
import { FIELD_ORDER } from '../config/entities.js';

/**
 * Render the full HTML for a planning entity indikator page.
 *
 * @param {import('../config/entities.js').EntityConfig} config
 * @returns {string} HTML string
 */
export function renderIndikatorPage(config) {
  const t = config.type; // namespace shorthand for element IDs
  return `
    ${renderHeader(config.pageTitle, config.pageSubtitle)}
    <div class="page-body">

      <!-- STEP 1: Entity Input -->
      <div class="step-section" id="step-1-${t}">
        <div class="step-label">
          <span class="step-number">1</span>
          Masukkan ${config.inputLabel}
        </div>
        <div class="input-group">
          <label class="input-group__label" for="input-${t}">${config.inputLabel}</label>
          <p class="input-group__hint">
            Ketik ${config.inputLabel.toLowerCase()} yang ingin Anda analisis. AI akan menghasilkan
            beberapa opsi <strong>Indikator ${config.label}</strong> yang relevan dan terukur untuk Anda pilih.
          </p>
          <textarea
            id="input-${t}"
            placeholder="${config.inputPlaceholder}"
          ></textarea>
        </div>
        <button class="btn btn--ai" id="btn-generate-${t}" disabled>
          Generate Indikator ${config.label}
        </button>
      </div>

      <!-- STEP 2: Select Indicator Option -->
      <div class="step-section" id="step-2-${t}" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Pilih Indikator ${config.label}
        </div>
        <p class="input-group__hint step-hint">
          AI menghasilkan beberapa opsi <strong>Indikator ${config.label}</strong> berdasarkan
          ${config.inputLabel.toLowerCase()} Anda. Pilih satu indikator yang paling relevan untuk dilanjutkan.
        </p>
        <div id="indicator-options-container-${t}"></div>
      </div>

      <!-- STEP 3: Metadata Generation -->
      <div class="step-section" id="step-3-${t}" style="display:none;">
        <div class="step-label">
          <span class="step-number">3</span>
          Tinjau &amp; Edit Metadata Indikator
        </div>
        <div class="selected-indicator-banner" id="selected-banner-${t}"></div>
        <p class="input-group__hint step-hint">
          AI telah menghasilkan metadata lengkap untuk indikator terpilih.
          Anda dapat <strong>menerima</strong>, <strong>mengedit</strong>, atau <strong>menolak</strong> setiap field.
        </p>
        <div id="recs-container-${t}"></div>
      </div>

    </div>
  `;
}

/**
 * Attach all event listeners for a planning entity indikator page.
 *
 * @param {import('../config/entities.js').EntityConfig} config
 */
export function initIndikatorPage(config) {
  const t = config.type;

  const input = document.getElementById(`input-${t}`);
  const btn = document.getElementById(`btn-generate-${t}`);
  const step2 = document.getElementById(`step-2-${t}`);
  const step3 = document.getElementById(`step-3-${t}`);
  const optionsContainer = document.getElementById(`indicator-options-container-${t}`);
  const recsContainer = document.getElementById(`recs-container-${t}`);
  const selectedBanner = document.getElementById(`selected-banner-${t}`);

  if (!input || !btn) return;

  let currentInputText = '';
  let currentSelectedIndicator = '';

  // Enable/disable generate button based on minimum text length
  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < 5;
  });

  // ─── Step 1 → Step 2: generate indicator candidates ──────────────────────
  async function generateOptions() {
    currentInputText = input.value.trim();
    if (!currentInputText) return;

    step2.style.display = 'block';
    step3.style.display = 'none';
    optionsContainer.innerHTML = renderSkeletonIndicators(4);
    btn.disabled = true;
    btn.innerHTML = 'Menganalisis...';

    step2.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const options = await getIndicatorOptions(config.type, currentInputText);
      optionsContainer.innerHTML = renderIndicatorOptions(options, config.label);
      initIndicatorSelector((selectedName) => generateMetadata(selectedName));
    } catch (err) {
      optionsContainer.innerHTML = errorState(err.message);
    }

    btn.disabled = false;
    btn.innerHTML = `Generate Indikator ${config.label}`;
  }

  btn.addEventListener('click', generateOptions);

  // ─── Step 2 → Step 3: generate full metadata ─────────────────────────────
  async function generateMetadata(selectedName) {
    currentSelectedIndicator = selectedName;
    step3.style.display = 'block';

    selectedBanner.innerHTML = `
      <div class="selected-indicator-banner__icon">✓</div>
      <div class="selected-indicator-banner__content">
        <div class="selected-indicator-banner__title">Indikator Terpilih</div>
        <div class="selected-indicator-banner__value">${selectedName}</div>
      </div>
      <button class="btn btn--outline btn--sm" id="btn-change-indicator-${t}">Ganti Indikator</button>
    `;

    recsContainer.innerHTML = renderSkeletonCards(8);
    step3.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById(`btn-change-indicator-${t}`)?.addEventListener('click', () => {
      step3.style.display = 'none';
      step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    try {
      const recs = await getRecommendations(config.type, currentInputText, selectedName);

      let html = '';
      FIELD_ORDER.forEach((key, i) => {
        if (recs[key]) {
          html += renderRecommendationCard(key, recs[key], i, {
            readOnly: key === 'uraianIndikator',
          });
        }
      });

      recsContainer.innerHTML = `
        <div class="recs-section">
          <div class="recs-section__title">Metadata Indikator ${config.label}</div>
          ${html}
        </div>
        ${renderForecastSection()}
      `;

      const regenCounters = {};

      initCardActions(recs, null, async (fieldKey) => {
        regenCounters[fieldKey] = (regenCounters[fieldKey] || 0) + 1;
        const variantIndicator = `${currentSelectedIndicator} - variasi ${regenCounters[fieldKey]}`;
        const freshRecs = await getRecommendations(config.type, currentInputText, variantIndicator);
        if (!freshRecs[fieldKey]) throw new Error('Field tidak ditemukan dalam respons API');
        return freshRecs[fieldKey];
      });

      // Pass forecastContextKey so the forecast section builds the correct payload
      initForecastSection(config.forecastContextKey, currentInputText);
    } catch (err) {
      recsContainer.innerHTML = errorState(err.message);
    }
  }
}

// ─── Private helpers ────────────────────────────────────────────────────────

function renderSkeletonIndicators(count = 4) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card indicator-option-skeleton" style="animation-delay:${i * 0.1}s">
        <div class="skeleton skeleton-line--short" style="height:14px;margin-bottom:12px;"></div>
        <div class="skeleton skeleton-line--full" style="height:12px;margin-bottom:8px;"></div>
        <div class="skeleton skeleton-line--medium" style="height:12px;"></div>
      </div>
    `;
  }
  return `<div class="indicator-options-grid">${html}</div>`;
}

function errorState(message) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">!</div>
      <div class="empty-state__text">Gagal memuat: ${message}</div>
    </div>
  `;
}
