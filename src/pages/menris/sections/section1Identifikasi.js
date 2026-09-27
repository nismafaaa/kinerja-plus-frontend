import { renderSectionCard, errorState } from '../../../components/sectionCard.js';
import { renderRadioGroup, initRadioGroup } from '../../../components/radioGroup.js';
import { renderSkeletonCards } from '../../../components/skeletonLoader.js';
import { getRiskIdentification } from '../../../services/apiClient.js';

const UC_C_OPTIONS = [
  { value: 'C', label: 'Controllable (C)', description: 'Faktor penyebab berada di bawah kendali kewenangan internal dinas/PPK.' },
  { value: 'UC', label: 'Uncontrollable (UC)', description: 'Faktor eksternal di luar otoritas langsung unit pelaksana.' },
];

/**
 * @param {{pernyataan_risiko?:string, penyebab_risiko?:string, dampak_risiko?:string, uc_c?:string}} data
 */
function renderFields(data) {
  return `
    <div class="input-group">
      <label class="input-group__label" for="pernyataan-risiko">Pernyataan Risiko <span class="required-mark">*</span></label>
      <textarea id="pernyataan-risiko" rows="2" placeholder="Tuliskan rumusan peristiwa risiko di sini...">${data.pernyataan_risiko || ''}</textarea>
    </div>
    <div class="input-group">
      <label class="input-group__label" for="penyebab-risiko">Penyebab Risiko (Root Cause) <span class="required-mark">*</span></label>
      <textarea id="penyebab-risiko" rows="3" placeholder="Tuliskan faktor akar penyebab di sini...">${data.penyebab_risiko || ''}</textarea>
    </div>
    <div class="input-group">
      <label class="input-group__label" for="dampak-risiko">Dampak Risiko (Consequences) <span class="required-mark">*</span></label>
      <textarea id="dampak-risiko" rows="3" placeholder="Tuliskan uraian dampak potensial di sini...">${data.dampak_risiko || ''}</textarea>
    </div>
    ${renderRadioGroup('sifat-kendali', 'Sifat Pengendalian (Controllability)', UC_C_OPTIONS, data.uc_c || '')}
  `;
}

export function renderSection1(data = {}) {
  const body = `<div id="section1-body">${renderFields(data)}</div>`;
  return renderSectionCard(
    1,
    'Identifikasi Risiko',
    'Definisikan rumusan peristiwa ketidakpastian, akar penyebab, sifat kendali, serta dampak potensial secara manual atau gunakan asistensi AI.',
    body,
    { id: 'seksi-1', ai: { id: 'btn-ai-identifikasi', label: 'Dapatkan Rekomendasi AI' } }
  );
}

/**
 * @param {object} opts
 * @param {function():{sasaranId:string,sasaranText:string,indikatorSasaranId:string,indikatorText:string}|null} opts.getContext
 * @param {{pernyataan_risiko:string,penyebab_risiko:string,dampak_risiko:string,uc_c:string}} opts.data - mutated in place
 * @param {function(object):void} opts.onChange - called with the full current field set
 */
export function initSection1({ getContext, data, onChange }) {
  const body = document.getElementById('section1-body');
  const aiBtn = document.getElementById('btn-ai-identifikasi');
  if (!body || !aiBtn) return;

  function wireFields() {
    const pernyataan = document.getElementById('pernyataan-risiko');
    const penyebab = document.getElementById('penyebab-risiko');
    const dampak = document.getElementById('dampak-risiko');

    function emitChange() {
      data.pernyataan_risiko = pernyataan.value;
      data.penyebab_risiko = penyebab.value;
      data.dampak_risiko = dampak.value;
      onChange(data);
    }

    pernyataan.addEventListener('input', emitChange);
    penyebab.addEventListener('input', emitChange);
    dampak.addEventListener('input', emitChange);

    initRadioGroup('sifat-kendali', (value) => {
      data.uc_c = value;
      onChange(data);
    });
  }

  wireFields();

  aiBtn.addEventListener('click', async () => {
    const ctx = getContext();
    if (!ctx?.sasaranId || !ctx?.indikatorSasaranId) return;

    aiBtn.disabled = true;
    aiBtn.textContent = 'Menganalisis...';
    body.innerHTML = renderSkeletonCards(1);

    try {
      const result = await getRiskIdentification({
        sasaran_id: ctx.sasaranId,
        sasaran_text: ctx.sasaranText,
        indikator_sasaran_id: ctx.indikatorSasaranId,
        indikator_sasaran_text: ctx.indikatorText,
      });
      data.pernyataan_risiko = result.pernyataan_risiko;
      data.penyebab_risiko = result.penyebab_risiko;
      data.dampak_risiko = result.dampak_risiko;
      data.uc_c = result.uc_c;

      body.innerHTML = renderFields(data) + (result.reasoning ? `
        <div class="rec-card__reasoning">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${result.reasoning}</span>
        </div>
      ` : '');
      wireFields();
      onChange(data);
    } catch (err) {
      body.innerHTML = renderFields(data) + errorState(err.message);
      wireFields();
    } finally {
      aiBtn.disabled = false;
      aiBtn.textContent = 'Dapatkan Rekomendasi AI';
    }
  });
}
