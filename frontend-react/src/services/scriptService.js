import { apiService } from "./api.js";
import { API_CONFIG } from "../constants/config.js";

export const scriptService = {
  async getAllScripts() {
    return await apiService.get(API_CONFIG.ENDPOINTS.SCRIPTS.GET_ALL);
  },

  async createScript(scriptData) {
    return await apiService.post(
      API_CONFIG.ENDPOINTS.SCRIPTS.CREATE,
      scriptData
    );
  },

  async updateScript(id, scriptData) {
    return await apiService.put(
      `${API_CONFIG.ENDPOINTS.SCRIPTS.UPDATE}/${id}`,
      scriptData
    );
  },

  async deleteScript(id) {
    return await apiService.delete(
      `${API_CONFIG.ENDPOINTS.SCRIPTS.DELETE}/${id}`
    );
  },
};
