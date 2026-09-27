import { renderSectionCard, errorState } from '../../../components/sectionCard.js';
import { getAdditionalControlRecommendation } from '../../../services/apiClient.js';

/**
 * A single mitigation action + one "Generate Solusi Mitigasi AI" trigger.
 * The API returns one recommendation per call (API_CONTRACT.md §6.3) and
 * there is no list concept server-side, so this section generates once —
 * no "+ Tambah Tindakan Mitigasi" repeater.
 */
export function renderSection8(action = { text: '', reasoning: '' }) {
  const body = `
    <div class="mitigasi-action-row" id="mitigasi-action">
      <div class="mitigasi-action-row__header">
        <button type="button" class="btn btn--ai btn--sm" id="btn-mitigasi-generate">
          Generate Solusi Mitigasi AI
        </button>
      </div>
      <textarea id="mitigasi-action-input" rows="3"
        placeholder="Tuliskan rencana aksi mitigasi tambahan yang dibutuhkan...">${action.text || ''}</textarea>
      ${action.reasoning ? `
        <div class="rec-card__reasoning">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${action.reasoning}</span>
        </div>
      ` : ''}
      <div id="mitigasi-action-error"></div>
    </div>
  `;
  return renderSectionCard(
    8,
    'Pengendalian Yang Masih Dibutuhkan',
    'Rencana aksi (action plan) & program mitigasi tambahan untuk menurunkan residu risiko.',
    body,
    { id: 'seksi-8' }
  );
}

/**
 * @param {object} opts
 * @param {function():{pernyataan_risiko:string}} opts.getIdentifikasi
 * @param {function():string[]} opts.getExistingControls
 * @param {function():{kemungkinan:number|null,dampak:number|null}} opts.getResidualExisting
 * @param {function():string} opts.getPerlakuan
 * @param {{mitigasiAction: {text:string,reasoning:string}}} opts.state - mutated in place
 * @param {function({text:string,reasoning:string}):void} opts.onChange
 */
export function initSection8({ getIdentifikasi, getExistingControls, getResidualExisting, getPerlakuan, state, onChange }) {
  const textarea = document.getElementById('mitigasi-action-input');
  const generateBtn = document.getElementById('btn-mitigasi-generate');
  const errorEl = document.getElementById('mitigasi-action-error');
  if (!textarea || !generateBtn) return;

  if (!state.mitigasiAction) state.mitigasiAction = { text: '', reasoning: '' };

  textarea.addEventListener('input', () => {
    state.mitigasiAction.text = textarea.value;
    onChange(state.mitigasiAction);
  });

  generateBtn.addEventListener('click', async () => {
    const identifikasi = getIdentifikasi();
    const existingControls = (getExistingControls() || []).filter((c) => c.trim());

    if (!identifikasi?.pernyataan_risiko?.trim() || existingControls.length === 0) {
      errorEl.innerHTML = `
        <p class="input-group__hint" style="color:var(--color-danger);">
          Isi Pernyataan Risiko (Seksi 1) dan minimal 1 Pengendalian Eksisting (Seksi 4) terlebih dahulu.
        </p>`;
      return;
    }

    const residual = getResidualExisting();
    const perlakuan = getPerlakuan();

    generateBtn.disabled = true;
    generateBtn.textContent = 'Menganalisis...';
    errorEl.innerHTML = '<div class="skeleton skeleton-block" style="height:44px;"></div>';

    try {
      const result = await getAdditionalControlRecommendation({
        pernyataan_risiko: identifikasi.pernyataan_risiko,
        existing_controls: existingControls,
        ...(residual?.kemungkinan ? { skor_kemungkinan_residual: residual.kemungkinan } : {}),
        ...(residual?.dampak ? { skor_dampak_residual: residual.dampak } : {}),
        ...(perlakuan ? { perlakuan_risiko: perlakuan } : {}),
      });

      state.mitigasiAction = { text: result.pengendalian_tambahan, reasoning: result.reasoning || '' };
      textarea.value = result.pengendalian_tambahan;
      errorEl.innerHTML = result.reasoning ? `
        <div class="rec-card__reasoning">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${result.reasoning}</span>
        </div>
      ` : '';
      onChange(state.mitigasiAction);
    } catch (err) {
      errorEl.innerHTML = errorState(err.message);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Solusi Mitigasi AI';
    }
  });
}
