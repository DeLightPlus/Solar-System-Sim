import React from "react";

export default function SettingsDrawer({ open, onClose, settings, setSettings }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          display: open ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 100,
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-300px",
          height: "100vh",
          width: "280px",
          backgroundColor: "#111",
          color: "white",
          padding: "1.5rem",
          boxShadow: "-3px 0 8px rgba(0,0,0,0.7)",
          transition: "right 0.3s ease",
          zIndex: 101,
          fontFamily: "sans-serif",
        }}
      >
        <h2>Settings</h2>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
          aria-label="Close settings"
        >
          &times;
        </button>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={settings.autoRotate}
            onChange={(e) =>
              setSettings({ ...settings, autoRotate: e.target.checked })
            }
          />{" "}
          Auto-Rotate
        </label>

        <label style={{ display: "block", marginBottom: "1rem" }}>
          Min Zoom:{" "}
          <input
            type="number"
            value={settings.minDistance}
            onChange={(e) =>
              setSettings({ ...settings, minDistance: Number(e.target.value) })
            }
            style={{ width: "60px", marginLeft: "0.5rem" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: "1rem" }}>
          Max Zoom:{" "}
          <input
            type="number"
            value={settings.maxDistance}
            onChange={(e) =>
              setSettings({ ...settings, maxDistance: Number(e.target.value) })
            }
            style={{ width: "60px", marginLeft: "0.5rem" }}
          />
        </label>
      </div>
    </>
  );
}
