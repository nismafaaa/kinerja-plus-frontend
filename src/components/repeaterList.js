/**
 * Generic add/remove repeater of free-text rows (used for MenRis Seksi 4's
 * "Pengendalian yang Ada Saat Ini" list). Delegated-click style borrowed
 * from recommendationCard.js's initCardActions.
 *
 * @param {string} name - unique id/namespace
 * @param {string[]} items - initial values (pass [''] for a single empty row)
 * @param {{placeholder?:string, addLabel?:string, minItems?:number}} [opts]
 */
export function renderRepeaterList(name, items, opts = {}) {
  const { placeholder = '', addLabel = '+ Tambah', minItems = 1 } = opts;
  const rows = items.map((value, i) => renderRow(name, i, value, placeholder)).join('');

  return `
    <div class="repeater-list" id="repeater-${name}" data-name="${name}" data-min-items="${minItems}">
      <div class="repeater-list__rows">${rows}</div>
      <button type="button" class="btn btn--outline btn--sm repeater-list__add-btn" data-repeater-add="${name}">
        ${addLabel}
      </button>
    </div>
  `;
}

function renderRow(name, index, value, placeholder) {
  return `
    <div class="repeater-list__row" data-repeater-row="${name}" data-index="${index}">
      <div class="repeater-list__badge">${index + 1}</div>
      <input type="text" class="repeater-list__input" data-repeater-input="${name}"
             value="${escapeAttr(value)}" placeholder="${placeholder}" />
      <button type="button" class="repeater-list__remove-btn" data-repeater-remove="${name}" title="Hapus">&#10005;</button>
    </div>
  `;
}

function escapeAttr(str) {
  return String(str ?? '').replace(/"/g, '&quot;');
}

/**
 * Wires add/remove/edit. Calls onChange(values[]) whenever the row set or a
 * row's text changes; renumbers badges after a removal.
 *
 * @param {string} name
 * @param {{onChange:function(string[]):void, placeholder?:string}} opts
 */
export function initRepeaterList(name, { onChange, placeholder = '' }) {
  const container = document.getElementById(`repeater-${name}`);
  if (!container) return;
  const rowsContainer = container.querySelector('.repeater-list__rows');
  const minItems = parseInt(container.dataset.minItems, 10) || 1;

  function currentValues() {
    return Array.from(rowsContainer.querySelectorAll(`[data-repeater-input="${name}"]`)).map((el) => el.value);
  }

  function renumber() {
    Array.from(rowsContainer.children).forEach((row, i) => {
      row.dataset.index = i;
      const badge = row.querySelector('.repeater-list__badge');
      if (badge) badge.textContent = i + 1;
    });
  }

  rowsContainer.addEventListener('input', (e) => {
    if (e.target.matches(`[data-repeater-input="${name}"]`)) onChange(currentValues());
  });

  container.addEventListener('click', (e) => {
    if (e.target.closest(`[data-repeater-add="${name}"]`)) {
      const index = rowsContainer.children.length;
      const temp = document.createElement('div');
      temp.innerHTML = renderRow(name, index, '', placeholder);
      rowsContainer.appendChild(temp.firstElementChild);
      onChange(currentValues());
      return;
    }

    const removeBtn = e.target.closest(`[data-repeater-remove="${name}"]`);
    if (removeBtn) {
      if (rowsContainer.children.length <= minItems) return;
      removeBtn.closest(`[data-repeater-row="${name}"]`)?.remove();
      renumber();
      onChange(currentValues());
    }
  });
}
