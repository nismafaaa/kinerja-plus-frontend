/**
 * Recommendation card component with Accept / Edit / Reject actions.
 *
 * Each card has a unique ID based on fieldKey to manage state.
 */

/**
 * Render a single recommendation card.
 * @param {string} fieldKey - Unique key (e.g. 'uraianIndikator')
 * @param {object} data - { label, value, reasoning }
 * @param {number} index - Animation delay index
 */
export function renderRecommendationCard(fieldKey, data, index = 0) {
  const animDelay = index * 0.08;
  return `
    <div class="rec-card" id="rec-${fieldKey}" style="animation-delay: ${animDelay}s" data-field="${fieldKey}">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">✨</span>
          ${data.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-${fieldKey}">Rekomendasi AI</span>
      </div>
      <div class="rec-card__value" id="value-${fieldKey}">${data.value}</div>
      <div class="rec-card__reasoning">
        <span class="rec-card__reasoning-icon">💡</span>
        <span>${data.reasoning}</span>
      </div>
      <div class="rec-card__edit-area" id="edit-area-${fieldKey}" style="display:none;">
        <textarea id="edit-input-${fieldKey}">${data.value}</textarea>
      </div>
      <div class="rec-card__actions" id="actions-${fieldKey}">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${fieldKey}">
          ✅ Terima
        </button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${fieldKey}">
          ✏️ Edit
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${fieldKey}">
          ❌ Tolak
        </button>
      </div>
    </div>
  `;
}

/**
 * Render the target period card (special layout with grid).
 */
export function renderTargetCard(data, index = 0) {
  const animDelay = index * 0.08;
  const gridItems = Object.entries(data.values)
    .map(
      ([year, val]) => `
      <div class="target-grid__item">
        <div class="target-grid__year">Target ${year}</div>
        <div class="target-grid__value">${val}</div>
        <div class="target-grid__trend">▲</div>
      </div>
    `
    )
    .join('');

  return `
    <div class="rec-card" id="rec-targetPeriode" style="animation-delay: ${animDelay}s" data-field="targetPeriode">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">✨</span>
          ${data.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-targetPeriode">Rekomendasi AI</span>
      </div>
      <div class="target-grid" id="value-targetPeriode">
        ${gridItems}
      </div>
      <div class="rec-card__reasoning" style="margin-top: var(--space-md);">
        <span class="rec-card__reasoning-icon">💡</span>
        <span>${data.reasoning}</span>
      </div>
      <div class="rec-card__actions" id="actions-targetPeriode">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="targetPeriode">
          ✅ Terima Semua Target
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="targetPeriode">
          ❌ Tolak
        </button>
      </div>
    </div>
  `;
}

/**
 * Initialize action button handlers for all recommendation cards.
 * Manages accept/edit/reject state transitions.
 *
 * @param {object} recommendations - Full recommendation data
 * @param {function} onStateChange - Callback when any card changes state
 */
export function initCardActions(recommendations, onStateChange) {
  // Track state per field
  const state = {};
  const fieldKeys = Object.keys(recommendations);
  fieldKeys.forEach((key) => {
    state[key] = { status: 'pending', value: recommendations[key].value || '' };
  });

  document.addEventListener('click', function handler(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const field = btn.dataset.field;
    if (!field || !state[field]) return;

    const card = document.getElementById(`rec-${field}`);
    const statusEl = document.getElementById(`status-${field}`);
    const actionsEl = document.getElementById(`actions-${field}`);
    const editArea = document.getElementById(`edit-area-${field}`);
    const valueEl = document.getElementById(`value-${field}`);

    if (action === 'accept') {
      // If currently editing, use the edited value
      if (state[field].status === 'editing' && editArea) {
        const editInput = document.getElementById(`edit-input-${field}`);
        if (editInput) {
          state[field].value = editInput.value;
          if (valueEl) valueEl.textContent = editInput.value;
        }
        editArea.style.display = 'none';
      }

      state[field].status = 'accepted';
      card.classList.remove('rec-card--rejected');
      card.classList.add('rec-card--accepted');
      statusEl.className = 'rec-card__status rec-card__status--accepted';
      statusEl.textContent = '✓ Diterima';

      // Replace actions with "undo" option
      actionsEl.innerHTML = `
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${field}">
          ↩ Batalkan
        </button>
      `;

      showToast('Rekomendasi diterima', 'success');
    }

    if (action === 'edit') {
      state[field].status = 'editing';
      statusEl.className = 'rec-card__status rec-card__status--editing';
      statusEl.textContent = 'Sedang Diedit';

      if (editArea) editArea.style.display = 'block';

      actionsEl.innerHTML = `
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">
          💾 Simpan
        </button>
        <button class="btn btn--outline btn--sm" data-action="cancel-edit" data-field="${field}">
          Batal
        </button>
      `;
    }

    if (action === 'cancel-edit') {
      state[field].status = 'pending';
      statusEl.className = 'rec-card__status rec-card__status--pending';
      statusEl.textContent = 'Rekomendasi AI';

      if (editArea) editArea.style.display = 'none';

      actionsEl.innerHTML = `
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">✅ Terima</button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${field}">✏️ Edit</button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">❌ Tolak</button>
      `;
    }

    if (action === 'reject') {
      state[field].status = 'rejected';
      card.classList.add('rec-card--rejected');
      statusEl.className = 'rec-card__status';
      statusEl.textContent = 'Ditolak';

      actionsEl.innerHTML = `
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${field}">
          ↩ Kembalikan
        </button>
      `;

      showToast('Rekomendasi ditolak', 'info');
    }

    if (action === 'undo') {
      state[field].status = 'pending';
      card.classList.remove('rec-card--accepted', 'rec-card--rejected');
      statusEl.className = 'rec-card__status rec-card__status--pending';
      statusEl.textContent = 'Rekomendasi AI';

      const isTarget = field === 'targetPeriode';
      actionsEl.innerHTML = isTarget
        ? `
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">✅ Terima Semua Target</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">❌ Tolak</button>
        `
        : `
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${field}">✅ Terima</button>
          <button class="btn btn--outline btn--sm" data-action="edit" data-field="${field}">✏️ Edit</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${field}">❌ Tolak</button>
        `;
    }

    if (onStateChange) onStateChange(state);
  });

  return state;
}

/**
 * Show a temporary toast notification.
 */
function showToast(message, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach((t) => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
