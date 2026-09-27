import { renderSectionCard, errorState } from '../../../components/sectionCard.js';
import { renderSelectField, initSelectField } from '../../../components/selectField.js';
import { getRiskCategory } from '../../../services/apiClient.js';

// Exactly the 5 values confirmed in API_CONTRACT.md §6.2 — used verbatim.
const KATEGORI_OPTIONS = [
  { value: 'Keuangan', label: 'Keuangan (Financial & Budgetary)' },
  { value: 'Kepatuhan', label: 'Kepatuhan (Compliance & Regulatory)' },
  { value: 'Pengadaan', label: 'Pengadaan (Procurement & Tender)' },
  { value: 'Aset', label: 'Aset (Physical Assets & Inventory)' },
  { value: 'Operasional', label: 'Operasional (Operational & Workforce)' },
];

function renderFields(kategoriRisiko) {
  return renderSelectField('kategori-risiko', 'Kategori Terpilih', KATEGORI_OPTIONS, {
    selected: kategoriRisiko || '',
    required: true,
  });
}

export function renderSection2(kategoriRisiko = '') {
  const body = `<div id="section2-body">${renderFields(kategoriRisiko)}</div>`;
  return renderSectionCard(
    2,
    'Kategori Risiko',
    'Pilih bidang risiko sesuai taksonomi tata kelola penyelenggaraan pemerintah daerah.',
    body,
    // Deliberate addition over the mockup (which shows no visible AI trigger
    // for this section): the endpoint exists and is independently callable,
    // so expose it consistently with Seksi 1 / Seksi 8.
    { id: 'seksi-2', ai: { id: 'btn-ai-kategori', label: 'Dapatkan Rekomendasi AI' } }
  );
}

/**
 * @param {object} opts
 * @param {function():{pernyataan_risiko:string,penyebab_risiko:string,dampak_risiko:string}} opts.getIdentifikasi
 * @param {function():{sasaranText:string,indikatorText:string}|null} opts.getContext
 * @param {function(string):void} opts.onChange
 */
export function initSection2({ getIdentifikasi, getContext, onChange }) {
  const body = document.getElementById('section2-body');
  const aiBtn = document.getElementById('btn-ai-kategori');
  if (!body || !aiBtn) return;

  function wireSelect() {
    initSelectField('kategori-risiko', (value) => onChange(value));
  }

  wireSelect();

  aiBtn.addEventListener('click', async () => {
    const identifikasi = getIdentifikasi();
    const ctx = getContext();
    if (
      !identifikasi?.pernyataan_risiko || identifikasi.pernyataan_risiko.trim().length < 5 ||
      !identifikasi.penyebab_risiko || identifikasi.penyebab_risiko.trim().length < 3 ||
      !identifikasi.dampak_risiko || identifikasi.dampak_risiko.trim().length < 3
    ) {
      body.innerHTML = renderFields(null) + `<p class="input-group__hint" style="color:var(--color-danger);">
        Lengkapi Seksi 1 (Identifikasi Risiko) terlebih dahulu.</p>`;
      wireSelect();
      return;
    }

    aiBtn.disabled = true;
    aiBtn.textContent = 'Menganalisis...';
    body.innerHTML = '<div class="skeleton skeleton-block" style="height:44px;"></div>';

    try {
      const result = await getRiskCategory({
        sasaran_text: ctx?.sasaranText || '',
        indikator_sasaran_text: ctx?.indikatorText || '',
        pernyataan_risiko: identifikasi.pernyataan_risiko,
        penyebab_risiko: identifikasi.penyebab_risiko,
        dampak_risiko: identifikasi.dampak_risiko,
      });
      body.innerHTML = renderFields(result.kategori_risiko) + (result.reasoning ? `
        <div class="rec-card__reasoning">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${result.reasoning}</span>
        </div>
      ` : '');
      wireSelect();
      onChange(result.kategori_risiko);
    } catch (err) {
      body.innerHTML = renderFields(null) + errorState(err.message);
      wireSelect();
    } finally {
      aiBtn.disabled = false;
      aiBtn.textContent = 'Dapatkan Rekomendasi AI';
    }
  });
}
