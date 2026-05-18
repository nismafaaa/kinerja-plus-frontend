export async function handler(event, context) {
  const baseUrl = process.env.API_URL || 'http://0.0.0.0:8080';
  const url = new URL(event.path, baseUrl).toString();

  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  const headers = { ...event.headers };
  headers['Authorization'] = authHeader;

  delete headers['host'];

  try {
    const fetchOptions = {
      method: event.httpMethod,
      headers: headers,
    };

    if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
      fetchOptions.body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    const responseHeaders = {};
    for (const [key, value] of response.headers.entries()) {
      responseHeaders[key] = value;
    }

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: data
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error proxying to backend' })
    };
  }
}