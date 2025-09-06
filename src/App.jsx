import React, { useEffect, useState } from "react";
import SolarSystem from "./SolarSystem";
import SettingsDrawer from "./components/SettingsDrawer/SettingsDrawer";
// import planets from "../utils/planets";
import "./App.css";
import planets from "./utils/planets";
import PlanetCard from "./components/PlanetCard/PlanetCard";
import SolarIntroTutorial from "./components/SolarIntroTutorial/SolarIntroTutorial";

export default function App() {
  // Inside App component state:
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem("hasSeenTutorial") !== "true";
  });

  // Disable cards until tutorial is done
  const [tutorialComplete, setTutorialComplete] = useState(!showTutorial);

  const [selectedPlanet, setSelectedPlanet] = useState(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

 

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    autoRotate: false,
    minDistance: 20,
    maxDistance: 200,
    bloomIntensity: 1.5,
  });

  return (
    <>
      <SolarSystem
        settings={settings}
        selectedPlanet={selectedPlanet}
        setSelectedPlanet={setSelectedPlanet}
      />     

      <div className="ui-layer">
        {/* Tutorial Overlay */}    
        {showTutorial && (
          <SolarIntroTutorial onFinish={() => {
            setShowTutorial(false);
            setTutorialComplete(true);
          }} />
        )}

        <div className="planet-card-container">
          {planets.map((planet) => (
            <PlanetCard
              key={planet.name}
              planet={planet}
              onSelect={tutorialComplete ? setSelectedPlanet : () => {}}
            />
          ))}
        </div>

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
