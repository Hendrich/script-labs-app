import { useState, useEffect } from "react";
import { scriptService } from "../services/scriptService.js";

export const useScripts = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScripts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await scriptService.getAllScripts();
      setScripts(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createScript = async (scriptData) => {
    try {
      setLoading(true);
      const response = await scriptService.createScript(scriptData);
      setScripts((prev) => [...prev, response.data]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateScript = async (id, scriptData) => {
    try {
      setLoading(true);
      const response = await scriptService.updateScript(id, scriptData);
      setScripts((prev) =>
        prev.map((script) =>
          (script._id || script.id) === id ? response.data : script
        )
      );
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteScript = async (id) => {
    try {
      setLoading(true);
      await scriptService.deleteScript(id);
      setScripts((prev) =>
        prev.filter((script) => (script._id || script.id) !== id)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  return {
    scripts,
    loading,
    error,
    fetchScripts,
    createScript,
    updateScript,
    deleteScript,
    refresh: fetchScripts,
  };
};
