// Remove the duplicate API_BASE_URL if it has trailing slash issues
export const API_BASE_URL = (import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const apiClient = async (
  endpoint,
  { body, method, ...customConfig } = {}
) => {
  const token = localStorage.getItem("access_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    "ngrok-skip-browser-warning": "true",
    ...customConfig.headers,
  };

  // Ensure endpoint starts with /api if it doesn't already
  let normalizedEndpoint = endpoint;
  if (!normalizedEndpoint.startsWith('/api')) {
    normalizedEndpoint = `/api${normalizedEndpoint}`;
  }
  
  // Build URL safely without double slashes
  let apiUrl = `${API_BASE_URL}${normalizedEndpoint}`;
  
  // Log the URL for debugging
  console.log('API Request URL:', apiUrl);

  const config = {
    method: method || (body ? "POST" : "GET"),
    ...customConfig,
    headers: {
      ...headers,
    },
    mode: "cors",
    credentials: "include", // Add this to include cookies
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(apiUrl, config);

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Authentication failed. Please login again.");
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() };
      }
      
      console.error('API Error Response:', errorData);
      
      // Create a proper error object
      const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      error.response = errorData;
      throw error;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    }

    return null;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};