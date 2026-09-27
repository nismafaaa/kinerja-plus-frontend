import { renderHeader } from '../../components/header.js';
import { showToast } from '../../components/recommendationCard.js';
import { calculateRiskScore } from '../../utils/riskScore.js';
import { saveDraft, loadDraft } from '../../services/menrisStorage.js';
import { renderMenrisContextPicker, initMenrisContextPicker } from './menrisContextPicker.js';
import { renderMenrisChecklist, updateMenrisChecklist } from './menrisChecklist.js';
import { renderSection1, initSection1 } from './sections/section1Identifikasi.js';
import { renderSection2, initSection2 } from './sections/section2Kategori.js';
import { renderSection3, initSection3 } from './sections/section3AnalisaAwal.js';
import { renderSection4, initSection4 } from './sections/section4Pengendalian.js';
import { renderSection5, initSection5 } from './sections/section5SkorResidual.js';
import { renderSection6, initSection6 } from './sections/section6Selera.js';
import { renderSection7, initSection7 } from './sections/section7Perlakuan.js';
import { renderSection8, initSection8 } from './sections/section8Mitigasi.js';
import { renderSection9, initSection9 } from './sections/section9SkorFinal.js';
import { renderSection10, initSection10 } from './sections/section10PenanggungJawab.js';
import { renderSection11, initSection11 } from './sections/section11Tenggat.js';

// Sections with no sane "empty is fine" default — gate the final save on these.
const REQUIRED_SECTIONS = [1, 2, 3, 7, 10, 11];

export function renderMenrisPage() {
  return `
    ${renderHeader('Manajemen Risiko', 'Identifikasi, nilai, dan kelola perlakuan risiko pada Sasaran & Indikator Sasaran dengan bantuan AI.')}
    <div class="page-body menris-page-body">
      ${renderMenrisContextPicker()}
      <div class="menris-layout" id="menris-layout" style="display:none;">
        <div class="menris-layout__main">
          <div id="section-1-container"></div>
          <div id="section-2-container"></div>
          <div id="section-3-container"></div>
          <div id="section-4-container"></div>
          <div id="section-5-container"></div>
          <div id="section-6-container"></div>
          <div id="section-7-container"></div>
          <div id="section-8-container"></div>
          <div id="section-9-container"></div>
          <div id="section-10-container"></div>
          <div id="section-11-container"></div>

          <div class="menris-footer">
            <div class="menris-footer__actions">
              <button class="btn btn--outline" id="btn-menris-cancel" type="button">Batal / Kembali</button>
              <button class="btn btn--outline" id="btn-menris-save-draft" type="button">
                Simpan Draf
              </button>
            </div>
            <button class="btn btn--ai" id="btn-menris-save-final" type="button">
              Simpan Perubahan Indikator
            </button>
          </div>
          <p class="menris-footer__hint" id="menris-last-saved"></p>
        </div>
        <div class="menris-layout__aside" id="menris-layout-aside"></div>
      </div>
    </div>
  `;
}

