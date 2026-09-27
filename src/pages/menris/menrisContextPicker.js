import { deriveEntityId } from '../../services/menrisStorage.js';

// Quick-pick examples so a user can start from a realistic statement instead
// of a blank box — purely a convenience shortcut, the field stays free-text
// and anything typed (including edits to a picked example) is used as-is.
const SASARAN_EXAMPLES = [
  'Efisiensi & Akuntabilitas Anggaran Daerah Serta Peningkatan Kualitas Pengelolaan Keuangan dan Aset Daerah',
  'Peningkatan Kualitas Pelayanan Publik dan Tata Kelola Birokrasi Terintegrasi',
  'Penguatan Ketahanan Ekonomi Daerah dan Pemberdayaan UMKM Berkelanjutan',
  'Peningkatan Kualitas Infrastruktur Dasar dan Konektivitas Wilayah',
  'Optimalisasi Pengelolaan Lingkungan Hidup dan Mitigasi Bencana Daerah',
];

const INDIKATOR_EXAMPLES = [
  'Persentase Realisasi Belanja Modal Tepat Waktu Sesuai Rencana Umum Pengadaan (RUP) dan Spesifikasi Teknis',
  'Indeks Kepuasan Masyarakat (IKM) terhadap Pelayanan Publik Terintegrasi',
  'Persentase Pertumbuhan UMKM Naik Kelas yang Difasilitasi Program Pemberdayaan',
  'Persentase Jalan Kabupaten dalam Kondisi Mantap Sesuai Standar Pelayanan Minimal',
  'Indeks Kualitas Lingkungan Hidup (IKLH) Daerah',
];

function renderExampleChips(name, examples) {
  const chips = examples
    .map((text, i) => `
      <button type="button" class="menris-example-chip" data-example="${name}" data-example-index="${i}" title="${escapeAttr(text)}">
        ${truncate(text, 44)}
      </button>
    `)
    .join('');
  return `
    <div class="menris-example-chips">
      <span class="menris-example-chips__label">Contoh:</span>
      ${chips}
    </div>
  `;
}

function truncate(str, max) {
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

function escapeAttr(str) {
  return String(str ?? '').replace(/"/g, '&quot;');
}

/**
 * Free-text Sasaran & Indikator Sasaran context picker — same UX as the
 * existing Indikator pages' Step 1 (type context, min 5 chars). There is no
 * Sasaran/Indikator Sasaran registry anywhere in this app or in the MenRis
 * API (sasaran_id/indikator_sasaran_id are opaque — the backend never looks
 * them up, it only echoes them back), so the frontend derives a stable id
 * from the entered text instead of faking a lookup/picker over data that
 * doesn't exist.
 */
export function renderMenrisContextPicker() {
  return `
    <section class="step-section section-card menris-context-picker" id="menris-context-picker">
      <div class="section-card__header">
        <div class="step-label section-card__title-block">
          <span class="step-number">&#8226;</span>
          <div>
            <div class="section-card__title">Konteks Sasaran &amp; Indikator Sasaran</div>
            <p class="section-card__subtitle">Tentukan Sasaran dan Indikator Sasaran yang akan dinilai risikonya.</p>
          </div>
        </div>
      </div>
      <div class="section-card__body">
        <div id="menris-context-form">
          <div class="input-group">
            <label class="input-group__label" for="menris-sasaran-text">Sasaran <span class="required-mark">*</span></label>
            <textarea id="menris-sasaran-text" rows="2"
              placeholder="Contoh: Efisiensi &amp; Akuntabilitas Anggaran Daerah Serta Peningkatan Kualitas Pengelolaan Keuangan dan Aset Daerah"></textarea>
            ${renderExampleChips('sasaran', SASARAN_EXAMPLES)}
          </div>
          <div class="input-group">
            <label class="input-group__label" for="menris-indikator-text">Indikator Sasaran <span class="required-mark">*</span></label>
            <textarea id="menris-indikator-text" rows="2"
              placeholder="Contoh: Persentase Realisasi Belanja Modal Tepat Waktu Sesuai RUP dan Spesifikasi Teknis"></textarea>
            ${renderExampleChips('indikator', INDIKATOR_EXAMPLES)}
          </div>
          <button class="btn btn--ai" id="menris-context-submit" disabled type="button">Tetapkan Konteks</button>
        </div>
        <div class="menris-context-summary" id="menris-context-summary" style="display:none;"></div>
      </div>
    </section>
  `;
}

function renderSummary(sasaranText, indikatorText) {
  return `
    <div class="menris-context-summary__row">
      <span class="menris-context-summary__label">Sasaran Terpilih</span>
      <p class="menris-context-summary__value">${sasaranText}</p>
    </div>
    <div class="menris-context-summary__row">
      <span class="menris-context-summary__label">Indikator Sasaran Terpilih</span>
      <p class="menris-context-summary__value">${indikatorText}</p>
    </div>
    <button class="btn btn--outline btn--sm" id="menris-context-edit" type="button">Ubah Konteks</button>
  `;
}

/**
 * @param {function({sasaranId:string,sasaranText:string,indikatorSasaranId:string,indikatorText:string}):void} onContextSet
 */
export function initMenrisContextPicker(onContextSet) {
  const sasaranInput = document.getElementById('menris-sasaran-text');
  const indikatorInput = document.getElementById('menris-indikator-text');
  const submitBtn = document.getElementById('menris-context-submit');
  const form = document.getElementById('menris-context-form');
  const summary = document.getElementById('menris-context-summary');

  if (!sasaranInput || !indikatorInput || !submitBtn) return;

  function validate() {
    const ok = sasaranInput.value.trim().length >= 5 && indikatorInput.value.trim().length >= 5;
    submitBtn.disabled = !ok;
  }

  sasaranInput.addEventListener('input', validate);
  indikatorInput.addEventListener('input', validate);

  const allChips = document.querySelectorAll('.menris-example-chip');

  // The 2 example lists are paired by index (SASARAN_EXAMPLES[i] goes with
  // INDIKATOR_EXAMPLES[i]), so picking either one fills both boxes with the
  // matching pair — they're never selected independently of each other.
  function selectExamplePair(index) {
    sasaranInput.value = SASARAN_EXAMPLES[index];
    indikatorInput.value = INDIKATOR_EXAMPLES[index];
    sasaranInput.dispatchEvent(new Event('input', { bubbles: true }));
    indikatorInput.dispatchEvent(new Event('input', { bubbles: true }));

    allChips.forEach((chip) => {
      chip.classList.toggle('menris-example-chip--active', Number(chip.dataset.exampleIndex) === index);
    });
  }

  allChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      selectExamplePair(Number(chip.dataset.exampleIndex));
      chip.closest('.input-group')?.querySelector('textarea')?.focus();
    });
  });

  submitBtn.addEventListener('click', () => {
    const sasaranText = sasaranInput.value.trim();
    const indikatorText = indikatorInput.value.trim();
    if (sasaranText.length < 5 || indikatorText.length < 5) return;

    const sasaranId = deriveEntityId(sasaranText);
    const indikatorSasaranId = deriveEntityId(indikatorText);

    form.style.display = 'none';
    summary.style.display = 'block';
    summary.innerHTML = renderSummary(sasaranText, indikatorText);
    document.getElementById('menris-context-edit')?.addEventListener('click', () => {
      form.style.display = 'block';
      summary.style.display = 'none';
    });

    onContextSet({ sasaranId, sasaranText, indikatorSasaranId, indikatorText });
  });
}
