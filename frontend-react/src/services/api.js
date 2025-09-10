import { API_CONFIG } from "../constants/config.js";

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.csrfToken = null; // cache token di memory
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tambahkan CSRF token untuk metode state-changing jika tersedia
    const method = (config.method || "GET").toUpperCase();
    const stateChanging = ["POST", "PUT", "PATCH", "DELETE"];
    if (
      stateChanging.includes(method) &&
      this.csrfToken &&
      !config.headers["X-CSRF-Token"]
    ) {
      config.headers["X-CSRF-Token"] = this.csrfToken;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Jika server mengirim token baru (misal refresh/rotasi), perbarui cache
      const respCsrf = response.headers.get("X-CSRF-Token");
      if (respCsrf && respCsrf !== this.csrfToken) {
        this.csrfToken = respCsrf;
        try {
          sessionStorage.setItem("csrfToken", respCsrf);
        } catch (_) {
          /* ignore */
        }
      }

      if (!response.ok) {
        // Handle API error response
        const errorMessage =
          data.error?.message ||
          data.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Check if API response indicates failure
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

  // Ambil token CSRF awal lewat endpoint harmless (GET)
  async initCsrf(endpoint = API_CONFIG.ENDPOINTS.HEALTH || "/health") {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
      });
      // ambil token dari header
      const token = response.headers.get("X-CSRF-Token");
      if (token) {
        this.csrfToken = token;
        try {
          sessionStorage.setItem("csrfToken", token);
        } catch (_) {
          /* ignore */
        }
        return token;
      }
      return null;
    } catch (e) {
      console.warn("Gagal inisialisasi CSRF token", e);
      return null;
    }
  }

  loadCachedCsrf() {
    if (this.csrfToken) return this.csrfToken;
    try {
      const t = sessionStorage.getItem("csrfToken");
      if (t) this.csrfToken = t;
      return this.csrfToken;
    } catch (_) {
      return null;
    }
  }

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
