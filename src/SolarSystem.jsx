import React, { useState, useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import Planet from "./components/Planet.jsx";
import planets from "./utils/planets";
import Controls from "./components/Controls.jsx";


// ----- Cube Map Background -----
function CubeMapBackground() {
  const { scene } = useThree();

  const px = useLoader(THREE.TextureLoader, "/textures/cubeMap/px.png");
  const nx = useLoader(THREE.TextureLoader, "/textures/cubeMap/nx.png");
  const py = useLoader(THREE.TextureLoader, "/textures/cubeMap/py.png");
  const ny = useLoader(THREE.TextureLoader, "/textures/cubeMap/ny.png");
  const pz = useLoader(THREE.TextureLoader, "/textures/cubeMap/pz.png");
  const nz = useLoader(THREE.TextureLoader, "/textures/cubeMap/nz.png");

  useEffect(() => {
    if (
      px?.image && nx?.image && py?.image &&
      ny?.image && pz?.image && nz?.image
    ) {
      const cubeTexture = new THREE.CubeTexture([
        px.image, nx.image, py.image,
        ny.image, pz.image, nz.image,
      ]);
      cubeTexture.needsUpdate = true;
      scene.background = cubeTexture;
      scene.environment = cubeTexture;
    }
  }, [scene, px, nx, py, ny, pz, nz]);

  return null;
}

// ----- Main Component -----
export default function SolarSystem({ settings, selectedPlanet, setSelectedPlanet }) {
  const sunTexture = useLoader(THREE.TextureLoader, "/textures/2k_sun.jpg");  
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [hoveredPlanetPos, setHoveredPlanetPos] = useState({ x: 0, y: 0, visible: false });

  const handlePointerMove = (event) => {
    if (!hoveredPlanet) {
      setHoveredPlanetPos((pos) => ({ ...pos, visible: false }));
      return;
    }
    const { clientX, clientY } = event;
    setHoveredPlanetPos({ x: clientX, y: clientY, visible: true });
  };  

  return (
    <>
      <Canvas
        camera={{  position: [31, 18, 58], fov: 35 }} // Off-center left, looking right        
        style={{ position: "absolute", width: "100vw", height: "100vh" }}
        gl={{ antialias: true }}
        onPointerMissed={() => {
          setSelectedPlanet(null);
          setHoveredPlanet(null);
          setHoveredPlanetPos((pos) => ({ ...pos, visible: false }));
        }}
        onPointerMove={handlePointerMove}
      >
        <CubeMapBackground />
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
            onPointerOver={() => setHoveredPlanet(planet)}
            onPointerOut={() => {
              setHoveredPlanet(null);
              setHoveredPlanetPos((pos) => ({ ...pos, visible: false }));
            }}
          />
        ))}

        <Controls
          autoRotate={settings.autoRotate}
          minDistance={settings.minDistance}
          maxDistance={settings.maxDistance}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={settings.bloomIntensity}
          />
        </EffectComposer>
      </Canvas>

      {/* Hover Label */}
      {hoveredPlanet && hoveredPlanetPos.visible && (
        <div
          className="hover-label visible"
          style={{
            left: hoveredPlanetPos.x,
            top: hoveredPlanetPos.y,
          }}
        >
          {hoveredPlanet.name}
        </div>
      )}

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="info-panel visible" role="region" aria-label="Planet information">
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
    </>
  );
}
