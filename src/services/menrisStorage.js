/**
 * MenRis has no backend persistence at all (see docs/API_CONTRACT.md §6/§8 —
 * every endpoint is stateless, no record ID, no list/history). This service
 * is the frontend's own client-only safety net: it never talks to a server,
 * it only reads/writes localStorage. Draft data here is NOT shared across
 * devices/browsers and is NOT synced anywhere — UI copy must always reflect
 * that ("Tersimpan di perangkat ini", never wording that implies real sync).
 */

function fnv1aHash(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Deterministic client-side id for a Sasaran/Indikator Sasaran text entry.
 * The MenRis API treats sasaran_id/indikator_sasaran_id as opaque — it never
 * validates or looks them up, only echoes them back — so re-entering the
 * same text always yields the same id, which is what lets a returning user
 * find their prior draft for that exact Sasaran/Indikator combination.
 *
 * @param {string} text
 * @returns {string}
 */
export function deriveEntityId(text) {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
  return `mr-${fnv1aHash(normalized)}`;
}

const STORAGE_PREFIX = 'menris-draft:';

export function buildDraftKey(sasaranId, indikatorSasaranId) {
  return `${STORAGE_PREFIX}${sasaranId}:${indikatorSasaranId}`;
}

/**
 * @returns {boolean} false on failure (e.g. quota exceeded) — never throws
 */
export function saveDraft(sasaranId, indikatorSasaranId, state) {
  if (!sasaranId || !indikatorSasaranId) return false;
  try {
    localStorage.setItem(
      buildDraftKey(sasaranId, indikatorSasaranId),
      JSON.stringify({ ...state, savedAt: Date.now() })
    );
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @returns {object|null}
 */
export function loadDraft(sasaranId, indikatorSasaranId) {
  if (!sasaranId || !indikatorSasaranId) return null;
  try {
    const raw = localStorage.getItem(buildDraftKey(sasaranId, indikatorSasaranId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearDraft(sasaranId, indikatorSasaranId) {
  try {
    localStorage.removeItem(buildDraftKey(sasaranId, indikatorSasaranId));
  } catch (e) {
    // ignore — nothing meaningful to recover from here
  }
}
