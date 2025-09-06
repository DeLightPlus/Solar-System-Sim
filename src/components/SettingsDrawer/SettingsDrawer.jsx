import React from "react";
import "./SettingsDrawer.css"; 

export default function SettingsDrawer({ open, onClose, settings, setSettings }) {
  if (!open) return null;

  return (
    <div className="settings-drawer">
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
      <div>
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

        <label>
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

      {/* Bloom Intensity */}
      <div>
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

      <button onClick={onClose}>Close</button>
    </div>
  );
}
