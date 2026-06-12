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
import {
  getIndicatorOptions,
  getRecommendations,
} from '../services/apiClient.js';

export function renderIndikatorSasaran() {
  return `
    ${renderHeader(
    'Indikator Sasaran',
    'Susun indikator berdasarkan Sasaran Strategis dengan bantuan AI'
  )}
    <div class="page-body">

      <!-- STEP 1: Sasaran Input -->
      <div class="step-section" id="step-1-sasaran">
        <div class="step-label">
          <span class="step-number">1</span>
          Masukkan Sasaran Strategis
        </div>
        <div class="input-group">
          <label class="input-group__label" for="input-sasaran">Sasaran Strategis</label>
          <p class="input-group__hint">
            Ketik sasaran strategis organisasi Anda. AI akan menghasilkan beberapa opsi
            <strong>Indikator Sasaran</strong> yang relevan dan terukur untuk Anda pilih.
          </p>
          <textarea
            id="input-sasaran"
            placeholder="Contoh: Meningkatnya akses dan kualitas pendidikan dasar"
          ></textarea>
        </div>
        <button class="btn btn--ai" id="btn-generate-sasaran" disabled>
          Generate Indikator Sasaran
        </button>
      </div>

      <!-- STEP 2: Select Indicator Option -->
      <div class="step-section" id="step-2-sasaran" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Pilih Indikator Sasaran
        </div>
        <p class="input-group__hint step-hint">
          AI menghasilkan beberapa opsi <strong>Indikator Sasaran</strong> berdasarkan sasaran strategis Anda.
          Pilih satu indikator yang paling relevan untuk dilanjutkan.
        </p>
        <div id="indicator-options-container-sasaran"></div>
      </div>

      <!-- STEP 3: Metadata Generation -->
      <div class="step-section" id="step-3-sasaran" style="display:none;">
        <div class="step-label">
          <span class="step-number">3</span>
          Tinjau &amp; Edit Metadata Indikator
        </div>
        <div class="selected-indicator-banner" id="selected-banner-sasaran"></div>
        <p class="input-group__hint step-hint">
          AI telah menghasilkan metadata lengkap untuk indikator terpilih.
          Anda dapat <strong>menerima</strong>, <strong>mengedit</strong>, atau <strong>menolak</strong> setiap field.
        </p>
        <div id="recs-container-sasaran"></div>
      </div>

    </div>
  `;
}

export function initIndikatorSasaran() {
  const input = document.getElementById('input-sasaran');
  const btn = document.getElementById('btn-generate-sasaran');
  const step2 = document.getElementById('step-2-sasaran');
  const step3 = document.getElementById('step-3-sasaran');
  const optionsContainer = document.getElementById('indicator-options-container-sasaran');
  const recsContainer = document.getElementById('recs-container-sasaran');
  const selectedBanner = document.getElementById('selected-banner-sasaran');

  if (!input || !btn) return;

  let currentInputText = '';
  let currentSelectedIndicator = '';

  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < 5;
  });

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
      const options = await getIndicatorOptions('sasaran', currentInputText);

      optionsContainer.innerHTML = renderIndicatorOptions(options, 'sasaran');
      initIndicatorSelector(
        (selectedName) => generateMetadata(selectedName)
      );
    } catch (err) {
      optionsContainer.innerHTML = errorState(err.message);
    }

    btn.disabled = false;
    btn.innerHTML = 'Generate Indikator Sasaran';
  }

  btn.addEventListener('click', generateOptions);

  async function generateMetadata(selectedName) {
    currentSelectedIndicator = selectedName;
    step3.style.display = 'block';
    selectedBanner.innerHTML = `
      <div class="selected-indicator-banner__icon">✓</div>
      <div class="selected-indicator-banner__content">
        <div class="selected-indicator-banner__title">Indikator Terpilih</div>
        <div class="selected-indicator-banner__value">${selectedName}</div>
      </div>
      <button class="btn btn--outline btn--sm" id="btn-change-indicator-sasaran">Ganti Indikator</button>
    `;

    recsContainer.innerHTML = renderSkeletonCards(7);
    step3.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('btn-change-indicator-sasaran')?.addEventListener('click', () => {
      step3.style.display = 'none';
      step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    try {
      const recs = await getRecommendations('sasaran', currentInputText, selectedName);

      const fieldOrder = [
        'uraianIndikator',
        'indikatorMinimum',
        'definisiOperasional',
        'rumusHitung',
        'satuan',
        'sumberData',
        'frekuensiPengukuran',
      ];

      let html = '';
      fieldOrder.forEach((key, i) => {
        if (recs[key]) {
          html += renderRecommendationCard(key, recs[key], i, { readOnly: key === 'uraianIndikator' });
        }
      });

      recsContainer.innerHTML = `
        <div class="recs-section">
          <div class="recs-section__title">Metadata Indikator Sasaran</div>
          ${html}
        </div>
        ${renderForecastSection()}
      `;

      const regenCounters = {};

      initCardActions(recs, null, async (fieldKey) => {
        regenCounters[fieldKey] = (regenCounters[fieldKey] || 0) + 1;
        const variantIndicator = `${currentSelectedIndicator} - variasi ${regenCounters[fieldKey]}`;
        const freshRecs = await getRecommendations('sasaran', currentInputText, variantIndicator);
        if (!freshRecs[fieldKey]) throw new Error('Field tidak ditemukan dalam respons API');
        return freshRecs[fieldKey];
      });
      initForecastSection('sasaran', currentInputText);
    } catch (err) {
      recsContainer.innerHTML = errorState(err.message);
    }
  }
}

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