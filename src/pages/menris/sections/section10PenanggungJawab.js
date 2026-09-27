import { renderSectionCard } from '../../../components/sectionCard.js';

export function renderSection10(penanggungJawab = '') {
  const body = `
    <div class="input-group">
      <label class="input-group__label" for="penanggung-jawab">Nama / Jabatan Penanggung Jawab <span class="required-mark">*</span></label>
      <input type="text" id="penanggung-jawab" placeholder="Contoh: Kepala Bidang Pengadaan &amp; Pejabat Pembuat Komitmen (PPK) Tim Teknis"
        value="${escapeAttr(penanggungJawab)}" />
    </div>
  `;
  return renderSectionCard(
    10,
    'Penanggung Jawab (Risk Owner / PIC)',
    'Pejabat atau struktural pelaksana yang memegang otoritas pengendalian risiko.',
    body,
    { id: 'seksi-10' }
  );
}

function escapeAttr(str) {
  return String(str ?? '').replace(/"/g, '&quot;');
}

/**
 * @param {function(string):void} onChange
 */
export function initSection10(onChange) {
  const input = document.getElementById('penanggung-jawab');
  input?.addEventListener('input', () => onChange(input.value));
}
