import { renderHeader } from '../components/header.js';
import { renderSkeletonCards } from '../components/skeletonLoader.js';
import {
  renderIndicatorAssessment,
  initIndicatorAssessment,
  renderSkeletonAssessment,
  setKesesuaianLoading,
  setKesesuaianError,
  setKesesuaianResult,
} from '../components/indicatorAssessment.js';
import {
  renderRecommendationCard,
  renderForecastSection,
  initCardActions,
  initForecastSection,
} from '../components/recommendationCard.js';
import { renderAiAssistedField, initAiAssistedField } from '../components/aiAssistedField.js';
import {
  getIndicatorRecommendation,
  getSmartAssessment,
  getIndicatorDetails,
} from '../services/apiClient.js';
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
            Ketik ${config.inputLabel.toLowerCase()} yang ingin Anda analisis. AI akan menyusun
            rekomendasi <strong>Indikator ${config.label}</strong> yang relevan dan terukur untuk Anda tinjau.
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

      <!-- STEP 2: Indicator + full metadata, all visible at once -->
      <div class="step-section" id="step-2-${t}" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Lengkapi Metadata Indikator ${config.label}
        </div>
        <p class="input-group__hint step-hint">
          AI menyusun satu rekomendasi <strong>Indikator ${config.label}</strong> berdasarkan
          ${config.inputLabel.toLowerCase()} Anda. Terima, sesuaikan, atau ganti dengan indikator Anda sendiri —
          field metadata di bawah akan terisi mengikuti indikator ini.
        </p>
        <div id="indicator-field-container-${t}"></div>
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
  const indicatorFieldContainer = document.getElementById(`indicator-field-container-${t}`);
  const recsContainer = document.getElementById(`recs-container-${t}`);

  if (!input || !btn) return;

  let currentInputText = '';
  let currentSelectedIndicator = '';

  // Fields other than Uraian Indikator, in display order
  const metadataFieldOrder = FIELD_ORDER.filter((key) => key !== 'uraianIndikator');

  // These render as an empty field + AI suggestion card (no accept/edit/reject);
  // the rest keep the existing accept/edit/reject rec-card pattern.
  const AI_ASSISTED_FIELDS = new Set(['sasaranStrategis', 'definisiOperasional', 'rumusHitung', 'sumberData']);

  // Enable/disable generate button based on minimum text length
  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < 5;
  });

  // ─── Step 1 → Step 2: recommend one indicator, then auto-fill metadata ──
  async function generateOptions() {
    currentInputText = input.value.trim();
    if (!currentInputText) return;

    step2.style.display = 'block';
    indicatorFieldContainer.innerHTML = renderSkeletonAssessment();
    recsContainer.innerHTML = renderSkeletonCards(metadataFieldOrder.length);
    btn.disabled = true;
    btn.innerHTML = 'Menganalisis...';

    step2.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const { indicator: recommendedText, reasoning } = await getIndicatorRecommendation(
        config.type,
        currentInputText
      );
      indicatorFieldContainer.innerHTML = renderIndicatorAssessment(recommendedText, reasoning, config.label, t);
      initIndicatorAssessment({
        namespace: t,
        recommendedText,
        onUpdateMetadata: (finalText) => generateMetadata(finalText),
      });

      // All metadata fields are already visible (as skeletons) — auto-fill
      // them immediately using the AI's recommended indicator text, along
      // with the real SMART assessment for that indicator.
      await generateMetadata(recommendedText);
    } catch (err) {
      indicatorFieldContainer.innerHTML = errorState(err.message);
    }

    btn.disabled = false;
    btn.innerHTML = `Generate Indikator ${config.label}`;
  }

  btn.addEventListener('click', generateOptions);

  // ─── Fetch/refresh the metadata fields + SMART assessment for a given
  // indicator text ───────────────────────────────────────────────────────
  async function generateMetadata(selectedName) {
    currentSelectedIndicator = selectedName;
    recsContainer.innerHTML = renderSkeletonCards(metadataFieldOrder.length);
    setKesesuaianLoading(t);

    getSmartAssessment(config.type, currentInputText, selectedName)
      .then((assessment) => setKesesuaianResult(t, assessment))
      .catch((err) => setKesesuaianError(t, err.message));

    try {
      const recs = await getIndicatorDetails(config.type, currentInputText, selectedName);

      let html = '';
      metadataFieldOrder.forEach((key, i) => {
        if (recs[key]) {
          html += AI_ASSISTED_FIELDS.has(key)
            ? renderAiAssistedField(key, recs[key], t)
            : renderRecommendationCard(key, recs[key], i);
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
        const freshRecs = await getIndicatorDetails(config.type, currentInputText, variantIndicator);
        if (!freshRecs[fieldKey]) throw new Error('Field tidak ditemukan dalam respons API');
        return freshRecs[fieldKey];
      });

      metadataFieldOrder.forEach((key) => {
        if (recs[key] && AI_ASSISTED_FIELDS.has(key)) {
          initAiAssistedField(key, recs[key], t);
        }
      });

      // Pass forecastContextKey so the forecast section builds the correct payload
      initForecastSection(config.forecastContextKey, currentInputText);
    } catch (err) {
      recsContainer.innerHTML = errorState(err.message);
    }
  }
}

// ─── Private helpers ────────────────────────────────────────────────────────

function errorState(message) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">!</div>
      <div class="empty-state__text">Gagal memuat: ${message}</div>
    </div>
  `;
}
