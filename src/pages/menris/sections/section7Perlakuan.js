import { renderSectionCard } from '../../../components/sectionCard.js';
import { renderRadioGroup, initRadioGroup } from '../../../components/radioGroup.js';

const TREATMENT_OPTIONS = [
  { value: 'AVOID', label: 'AVOID', description: 'Menghindari atau membatalkan aktivitas penyebab risiko.' },
  { value: 'REDUCE', label: 'REDUCE', description: 'Mengurangi kemungkinan atau dampak lewat mitigasi tambahan.' },
  { value: 'TRANSFER', label: 'TRANSFER', description: 'Mengalihkan risiko ke pihak ketiga atau asuransi.' },
  { value: 'ACCEPT', label: 'ACCEPT', description: 'Menerima risiko jika masih berada dalam toleransi.' },
];

export function renderSection7(perlakuanRisiko = '') {
  const body = renderRadioGroup('perlakuan-risiko', 'Perlakuan Risiko', TREATMENT_OPTIONS, perlakuanRisiko);
  return renderSectionCard(
    7,
    'Perlakuan Risiko (Risk Treatment)',
    'Tentukan keputusan strategis untuk menurunkan atau menangani residu risiko.',
    body,
    { id: 'seksi-7' }
  );
}

/**
 * @param {function(string):void} onChange
 */
export function initSection7(onChange) {
  initRadioGroup('perlakuan-risiko', onChange);
}
