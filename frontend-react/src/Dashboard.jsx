import React, { useState } from "react";
import { useScripts } from "./hooks/useScripts.js";
import ScriptForm from "./components/labs/ScriptForm.jsx";
import ScriptList from "./components/labs/ScriptList.jsx";
import ErrorMessage from "./components/common/ErrorMessage.jsx";
import Shop from "./components/shop/Shop.jsx";
import TestingGuide from "./components/guide/TestingGuide.jsx";

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
    }
  };

  const handleUpdateScript = async (id, scriptData) => {
    try {
      await updateScript(id, scriptData);
    } catch (err) {
      console.error("Failed to update script:", err);
    }
  };

  const handleDeleteScript = async (id) => {
    try {
      await deleteScript(id);
    } catch (err) {
      console.error("Failed to delete script:", err);
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
          className={`dashboard-tab ${activeTab === "guide" ? "active" : ""}`}
          onClick={() => setActiveTab("guide")}
          role="tab"
          aria-selected={activeTab === "guide"}
          type="button"
        >
          📘 Testing Guide
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

      {activeTab === "shop" && <Shop />}

      {activeTab === "guide" && <TestingGuide />}

      {activeTab === "labs" && (
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
