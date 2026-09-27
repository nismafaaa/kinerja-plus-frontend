import { renderSectionCard } from '../../../components/sectionCard.js';
import { renderSelectField, initSelectField } from '../../../components/selectField.js';

const APPETITE_OPTIONS = [
  { value: '1-2', label: '1 - 2 = Sangat Rendah', max: 2 },
  { value: '3-4', label: '3 - 4 = Rendah', max: 4 },
  { value: '6-9', label: '6 - 9 = Sedang', max: 9 },
  { value: '12-16', label: '12 - 16 = Tinggi', max: 16 },
  { value: '20-25', label: '20 - 25 = Sangat Tinggi', max: 25 },
];

export function renderSection6(seleraRisiko = '') {
  const body = `
    ${renderSelectField('selera-risiko', 'Toleransi / Selera Risiko Organisasi', APPETITE_OPTIONS, {
      selected: seleraRisiko,
      required: true,
    })}
    <p class="menris-appetite-warning" id="menris-appetite-warning" style="display:none;"></p>
  `;
  return renderSectionCard(
    6,
    'Selera Risiko (Risk Appetite)',
    'Batas toleransi maksimal risiko yang dapat diterima pemerintah daerah / organisasi.',
    body,
    { id: 'seksi-6' }
  );
}

/**
 * @param {object} opts
 * @param {function():string} opts.getSeleraRisiko
 * @param {function():{score:number,label:string,key:string}|null} opts.getResidualScore - Seksi 5's current score
 * @param {function(string):void} opts.onChange
 * @returns {function():void} call to refresh the warning banner from outside (e.g. when Seksi 5 changes)
 */
export function initSection6({ getResidualScore, onChange }) {
  const warningEl = document.getElementById('menris-appetite-warning');
  if (!warningEl) return () => {};

  function refreshWarning() {
    const select = document.getElementById('select-selera-risiko');
    const residual = getResidualScore();
    const appetite = APPETITE_OPTIONS.find((o) => o.value === select?.value);

    if (!residual || !appetite) {
      warningEl.style.display = 'none';
      return;
    }

    if (residual.score > appetite.max) {
      warningEl.textContent = `Karena skor saat ini (${residual.score} - ${residual.label}) melampaui selera risiko (${appetite.label}), tindakan perlakuan risiko wajib dirumuskan.`;
      warningEl.style.display = 'block';
    } else {
      warningEl.style.display = 'none';
    }
  }

  initSelectField('selera-risiko', (value) => {
    onChange(value);
    refreshWarning();
  });

  refreshWarning();
  return refreshWarning;
}
