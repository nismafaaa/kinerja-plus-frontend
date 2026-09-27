import { renderSectionCard } from '../../../components/sectionCard.js';
import { renderRepeaterList, initRepeaterList } from '../../../components/repeaterList.js';

const PLACEHOLDER = 'Masukkan kontrol mitigasi operasional yang telah berjalan...';

export function renderSection4(existingControls = ['']) {
  const body = renderRepeaterList('existing-controls', existingControls.length ? existingControls : [''], {
    placeholder: PLACEHOLDER,
    addLabel: '+ Tambah Kontrol Pengendalian',
    minItems: 1,
  });
  return renderSectionCard(
    4,
    'Pengendalian Yang Ada Saat Ini',
    'Daftar sistem mitigasi, SOP, atau kontrol eksisting yang telah diterapkan.',
    body,
    { id: 'seksi-4' }
  );
}

/**
 * @param {function(string[]):void} onChange
 */
export function initSection4(onChange) {
  initRepeaterList('existing-controls', { onChange, placeholder: PLACEHOLDER });
}
