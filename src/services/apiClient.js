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
 * Generate 4 indicator name candidates from a planning entity statement.
 *
 * @param {'tujuan'|'sasaran'|'program'|'kegiatan'|'sub_kegiatan'} type
 * @param {string} inputText
 * @returns {Promise<string[]>}
 */
export async function getIndicatorOptions(type, inputText) {
  const response = await fetch('/api/v1/recommendations/indicators', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, input_text: inputText }),
  });

  const data = await handleResponse(response);
  return data.indicators; // string[]
}

/**
 * Generate full metadata for the selected indicator.
 *
 * @param {'tujuan'|'sasaran'|'program'|'kegiatan'|'sub_kegiatan'} type
 * @param {string} inputText           Original planning entity statement
 * @param {string} selectedIndicator   Chosen indicator name from Step 1
 * @returns {Promise<object>}
 */
export async function getRecommendations(type, inputText, selectedIndicator) {
  const response = await fetch('/api/v1/recommendations/details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      input_text: inputText,
      selected_indicator: selectedIndicator,
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