// components/SettingsDrawer.jsx
import React from "react";

export default function SettingsDrawer({ open, onClose, settings, setSettings }) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: "300px",
      height: "100%",
      backgroundColor: "#111",
      color: "#fff",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      zIndex: 120,
      fontFamily: "sans-serif",
    }}>
      <h2>Settings</h2>

      {/* Auto-Rotate Toggle */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.autoRotate}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, autoRotate: e.target.checked }))
            }
          />
          Auto-Rotate
        </label>
      </div>

      {/* Zoom Limits */}
      <div style={{ marginTop: 20 }}>
        <label>Min Zoom: {settings.minDistance}</label>
        <input
          type="range"
          min="5"
          max="100"
          value={settings.minDistance}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              minDistance: parseFloat(e.target.value),
            }))
          }
        />

        <label style={{ display: "block", marginTop: 10 }}>
          Max Zoom: {settings.maxDistance}
        </label>
        <input
          type="range"
          min="100"
          max="500"
          value={settings.maxDistance}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              maxDistance: parseFloat(e.target.value),
            }))
          }
        />
      </div>

      {/* 🌟 Bloom Intensity Slider */}
      <div style={{ marginTop: 20 }}>
        <label>Bloom Intensity: {settings.bloomIntensity.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={settings.bloomIntensity}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              bloomIntensity: parseFloat(e.target.value),
            }))
          }
        />
      </div>

      <button
        style={{
          marginTop: 20,
          padding: "8px 12px",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
