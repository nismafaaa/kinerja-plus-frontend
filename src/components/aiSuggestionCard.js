import { AI_TIP_TEXT } from '../config/uiCopy.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Render the compact "Rekomendasi AI" reference row + "Tips AI" hint,
 * reused underneath any editable field that has an AI-generated suggestion.
 *
 * @param {string} recommendedText
 * @param {string} idSuffix - unique id suffix (e.g. `${fieldKey}-${namespace}`)
 */
export function renderAiSuggestionCard(recommendedText, idSuffix) {
  return `
    <div class="ai-suggestion-card">
      <span class="ai-suggestion-card__icon">AI</span>
      <span class="ai-suggestion-card__title">Rekomendasi AI</span>
      <span class="ai-suggestion-card__divider"></span>
      <span class="ai-suggestion-card__text">Hasil Rekomendasi: ${escapeHtml(recommendedText)}</span>
      <button class="btn btn--outline btn--sm ai-suggestion-card__btn" id="btn-use-recommendation-${idSuffix}">
        <span class="ai-suggestion-card__btn-icon">⧉</span> Gunakan
      </button>
    </div>
    <div class="ai-tip-row">
      <span class="ai-tip-row__icon">💡</span>
      <span><span class="ai-tip-row__label">Tips AI:</span> ${escapeHtml(AI_TIP_TEXT)}</span>
    </div>
  `;
}

/**
 * Wire the "Gunakan" button: copies the AI recommendation into the given
 * textarea and fires an `input` event so any listeners on it react.
 *
 * @param {object} opts
 * @param {string} opts.idSuffix
 * @param {string} opts.recommendedText
 * @param {HTMLTextAreaElement|null} opts.targetTextarea
 * @param {function} [opts.onUse]
 */
export function initAiSuggestionCard({ idSuffix, recommendedText, targetTextarea, onUse }) {
  const btn = document.getElementById(`btn-use-recommendation-${idSuffix}`);
  btn?.addEventListener('click', () => {
    if (targetTextarea) {
      targetTextarea.value = recommendedText;
      targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      targetTextarea.focus();
    }
    if (onUse) onUse();
  });
}
