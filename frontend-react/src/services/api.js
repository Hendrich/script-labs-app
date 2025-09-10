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
      // pastikan cookie (session / csrf) ikut terkirim
      credentials: options.credentials || "include",
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

    let attemptedCsrfRefresh = false;

    const doFetch = async () => {
      const response = await fetch(url, config);
      // Coba parse JSON aman (beberapa endpoint health bisa tidak ada body JSON)
      let data;
      try {
        data = await response.clone().json();
      } catch (_) {
        data = {};
      }

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

      // Ambil token dari body jika backend kirim di JSON (fallback)
      if (!this.csrfToken && (data?.csrfToken || data?.data?.csrfToken)) {
        this.csrfToken = data.csrfToken || data.data.csrfToken;
        try {
          sessionStorage.setItem("csrfToken", this.csrfToken);
        } catch (_) {}
      }

      if (!response.ok || data.success === false) {
        const errorMessage =
          data.error?.message ||
          data.message ||
          `HTTP error! status: ${response.status}`;
        const isCsrfError =
          /csrf/i.test(errorMessage || "") ||
          (data.error?.code || "").includes("CSRF");
        if (isCsrfError && !attemptedCsrfRefresh) {
          attemptedCsrfRefresh = true;
          // Refresh token & retry sekali
          await this.initCsrf();
          // sisipkan ulang header kalau sudah dapat token
          if (stateChanging.includes(method) && this.csrfToken) {
            config.headers["X-CSRF-Token"] = this.csrfToken;
          }
          return doFetch();
        }
        throw new Error(errorMessage);
      }
      return data;
    };

    try {
      return await doFetch();
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
        credentials: "include",
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
      // fallback baca body jika ada
      try {
        const body = await response.clone().json();
        const bToken = body?.csrfToken || body?.data?.csrfToken;
        if (bToken) {
          this.csrfToken = bToken;
          try {
            sessionStorage.setItem("csrfToken", bToken);
          } catch (_) {}
          return bToken;
        }
      } catch (_) {
        /* ignore */
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
