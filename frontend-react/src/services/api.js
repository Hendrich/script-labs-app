import { API_CONFIG } from "../constants/config.js";

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      // pastikan cookie (session / csrf) ikut terkirim
      credentials: options.credentials || "include",
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      let data;
      try {
        data = await response.clone().json();
      } catch (_) {
        data = {};
      }

      if (!response.ok) {
        const errorMessage =
          data.error?.message ||
          data.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      if (data.success === false) {
        const errorMessage =
          data.error?.message || data.message || "API request failed";
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
  // CSRF logic removed.

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const apiService = new ApiService();