export function initMenrisPage() {
  let context = null;
  let saveTimer = null;
  let refreshAppetiteWarning = () => {};

  const state = {
    identifikasi: { pernyataan_risiko: '', penyebab_risiko: '', dampak_risiko: '', uc_c: '' },
    kategoriRisiko: '',
    skorAwal: { kemungkinan: null, dampak: null },
    existingControls: [''],
    skorResidualExisting: { kemungkinan: null, dampak: null },
    seleraRisiko: '',
    perlakuanRisiko: '',
    mitigasiAction: { text: '', reasoning: '' },
    skorFinal: { kemungkinan: null, dampak: null },
    penanggungJawab: '',
    tenggatWaktu: '',
  };

  function isSectionComplete(n) {
    switch (n) {
      case 1:
        return !!(
          state.identifikasi.pernyataan_risiko?.trim() &&
          state.identifikasi.penyebab_risiko?.trim() &&
          state.identifikasi.dampak_risiko?.trim() &&
          state.identifikasi.uc_c
        );
      case 2:
        return !!state.kategoriRisiko;
      case 3:
        return state.skorAwal.kemungkinan != null && state.skorAwal.dampak != null;
      case 4:
        return state.existingControls.some((c) => c.trim());
      case 5:
        return state.skorResidualExisting.kemungkinan != null && state.skorResidualExisting.dampak != null;
      case 6:
        return !!state.seleraRisiko;
      case 7:
        return !!state.perlakuanRisiko;
      case 8:
        return state.perlakuanRisiko === 'ACCEPT' || !!state.mitigasiAction.text?.trim();
      case 9:
        return state.perlakuanRisiko === 'ACCEPT' || (state.skorFinal.kemungkinan != null && state.skorFinal.dampak != null);
      case 10:
        return !!state.penanggungJawab?.trim();
      case 11:
        return !!state.tenggatWaktu;
      default:
        return false;
    }
  }

  function computeCompletionFlags() {
    return Array.from({ length: 11 }, (_, i) => isSectionComplete(i + 1));
  }

  function refreshChecklist() {
    updateMenrisChecklist(computeCompletionFlags());
  }

  function scheduleAutosave() {
    if (!context) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const ok = saveDraft(context.sasaranId, context.indikatorSasaranId, state);
      const lastSavedEl = document.getElementById('menris-last-saved');
      if (ok && lastSavedEl) {
        lastSavedEl.textContent = `Tersimpan di perangkat ini pada ${new Date().toLocaleTimeString('id-ID')}`;
      }
    }, 800);
  }

  function onAnySectionChange() {
    refreshChecklist();
    refreshAppetiteWarning();
    scheduleAutosave();
  }

  function hydrateFromDraft(draft) {
    if (!draft) return;
    Object.assign(state.identifikasi, draft.identifikasi || {});
    state.kategoriRisiko = draft.kategoriRisiko || '';
    Object.assign(state.skorAwal, draft.skorAwal || {});
    state.existingControls = draft.existingControls?.length ? draft.existingControls : [''];
    Object.assign(state.skorResidualExisting, draft.skorResidualExisting || {});
    state.seleraRisiko = draft.seleraRisiko || '';
    state.perlakuanRisiko = draft.perlakuanRisiko || '';
    state.mitigasiAction = draft.mitigasiAction || { text: '', reasoning: '' };
    Object.assign(state.skorFinal, draft.skorFinal || {});
    state.penanggungJawab = draft.penanggungJawab || '';
    state.tenggatWaktu = draft.tenggatWaktu || '';
  }

  function mountSections() {
    document.getElementById('section-1-container').innerHTML = renderSection1(state.identifikasi);
    document.getElementById('section-2-container').innerHTML = renderSection2(state.kategoriRisiko);
    document.getElementById('section-3-container').innerHTML = renderSection3(state.skorAwal);
    document.getElementById('section-4-container').innerHTML = renderSection4(state.existingControls);
    document.getElementById('section-5-container').innerHTML = renderSection5(state.skorResidualExisting);
    document.getElementById('section-6-container').innerHTML = renderSection6(state.seleraRisiko);
    document.getElementById('section-7-container').innerHTML = renderSection7(state.perlakuanRisiko);
    document.getElementById('section-8-container').innerHTML = renderSection8(state.mitigasiAction);
    document.getElementById('section-9-container').innerHTML = renderSection9(state.skorFinal);
    document.getElementById('section-10-container').innerHTML = renderSection10(state.penanggungJawab);
    document.getElementById('section-11-container').innerHTML = renderSection11(state.tenggatWaktu);
    document.getElementById('menris-layout-aside').innerHTML = renderMenrisChecklist(computeCompletionFlags());

    initSection1({
      getContext: () => context,
      data: state.identifikasi,
      onChange: () => onAnySectionChange(),
    });

    initSection2({
      getIdentifikasi: () => state.identifikasi,
      getContext: () => context,
      onChange: (value) => {
        state.kategoriRisiko = value;
        onAnySectionChange();
      },
    });

    initSection3(state.skorAwal, () => onAnySectionChange());

    initSection4((values) => {
      state.existingControls = values;
      onAnySectionChange();
    });

    initSection5(state.skorResidualExisting, () => onAnySectionChange());

    refreshAppetiteWarning = initSection6({
      getResidualScore: () => calculateRiskScore(state.skorResidualExisting.kemungkinan, state.skorResidualExisting.dampak),
      onChange: (value) => {
        state.seleraRisiko = value;
        onAnySectionChange();
      },
    }) || (() => {});

    initSection7((value) => {
      state.perlakuanRisiko = value;
      onAnySectionChange();
    });

    initSection8({
      getIdentifikasi: () => state.identifikasi,
      getExistingControls: () => state.existingControls,
      getResidualExisting: () => state.skorResidualExisting,
      getPerlakuan: () => state.perlakuanRisiko,
      state,
      onChange: () => onAnySectionChange(),
    });

    initSection9(state.skorFinal, () => onAnySectionChange());

    initSection10((value) => {
      state.penanggungJawab = value;
      onAnySectionChange();
    });

    initSection11((value) => {
      state.tenggatWaktu = value;
      onAnySectionChange();
    });

    refreshChecklist();
  }

  initMenrisContextPicker((ctx) => {
    context = ctx;
    const draft = loadDraft(ctx.sasaranId, ctx.indikatorSasaranId);
    if (draft) hydrateFromDraft(draft);

    const layout = document.getElementById('menris-layout');
    layout.style.display = 'grid';
    mountSections();
    layout.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (draft) showToast('Draf sebelumnya untuk konteks ini dipulihkan dari perangkat ini', 'info');
  });

  document.getElementById('btn-menris-cancel')?.addEventListener('click', () => {
    if (confirm('Batalkan perubahan pada form risiko ini? Perubahan yang belum disimpan sebagai draf akan hilang.')) {
      window.location.hash = '#/indikator-sasaran';
    }
  });

  document.getElementById('btn-menris-save-draft')?.addEventListener('click', () => {
    if (!context) return;
    const ok = saveDraft(context.sasaranId, context.indikatorSasaranId, state);
    showToast(ok ? 'Draf tersimpan di perangkat ini' : 'Gagal menyimpan draf (penyimpanan penuh?)', ok ? 'success' : 'error');
  });

  document.getElementById('btn-menris-save-final')?.addEventListener('click', () => {
    if (!context) return;
    const flags = computeCompletionFlags();
    const incomplete = REQUIRED_SECTIONS.filter((n) => !flags[n - 1]);

    if (incomplete.length > 0) {
      showToast(`Lengkapi Seksi ${incomplete.join(', ')} sebelum menyimpan`, 'error');
      document.getElementById(`seksi-${incomplete[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    saveDraft(context.sasaranId, context.indikatorSasaranId, state);
    showToast('Tersimpan di perangkat ini', 'success');
  });
}
