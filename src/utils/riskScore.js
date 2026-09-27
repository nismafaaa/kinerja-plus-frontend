/**
 * Shared likelihood x impact risk-scoring logic, used by every section that
 * scores a risk (Analisa Risiko Awal, Skor Pasca-Pengendalian, Skor Final).
 * Bands match the risk matrix demonstrated in docs/menris.html.
 */
const BANDS = [
  { max: 2, label: 'Sangat Rendah', key: 'sangat-rendah' },
  { max: 5, label: 'Rendah', key: 'rendah' },
  { max: 10, label: 'Sedang', key: 'sedang' },
  { max: 16, label: 'Tinggi', key: 'tinggi' },
  { max: Infinity, label: 'Sangat Tinggi', key: 'sangat-tinggi' },
];

/**
 * @param {number|null} likelihood 1-5
 * @param {number|null} impact 1-5
 * @returns {{score:number,label:string,key:string}|null} null until both are set
 */
export function calculateRiskScore(likelihood, impact) {
  if (!likelihood || !impact) return null;
  const score = likelihood * impact;
  const band = BANDS.find((b) => score <= b.max);
  return { score, label: band.label, key: band.key };
}

export const LIKELIHOOD_OPTIONS = [
  { value: '1', label: '1 = Sangat Jarang (<10%)' },
  { value: '2', label: '2 = Jarang (10-30%)' },
  { value: '3', label: '3 = Kadang (30-50%)' },
  { value: '4', label: '4 = Sering (50-75%)' },
  { value: '5', label: '5 = Sangat Sering (>75%)' },
];

export const IMPACT_OPTIONS = [
  { value: '1', label: '1 = Sangat Rendah (< Rp 100 jt)' },
  { value: '2', label: '2 = Rendah (Rp 100 jt - 1 M)' },
  { value: '3', label: '3 = Sedang (Rp 1-5 M)' },
  { value: '4', label: '4 = Tinggi (Rp 5-10 M)' },
  { value: '5', label: '5 = Sangat Tinggi (> Rp 10 M)' },
];
