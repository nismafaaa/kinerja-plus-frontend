import { renderHeader } from '../components/header.js';
import { renderSkeletonCards } from '../components/skeletonLoader.js';
import {
  renderIndicatorAssessment,
  initIndicatorAssessment,
  renderSkeletonAssessment,
  setKesesuaianLoading,
  setKesesuaianError,
  setKesesuaianResult,
  setKesesuaianEmpty,
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

      <!-- STEP 2: Indicator selection + SMART evaluation -->
      <div class="step-section" id="step-2-${t}" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Pilih Indikator ${config.label}
        </div>
        <p class="input-group__hint step-hint">
          AI menyusun satu rekomendasi <strong>Indikator ${config.label}</strong> berdasarkan
          ${config.inputLabel.toLowerCase()} Anda. Terima rekomendasi ini, atau ganti dengan indikator Anda
          sendiri, lalu tinjau kesesuaiannya dengan kriteria SMART sebelum melanjutkan.
        </p>
        <div id="indicator-field-container-${t}"></div>
      </div>

      <!-- STEP 3: Indicator metadata -->
      <div class="step-section" id="step-3-${t}" style="display:none;">
        <div class="step-label">
          <span class="step-number">3</span>
          Lengkapi Metadata Indikator ${config.label}
        </div>
        <p class="input-group__hint step-hint">
          Field metadata berikut terisi mengikuti indikator yang Anda pilih. Terima, sesuaikan, atau ganti
          setiap rekomendasi AI di bawah ini sesuai kebutuhan.
        </p>
        <button class="btn btn--outline btn--sm" id="btn-back-to-indicator-${t}" style="margin-bottom:var(--space-lg);">
          ← Kembali ke Pemilihan Indikator
        </button>
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
  const indicatorFieldContainer = document.getElementById(`indicator-field-container-${t}`);
  const recsContainer = document.getElementById(`recs-container-${t}`);
  const backBtn = document.getElementById(`btn-back-to-indicator-${t}`);

  if (!input || !btn) return;

  let currentInputText = '';
  let currentSelectedIndicator = '';
  // Indicator text the currently-displayed SMART result corresponds to.
  // null means the displayed result (if any) is stale/cleared and must be
  // regenerated before it can be trusted.
  let smartAssessedFor = null;

  // Fields other than Uraian Indikator, in display order
  const metadataFieldOrder = FIELD_ORDER.filter((key) => key !== 'uraianIndikator');

  // These render as an empty field + AI suggestion card (no accept/edit/reject);
  // the rest keep the existing accept/edit/reject rec-card pattern.
  const AI_ASSISTED_FIELDS = new Set(['sasaranStrategis', 'definisiOperasional', 'rumusHitung', 'sumberData']);

  // Enable/disable generate button based on minimum text length
  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < 5;
  });

  // ─── Step 1 → Step 2: recommend one indicator, then evaluate it with SMART ──
  async function generateOptions() {
    currentInputText = input.value.trim();
    if (!currentInputText) return;

    step2.style.display = 'block';
    step3.style.display = 'none';
    indicatorFieldContainer.innerHTML = renderSkeletonAssessment();
    btn.disabled = true;
    btn.innerHTML = 'Menganalisis...';

    step2.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const { indicator: recommendedText, reasoning } = await getIndicatorRecommendation(
        config.type,
        currentInputText
      );
      currentSelectedIndicator = recommendedText;
      smartAssessedFor = null;
      indicatorFieldContainer.innerHTML = renderIndicatorAssessment(recommendedText, reasoning, config.label, t);
      initIndicatorAssessment({
        namespace: t,
        recommendedText,
        onIndicatorEdited: (text) => {
          // The indicator field no longer matches what was last SMART-assessed
          // — don't keep showing an evaluation that belongs to different text.
          if (smartAssessedFor !== null && text !== smartAssessedFor) {
            smartAssessedFor = null;
            setKesesuaianEmpty(t);
          }
        },
        onEvaluateSmart: (finalText) => evaluateSmart(finalText),
        onNext: (finalText) => goToMetadata(finalText),
      });

      // Note: the SMART block stays empty here — it is never pre-populated
      // for the AI recommendation. It's only ever generated from whatever
      // text the user has put in the "Uraian Indikator" field themselves.
    } catch (err) {
      indicatorFieldContainer.innerHTML = errorState(err.message);
    }

    btn.disabled = false;
    btn.innerHTML = `Generate Indikator ${config.label}`;
  }

  btn.addEventListener('click', generateOptions);

  // ─── Run the SMART assessment for whatever text is in the indicator field ──
  function evaluateSmart(text) {
    currentSelectedIndicator = text;
    smartAssessedFor = text;
    setKesesuaianLoading(t);

    return getSmartAssessment(config.type, currentInputText, text)
      .then((assessment) => setKesesuaianResult(t, assessment))
      .catch((err) => setKesesuaianError(t, err.message));
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      step3.style.display = 'none';
      step2.style.display = 'block';
      step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ─── Step 2 → Step 3: fetch metadata fields for the final indicator text ──
  async function goToMetadata(selectedName) {
    currentSelectedIndicator = selectedName;

    step3.style.display = 'block';
    recsContainer.innerHTML = renderSkeletonCards(metadataFieldOrder.length);
    step3.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
