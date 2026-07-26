import { renderAiSuggestionCard, initAiSuggestionCard } from './aiSuggestionCard.js';

/**
 * Render a metadata field as an empty, freely-editable input with the AI
 * recommendation shown as a reference card underneath (no accept/edit/reject
 * actions — the user just types their own value or clicks "Gunakan").
 *
 * @param {string} fieldKey - e.g. 'definisiOperasional'
 * @param {{label: string, value: string}} data
 * @param {string} namespace - unique id suffix for this page (entity type)
 */
export function renderAiAssistedField(fieldKey, data, namespace) {
  const idSuffix = `${fieldKey}-${namespace}`;
  return `
    <div class="input-group ai-assisted-field" data-field="${fieldKey}">
      <label class="input-group__label" for="field-input-${idSuffix}">${data.label}</label>
      <textarea id="field-input-${idSuffix}" placeholder="Ketik ${data.label.toLowerCase()}, atau gunakan rekomendasi AI di bawah"></textarea>
      ${renderAiSuggestionCard(data.value, idSuffix)}
    </div>
  `;
}

/**
 * Wire the "Gunakan" button for a metadata field's AI suggestion card.
 *
 * @param {string} fieldKey
 * @param {{label: string, value: string}} data
 * @param {string} namespace
 */
export function initAiAssistedField(fieldKey, data, namespace) {
  const idSuffix = `${fieldKey}-${namespace}`;
  const textarea = document.getElementById(`field-input-${idSuffix}`);
  initAiSuggestionCard({
    idSuffix,
    recommendedText: data.value,
    targetTextarea: textarea,
  });
}
