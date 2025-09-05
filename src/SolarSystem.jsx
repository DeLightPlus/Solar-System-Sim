import React, { useState, useRef, useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Planet from "./components/Planet.jsx";
import SettingsDrawer from "./components/SettingsDrawer.jsx"; // <-- import here
import planets from "./utils/planets";

function Controls({ autoRotate, minDistance, maxDistance }) {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement);
    controls.current.enableDamping = true;
    controls.current.minDistance = minDistance;
    controls.current.maxDistance = maxDistance;
    controls.current.autoRotate = autoRotate;
    controls.current.autoRotateSpeed = 0.5;

    const animate = () => {
      controls.current.update();
      requestAnimationFrame(animate);
    };
    animate();

    return () => controls.current.dispose();
  }, [camera, gl, autoRotate, minDistance, maxDistance]);

  return null;
}

export default function SolarSystem() {
  const sunTexture = useLoader(THREE.TextureLoader, "/textures/2k_sun.jpg");
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [settings, setSettings] = useState({
    autoRotate: false,
    minDistance: 20,
    maxDistance: 200,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Canvas
        camera={{ position: [0, 5, 100], fov: 35 }}
        style={{ width: "100vw", height: "100vh" }}
        gl={{ antialias: true }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x000000);
        }}
        onPointerMissed={() => setSelectedPlanet(null)}
      >
        <ambientLight intensity={0.3} />
        <pointLight intensity={1.5} position={[0, 0, 0]} />

        {/* Sun */}
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial map={sunTexture} />
        </mesh>

        {/* Planets */}
        {planets.map((planet) => (
          <Planet
            key={planet.name}
            planet={planet}
            onClick={() => setSelectedPlanet(planet)}
          />
        ))}

        <Controls
          autoRotate={settings.autoRotate}
          minDistance={settings.minDistance}
          maxDistance={settings.maxDistance}
        />
      </Canvas>

      {/* Info panel */}
      {selectedPlanet && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: 300,
            zIndex: 100,
            fontFamily: "sans-serif",
          }}
        >
          <h2>{selectedPlanet.name}</h2>
          <p>
            Radius: {selectedPlanet.radius} <br />
            Distance: {selectedPlanet.distance} <br />
            Axial Tilt: {selectedPlanet.axialTilt}°
          </p>
          {selectedPlanet.moons.length > 0 && (
            <>
              <h3>Moons:</h3>
              <ul>
                {selectedPlanet.moons.map((moon) => (
                  <li key={moon.name}>
                    {moon.name} — Radius: {moon.radius}, Distance: {moon.distance}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            onClick={() => setSelectedPlanet(null)}
            style={{
              marginTop: 10,
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#444",
              color: "white",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Settings Toggle Button */}
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 110,
          padding: "10px 16px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#222",
          color: "white",
          cursor: "pointer",
          userSelect: "none",
        }}
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
    </>
  );
}
