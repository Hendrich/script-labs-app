// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
    },
    SCRIPTS: {
      GET_ALL: "/api/labs",
      CREATE: "/api/labs",
      UPDATE: "/api/labs",
      DELETE: "/api/labs",
    },
  },
};

export const APP_CONFIG = {
  APP_NAME: "Script Labs",
  VERSION: "1.0.0",
};
