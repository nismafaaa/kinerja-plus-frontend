import { renderSectionCard } from '../../../components/sectionCard.js';
import { renderSelectField, initSelectField } from '../../../components/selectField.js';
import { renderRiskScoreBadge, setRiskScoreBadge } from '../../../components/riskScoreBadge.js';
import { LIKELIHOOD_OPTIONS, IMPACT_OPTIONS } from '../../../utils/riskScore.js';

/**
 * Shared markup/wiring for the 3 "likelihood x impact -> banded score"
 * sections (Analisa Risiko Awal / Skor Pasca-Pengendalian Eksisting / Skor
 * Final) — replaces the mockup's 3 near-identical calculate*Risk() functions
 * with one implementation.
 *
 * @param {number} number
 * @param {string} id
 * @param {string} title
 * @param {string} subtitle
 * @param {string} namespace - unique id suffix for this instance
 * @param {string} badgeLabel
 * @param {{kemungkinan:number|null, dampak:number|null}} data
 */
export function renderScoreSection(number, id, title, subtitle, namespace, badgeLabel, data) {
  const body = `
    <div class="score-section__grid">
      ${renderSelectField(`${namespace}-likelihood`, 'Skor Kemungkinan (Likelihood)', LIKELIHOOD_OPTIONS, {
        selected: data.kemungkinan != null ? String(data.kemungkinan) : '',
      })}
      ${renderSelectField(`${namespace}-impact`, 'Skor Dampak (Impact)', IMPACT_OPTIONS, {
        selected: data.dampak != null ? String(data.dampak) : '',
      })}
      ${renderRiskScoreBadge(namespace, badgeLabel)}
    </div>
  `;
  return renderSectionCard(number, title, subtitle, body, { id });
}

/**
 * @param {string} namespace
 * @param {{kemungkinan:number|null, dampak:number|null}} data - mutated in place
 * @param {function({kemungkinan:number|null,dampak:number|null}, {score:number,label:string,key:string}|null):void} onChange
 */
export function initScoreSection(namespace, data, onChange) {
  function refresh() {
    const result = setRiskScoreBadge(namespace, data.kemungkinan, data.dampak);
    onChange(data, result);
  }

  initSelectField(`${namespace}-likelihood`, (value) => {
    data.kemungkinan = value ? Number(value) : null;
    refresh();
  });
  initSelectField(`${namespace}-impact`, (value) => {
    data.dampak = value ? Number(value) : null;
    refresh();
  });

  refresh();
}
