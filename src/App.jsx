import React, { useState } from "react";
import SolarSystem from "./SolarSystem";
import SettingsDrawer from "./components/SettingsDrawer";
import './App.css';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    autoRotate: false,
    minDistance: 20,
    maxDistance: 200,
    bloomIntensity: 1.5,
  });

  return (
    <> 
      <SolarSystem settings={settings}/> 
      <div className="ui-layer">
        {/* Settings Toggle Button */}
        <button
          className="settings-toggle"
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Toggle settings"
        >
          ⚙️ Settings
        </button>

        {/* Settings Drawer */}
        <SettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          setSettings={setSettings}
        />
      </div> 
               
    </>
  );
}
