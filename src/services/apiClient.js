async function handleResponse(response) {
  if (response.status === 401) {
    throw new Error('Unauthorized. Periksa kredensial API.');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error(`Respons JSON tidak valid: ${e.message}`);
  }

  if (!data.success) {
    const err = new Error(data.error?.message || 'Unknown API Error');
    err.code = data.error?.code;
    err.details = data.error?.details;
    throw err;
  }

  return data.data;
}

export async function getHealth() {
  const response = await fetch('/api/v1/health');
  return handleResponse(response);
}

/**
 * Step 1: get a single AI-recommended indicator name + reasoning for a
 * planning entity's context text.
 *
 * @param {'tujuan'|'sasaran'|'program'|'kegiatan'|'sub_kegiatan'} type
 * @param {string} contextText
 * @returns {Promise<{type: string, context_text: string, indicator: string, reasoning: string}>}
 */
export async function getIndicatorRecommendation(type, contextText) {
  const response = await fetch('/api/v1/recommendations/indicator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      context_text: contextText,
    }),
  });

  return handleResponse(response);
}

/**
 * Step 2: assess the current indicator text against the 4 SMART criteria.
 *
 * @param {'tujuan'|'sasaran'|'program'|'kegiatan'|'sub_kegiatan'} type
 * @param {string} contextText
 * @param {string} indicator
 * @returns {Promise<object>}
 */
export async function getSmartAssessment(type, contextText, indicator) {
  const response = await fetch('/api/v1/recommendations/smart-assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      context_text: contextText,
      indicator,
    }),
  });

  return handleResponse(response);
}

/**
 * Step 3: generate full metadata for the selected indicator.
 *
 * @param {'tujuan'|'sasaran'|'program'|'kegiatan'|'sub_kegiatan'} type
 * @param {string} contextText           Original planning entity statement
 * @param {string} indicator             Final indicator name (Step 1 output, edited, or custom)
 * @returns {Promise<object>}
 */
export async function getIndicatorDetails(type, contextText, indicator) {
  const response = await fetch('/api/v1/recommendations/details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      context_text: contextText,
      indicator,
    }),
  });

  return handleResponse(response);
}

export async function getForecastRecommendations(payload) {
  const response = await fetch('/api/v1/forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}
