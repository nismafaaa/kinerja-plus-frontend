/**
 * Indikator Sasaran page.
 */
import { renderHeader } from '../components/header.js';
import { renderSkeletonCards } from '../components/skeletonLoader.js';
import {
  renderRecommendationCard,
  renderForecastSection,
  initCardActions,
  initForecastSection,
} from '../components/recommendationCard.js';
import { getRecommendations } from '../services/apiClient.js';

export function renderIndikatorSasaran() {
  return `
    ${renderHeader(
    'Indikator Sasaran',
    'Susun indikator berdasarkan Sasaran Strategis dengan bantuan AI'
  )}
    <div class="page-body">

      <!-- STEP 1: Input -->
      <div class="step-section" id="step-input-sasaran">
        <div class="step-label">
          <span class="step-number">1</span>
          Masukkan Sasaran Strategis
        </div>
        <div class="input-group">
          <label class="input-group__label" for="input-sasaran">Sasaran Strategis</label>
          <p class="input-group__hint">
            Ketik sasaran strategis organisasi Anda. AI akan memberikan rekomendasi indikator secara otomatis.
          </p>
          <textarea
            id="input-sasaran"
            placeholder="Contoh: Meningkatnya akses dan kualitas pendidikan dasar"
          ></textarea>
        </div>
        <button class="btn btn--ai" id="btn-generate-sasaran" disabled>
          Dapatkan Rekomendasi AI
        </button>
      </div>

      <!-- STEP 2: AI Recommendations -->
      <div class="step-section" id="step-recommendations-sasaran" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Tinjau Rekomendasi AI
        </div>
        <p class="input-group__hint" style="margin-bottom: var(--space-lg);">
          AI telah menganalisis sasaran strategis Anda dan memberikan rekomendasi untuk setiap field.
          Anda dapat <strong>menerima</strong>, <strong>mengedit</strong>, atau <strong>menolak</strong> setiap rekomendasi.
        </p>
        <div id="recs-container-sasaran"></div>
      </div>

    </div>
  `;
}

export function initIndikatorSasaran() {
  const input = document.getElementById('input-sasaran');
  const btn = document.getElementById('btn-generate-sasaran');
  const recsSection = document.getElementById('step-recommendations-sasaran');
  const recsContainer = document.getElementById('recs-container-sasaran');

  if (!input || !btn) return;

  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < 5;
  });

  btn.addEventListener('click', async () => {
    const inputText = input.value.trim();
    if (!inputText) return;

    recsSection.style.display = 'block';
    recsContainer.innerHTML = renderSkeletonCards(6);
    btn.disabled = true;
    btn.innerHTML = 'Menganalisis...';

    recsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const recs = await getRecommendations('sasaran', inputText);

      let html = '';
      const fieldOrder = [
        'uraianIndikator',
        'indikatorMinimum',
        'definisiOperasional',
        'rumusHitung',
        'sumberData',
      ];

      fieldOrder.forEach((key, i) => {
        html += renderRecommendationCard(key, recs[key], i);
      });

      recsContainer.innerHTML = `
        <div class="recs-section">
          <div class="recs-section__title">
            Rekomendasi AI untuk Sasaran Anda
          </div>
          ${html}
        </div>
        ${renderForecastSection()}
      `;

      initCardActions(recs);
      initForecastSection('sasaran', inputText);
    } catch (err) {
      recsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">!</div>
          <div class="empty-state__text">Gagal memuat rekomendasi: ${err.message}</div>
        </div>
      `;
    }

    btn.disabled = false;
    btn.innerHTML = 'Dapatkan Rekomendasi AI';
  });
}
