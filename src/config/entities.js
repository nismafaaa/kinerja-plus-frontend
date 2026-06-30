/**
 * ENTITY_CONFIG — single source of truth for all planning entity types.
 *
 * Adding a new entity type in the future requires only adding an entry here.
 * No other file needs to be touched.
 *
 * @typedef {Object} EntityConfig
 * @property {string} type              - API type value (matches backend enum)
 * @property {string} label             - Short human label (e.g. "Tujuan")
 * @property {string} pageTitle         - Page header title
 * @property {string} pageSubtitle      - Page header subtitle
 * @property {string} inputLabel        - Textarea label
 * @property {string} inputPlaceholder  - Textarea placeholder
 * @property {string} forecastContextKey- Field key sent to POST /api/v1/forecast
 * @property {string} hash              - URL hash for client-side routing
 * @property {string} navLabel          - Sidebar navigation link label
 * @property {number} hierarchyLevel    - Visual indent level (0 = top)
 */

/** @type {Record<string, EntityConfig>} */
export const ENTITY_CONFIG = {
  tujuan: {
    type: 'tujuan',
    label: 'Tujuan',
    pageTitle: 'Indikator Tujuan',
    pageSubtitle: 'Susun indikator kinerja berdasarkan Tujuan Strategis dengan bantuan AI',
    inputLabel: 'Tujuan Strategis',
    inputPlaceholder:
      'Contoh: Meningkatnya kualitas penyelenggaraan pemerintahan dan pelayanan publik yang baik dan akuntabel',
    forecastContextKey: 'tujuan',
    hash: '#/indikator-tujuan',
    navLabel: 'Indikator Tujuan',
    hierarchyLevel: 0,
  },
  sasaran: {
    type: 'sasaran',
    label: 'Sasaran',
    pageTitle: 'Indikator Sasaran',
    pageSubtitle: 'Susun indikator kinerja berdasarkan Sasaran Strategis dengan bantuan AI',
    inputLabel: 'Sasaran Strategis',
    inputPlaceholder:
      'Contoh: Meningkatnya akses dan kualitas pendidikan dasar yang merata di seluruh wilayah',
    forecastContextKey: 'sasaran_strategis',
    hash: '#/indikator-sasaran',
    navLabel: 'Indikator Sasaran',
    hierarchyLevel: 1,
  },
  program: {
    type: 'program',
    label: 'Program',
    pageTitle: 'Indikator Program',
    pageSubtitle: 'Susun indikator kinerja berdasarkan Program kerja OPD dengan bantuan AI',
    inputLabel: 'Program',
    inputPlaceholder:
      'Contoh: Program Peningkatan Pelayanan Kesehatan Masyarakat',
    forecastContextKey: 'program',
    hash: '#/indikator-program',
    navLabel: 'Indikator Program',
    hierarchyLevel: 2,
  },
  kegiatan: {
    type: 'kegiatan',
    label: 'Kegiatan',
    pageTitle: 'Indikator Kegiatan',
    pageSubtitle: 'Susun indikator kinerja berdasarkan Kegiatan operasional OPD dengan bantuan AI',
    inputLabel: 'Kegiatan',
    inputPlaceholder:
      'Contoh: Pelayanan Kesehatan pada Usia Produktif',
    forecastContextKey: 'kegiatan',
    hash: '#/indikator-kegiatan',
    navLabel: 'Indikator Kegiatan',
    hierarchyLevel: 3,
  },
  sub_kegiatan: {
    type: 'sub_kegiatan',
    label: 'Sub Kegiatan',
    pageTitle: 'Indikator Sub Kegiatan',
    pageSubtitle: 'Susun indikator kinerja berdasarkan Sub Kegiatan dengan bantuan AI',
    inputLabel: 'Sub Kegiatan',
    inputPlaceholder:
      'Contoh: Pengelolaan Sistem Informasi Kepegawaian',
    forecastContextKey: 'sub_kegiatan',
    hash: '#/indikator-sub-kegiatan',
    navLabel: 'Indikator Sub Kegiatan',
    hierarchyLevel: 4,
  },
};

/**
 * Canonical order of detail fields returned by POST /api/v1/recommendations/details.
 * uraianIndikator is always rendered as read-only (the chosen indicator name).
 */
export const FIELD_ORDER = [
  'uraianIndikator',
  'indikatorMinimum',
  'sasaranStrategis',
  'definisiOperasional',
  'rumusHitung',
  'satuan',
  'sumberData',
];

/**
 * Return the EntityConfig for the current URL hash.
 * Falls back to 'tujuan' if no match is found.
 *
 * @returns {EntityConfig}
 */
export function getEntityConfigFromHash() {
  const hash = window.location.hash || '#/indikator-tujuan';
  return (
    Object.values(ENTITY_CONFIG).find((cfg) => hash.includes(cfg.hash.replace('#/', ''))) ||
    ENTITY_CONFIG.tujuan
  );
}
