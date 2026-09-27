/**
 * Radio button group with card-style options (used for uc_c and
 * perlakuan_risiko). Native `change` events are enough here — no delegated
 * click handling needed like recommendationCard's accept/edit/reject flow.
 *
 * @param {string} name - unique id/namespace (also the radio input `name`)
 * @param {string} label
 * @param {{value:string,label:string,description?:string}[]} options
 * @param {string} [selected]
 */
export function renderRadioGroup(name, label, options, selected = '') {
  const optionsHtml = options
    .map(
      (o) => `
        <label class="radio-group__option${o.value === selected ? ' radio-group__option--selected' : ''}">
          <input type="radio" name="${name}" value="${o.value}"${o.value === selected ? ' checked' : ''} />
          <div class="radio-group__option-body">
            <span class="radio-group__option-label">${o.label}</span>
            ${o.description ? `<span class="radio-group__option-desc">${o.description}</span>` : ''}
          </div>
        </label>
      `
    )
    .join('');

  return `
    <div class="input-group radio-group" data-field="${name}">
      <label class="input-group__label">${label} <span class="required-mark">*</span></label>
      <div class="radio-group__options">${optionsHtml}</div>
    </div>
  `;
}

/**
 * @param {string} name
 * @param {function(string):void} onChange
 */
export function initRadioGroup(name, onChange) {
  const inputs = document.querySelectorAll(`input[name="${name}"]`);
  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      inputs.forEach((i) => {
        i.closest('.radio-group__option')?.classList.toggle('radio-group__option--selected', i === input);
      });
      onChange(input.value);
    });
  });
}
