import { calculateRiskScore } from '../utils/riskScore.js';

/**
 * Empty score-badge shell — filled in via setRiskScoreBadge once both
 * likelihood and impact are selected. Same imperative namespaced-setter
 * pattern as indicatorAssessment.js's Kesesuaian meter.
 *
 * @param {string} namespace
 * @param {string} [label]
 */
export function renderRiskScoreBadge(namespace, label = 'Skor Risiko') {
  return `
    <div class="risk-score-badge" id="risk-score-badge-${namespace}">
      <span class="risk-score-badge__label">${label}</span>
      <div class="risk-score-badge__pill risk-score-badge__pill--empty">Belum dinilai</div>
    </div>
  `;
}

/**
 * @param {string} namespace
 * @param {number|null} likelihood
 * @param {number|null} impact
 * @returns {{score:number,label:string,key:string}|null}
 */
export function setRiskScoreBadge(namespace, likelihood, impact) {
  const el = document.getElementById(`risk-score-badge-${namespace}`);
  if (!el) return null;
  const pill = el.querySelector('.risk-score-badge__pill');
  const result = calculateRiskScore(likelihood, impact);

  if (!result) {
    pill.className = 'risk-score-badge__pill risk-score-badge__pill--empty';
    pill.textContent = 'Belum dinilai';
    return null;
  }

  pill.className = `risk-score-badge__pill risk-score-badge__pill--${result.key}`;
  pill.textContent = `Skor ${result.score} • ${result.label}`;
  return result;
}
