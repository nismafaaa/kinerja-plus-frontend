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

/**
 * MenRis Seksi 1: identify a risk statement/cause/controllability/impact
 * from a Sasaran + Indikator Sasaran context.
 *
 * @param {{sasaran_id: string, sasaran_text: string, indikator_sasaran_id: string, indikator_sasaran_text: string}} payload
 * @returns {Promise<{sasaran_id: string, sasaran_text: string, indikator_sasaran_id: string, indikator_sasaran_text: string, pernyataan_risiko: string, penyebab_risiko: string, uc_c: 'C'|'UC', dampak_risiko: string, reasoning: string}>}
 */
export async function getRiskIdentification(payload) {
  const response = await fetch('/api/v1/menris/identifikasi-risiko', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

/**
 * MenRis Seksi 2: classify a risk into one of the 5 fixed categories.
 *
 * @param {{sasaran_text: string, indikator_sasaran_text: string, pernyataan_risiko: string, penyebab_risiko: string, dampak_risiko: string}} payload
 * @returns {Promise<{kategori_risiko: 'Keuangan'|'Kepatuhan'|'Pengadaan'|'Aset'|'Operasional', reasoning: string}>}
 */
export async function getRiskCategory(payload) {
  const response = await fetch('/api/v1/menris/kategori-risiko', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

/**
 * MenRis Seksi 8: recommend one additional mitigation action. Returns a
 * single recommendation per call by design — call again for more.
 *
 * @param {{pernyataan_risiko: string, existing_controls: string[], skor_kemungkinan_residual?: number, skor_dampak_residual?: number, perlakuan_risiko?: 'AVOID'|'REDUCE'|'TRANSFER'|'ACCEPT'}} payload
 * @returns {Promise<{pengendalian_tambahan: string, reasoning: string}>}
 */
export async function getAdditionalControlRecommendation(payload) {
  const response = await fetch('/api/v1/menris/pengendalian-tambahan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}
