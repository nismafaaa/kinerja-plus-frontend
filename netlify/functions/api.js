export async function handler(event, context) {
  // Extract the specific endpoint path after /api/
  // The event.path will look like "/api/v1/health"
  // If we just forward it, we can append it directly to the base URL
  
  const baseUrl = process.env.API_URL || 'http://0.0.0.0:8080';
  
  // Construct the target URL (e.g. http://0.0.0.0:8080/api/v1/health)
  // Assuming the backend also uses /api/...
  // If the backend doesn't expect /api, we'd strip it. 
  // Based on previous apiClient.js, the backend URL was `${BASE_URL}/api/v1/...`
  // So the full path from the frontend is already correct.
  const url = new URL(event.path, baseUrl).toString();

  const username = process.env.API_USERNAME || 'admin';
  const password = process.env.API_PASSWORD || 'admin';
  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  
  // Prepare headers for the fetch request
  const headers = { ...event.headers };
  headers['Authorization'] = authHeader;
  
  // Remove host header so fetch sets the correct one for the target URL
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
    
    // Copy the response headers to pass them back
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
