import React, { useState } from "react";
import { useScripts } from "./hooks/useScripts.js";
import ScriptForm from "./components/labs/ScriptForm.jsx";
import ScriptList from "./components/labs/ScriptList.jsx";
import ErrorMessage from "./components/common/ErrorMessage.jsx";
import Shop from "./components/shop/Shop.jsx";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("shop");
  const {
    scripts,
    loading,
    error,
    createScript,
    updateScript,
    deleteScript,
    refresh,
  } = useScripts();

  const handleCreateScript = async (scriptData) => {
    try {
      await createScript(scriptData);
    } catch (err) {
      console.error("Failed to create script:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  const handleUpdateScript = async (id, scriptData) => {
    try {
      await updateScript(id, scriptData);
    } catch (err) {
      console.error("Failed to update script:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  const handleDeleteScript = async (id) => {
    try {
      await deleteScript(id);
    } catch (err) {
      console.error("Failed to delete script:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-tabs" role="tablist" aria-label="Script Labs sections">
        <button
          className={`dashboard-tab ${activeTab === "shop" ? "active" : ""}`}
          onClick={() => setActiveTab("shop")}
          role="tab"
          aria-selected={activeTab === "shop"}
          type="button"
        >
          🛒 Product Shop
        </button>
        <button
          className={`dashboard-tab ${activeTab === "labs" ? "active" : ""}`}
          onClick={() => setActiveTab("labs")}
          role="tab"
          aria-selected={activeTab === "labs"}
          type="button"
        >
          🧪 Script CRUD
        </button>
      </div>

      {activeTab === "shop" ? (
        <Shop />
      ) : (
        <div className="script-section">
          <ScriptForm onSubmit={handleCreateScript} loading={loading} />

          <ErrorMessage message={error} onRetry={refresh} />

          <div className="scripts-container">
            <ScriptList
              scripts={scripts}
              onEdit={handleUpdateScript}
              onDelete={handleDeleteScript}
              loading={loading}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
