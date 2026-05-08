import { apiClient } from "../apiClient";

const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  VALIDATE_TOKEN: "/api/auth/validate",
  REFRESH_TOKEN: "/api/auth/refresh",
};


export const loginUser = async (credentials) => {
  try {
    const response = await apiClient(AUTH_ENDPOINTS.LOGIN, {
      method: "POST",
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    });
    if (response && response.success === false) {
      throw new Error(response.error || "Login failed");
    }
    if (response?.data?.access_token) {
      return {
        access_token: response.data.access_token,
        exp: response.data.exp,
        message: response.data.message,
      };
    }
    if (response?.access_token) {
      return response;
    }

    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

