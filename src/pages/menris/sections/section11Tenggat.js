import { renderSectionCard } from '../../../components/sectionCard.js';
import { countRemainingBusinessDays } from '../../../utils/businessDays.js';

export function renderSection11(tenggatWaktu = '') {
  const body = `
    <div class="input-group">
      <label class="input-group__label" for="tenggat-waktu">Batas Waktu Penyelesaian <span class="required-mark">*</span></label>
      <input type="date" id="tenggat-waktu" value="${tenggatWaktu}" />
    </div>
    <div id="menris-deadline-info"></div>
  `;
  return renderSectionCard(
    11,
    'Tenggat Waktu Mitigasi',
    'Batas akhir implementasi seluruh paket perlakuan risiko yang dibutuhkan.',
    body,
    { id: 'seksi-11' }
  );
}

function renderDeadlineInfo(dateString) {
  const el = document.getElementById('menris-deadline-info');
  if (!el) return;

  if (!dateString) {
    el.innerHTML = '';
    return;
  }

  const days = countRemainingBusinessDays(dateString);
  if (days === null) {
    el.innerHTML = '';
  } else if (days < 0) {
    el.innerHTML = `<p class="input-group__hint" style="color:var(--color-danger);">Tenggat telah lewat ${Math.abs(days)} hari kerja.</p>`;
  } else {
    el.innerHTML = `<p class="input-group__hint">Sisa durasi implementasi mitigasi: ${days} hari kerja.</p>`;
  }
}

/**
 * @param {function(string):void} onChange
 */
export function initSection11(onChange) {
  const input = document.getElementById('tenggat-waktu');
  if (!input) return;
  renderDeadlineInfo(input.value);
  input.addEventListener('input', () => {
    renderDeadlineInfo(input.value);
    onChange(input.value);
  });
}
