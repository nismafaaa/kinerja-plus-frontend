/**
 * Labeled <select> matching the .input-group markup used across the app.
 *
 * @param {string} id - unique id/namespace for this field
 * @param {string} label
 * @param {{value:string,label:string}[]} options
 * @param {{selected?:string, hint?:string, required?:boolean}} [opts]
 */
export function renderSelectField(id, label, options, opts = {}) {
  const { selected = '', hint = '', required = false } = opts;
  const optionsHtml = options
    .map((o) => `<option value="${o.value}"${o.value === selected ? ' selected' : ''}>${o.label}</option>`)
    .join('');

  return `
    <div class="input-group select-field" data-field="${id}">
      <label class="input-group__label" for="select-${id}">${label}${required ? ' <span class="required-mark">*</span>' : ''}</label>
      ${hint ? `<p class="input-group__hint">${hint}</p>` : ''}
      <select id="select-${id}" class="select-field__control">
        ${!selected ? '<option value="" disabled selected>Pilih...</option>' : ''}
        ${optionsHtml}
      </select>
    </div>
  `;
}

/**
 * @param {string} id
 * @param {function(string):void} onChange
 */
export function initSelectField(id, onChange) {
  const select = document.getElementById(`select-${id}`);
  if (!select) return;
  select.addEventListener('change', () => onChange(select.value));
}
