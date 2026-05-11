/**
 * Indikator Tujuan page.
 */
import { renderHeader } from '../components/header.js';
import { renderSkeletonCards } from '../components/skeletonLoader.js';
import {
  renderRecommendationCard,
  renderTargetCard,
  initCardActions,
} from '../components/recommendationCard.js';
import { getRecommendations } from '../services/mockAiService.js';

export function renderIndikatorTujuan() {
  return `
    ${renderHeader(
      'Indikator Tujuan',
      'Susun indikator berdasarkan Tujuan Strategis dengan bantuan AI'
    )}
    <div class="page-body">

      <!-- STEP 1: Input -->
      <div class="step-section" id="step-input">
        <div class="step-label">
          <span class="step-number">1</span>
          Masukkan Tujuan Strategis
        </div>
        <div class="input-group">
          <label class="input-group__label" for="input-tujuan">Tujuan Strategis</label>
          <p class="input-group__hint">
            Ketik tujuan strategis organisasi Anda. AI akan memberikan rekomendasi indikator secara otomatis.
          </p>
          <textarea
            id="input-tujuan"
            placeholder="Contoh: Meningkatkan kualitas layanan kesehatan masyarakat"
          ></textarea>
        </div>
        <button class="btn btn--ai" id="btn-generate-tujuan" disabled>
          ✨ Dapatkan Rekomendasi AI
        </button>
      </div>

      <!-- STEP 2: AI Recommendations -->
      <div class="step-section" id="step-recommendations-tujuan" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Tinjau Rekomendasi AI
        </div>
        <p class="input-group__hint" style="margin-bottom: var(--space-lg);">
          AI telah menganalisis tujuan strategis Anda dan memberikan rekomendasi untuk setiap field.
          Anda dapat <strong>menerima</strong>, <strong>mengedit</strong>, atau <strong>menolak</strong> setiap rekomendasi.
        </p>
        <div id="recs-container-tujuan"></div>
      </div>

    </div>
  `;
}

export function initIndikatorTujuan() {
  const input = document.getElementById('input-tujuan');
  const btn = document.getElementById('btn-generate-tujuan');
  const recsSection = document.getElementById('step-recommendations-tujuan');
  const recsContainer = document.getElementById('recs-container-tujuan');

  if (!input || !btn) return;

  // Enable button when input has text
  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < 5;
  });

  btn.addEventListener('click', async () => {
    const inputText = input.value.trim();
    if (!inputText) return;

    // Show section with skeletons
    recsSection.style.display = 'block';
    recsContainer.innerHTML = renderSkeletonCards(6);
    btn.disabled = true;
    btn.innerHTML = '⏳ Menganalisis...';

    // Scroll to recommendations
    recsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const recs = await getRecommendations('tujuan', inputText);

      // Build recommendation cards
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

      // Target period card (special grid layout)
      html += renderTargetCard(recs.targetPeriode, fieldOrder.length);

      recsContainer.innerHTML = `
        <div class="recs-section">
          <div class="recs-section__title">
            <span class="recs-section__ai-sparkle">🤖</span>
            Rekomendasi AI untuk Tujuan Anda
          </div>
          ${html}
        </div>
      `;

      // Initialize card action handlers
      initCardActions(recs);
    } catch (err) {
      recsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">⚠️</div>
          <div class="empty-state__text">Terjadi kesalahan saat memuat rekomendasi. Silakan coba lagi.</div>
        </div>
      `;
    }

    btn.disabled = false;
    btn.innerHTML = '✨ Dapatkan Rekomendasi AI';
  });
}
