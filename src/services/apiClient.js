/**
 * API Client for Kinerja Plus AI
 */

const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const USERNAME = import.meta.env.VITE_API_USERNAME || import.meta.env.NEXT_PUBLIC_API_USERNAME || 'admin';
const PASSWORD = import.meta.env.VITE_API_PASSWORD || import.meta.env.NEXT_PUBLIC_API_PASSWORD || 'admin';

const getAuthHeader = () => {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  return `Basic ${credentials}`;
};

/**
 * Handle API responses based on envelope standard
 */
async function handleResponse(response) {
  if (!response.ok && response.status === 401) {
    throw new Error('Unauthorized. Please check your credentials.');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error(`Invalid JSON response: ${e.message}`);
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
  const response = await fetch(`${BASE_URL}/api/v1/health`);
  return handleResponse(response);
}

export async function getRecommendations(type, inputText) {
  const response = await fetch(`${BASE_URL}/api/v1/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader()
    },
    body: JSON.stringify({ type, input_text: inputText })
  });

  return handleResponse(response);
}

export async function getForecastRecommendations(payload) {
  const response = await fetch(`${BASE_URL}/api/v1/forecast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader()
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}