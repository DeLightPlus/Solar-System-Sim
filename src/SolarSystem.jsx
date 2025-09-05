// SolarSystem.jsx
import React from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Planet from "./components/Planet.jsx";
import planets from "./utils/planets";

function Controls() {
  const { camera, gl } = useThree();
  const controls = React.useRef();

  React.useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement);
    controls.current.enableDamping = true;
    controls.current.minDistance = 20;
    controls.current.maxDistance = 200;

    const animate = () => {
      controls.current.update();
      requestAnimationFrame(animate);
    };
    animate();

    return () => controls.current.dispose();
  }, [camera, gl]);

  return null;
}

export default function SolarSystem() {
  const sunTexture = useLoader(THREE.TextureLoader, "/textures/2k_sun.jpg");

  return (
    <Canvas
      camera={{ position: [0, 5, 100], fov: 35 }}
      style={{ width: "100vw", height: "100vh" }}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color(0x000000);
      }}
    >
      <ambientLight intensity={0.3} />

      {/* Bright warm Point Light at Sun’s center */}
      <pointLight
        intensity={2}
        color={"#fff6cc"}
        position={[0, 0, 0]}
        distance={300}
        decay={2}
      />

      {/* Sun with glow */}
      <group>
        {/* Sun sphere */}
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial map={sunTexture} />
        </mesh>

        {/* Glow sphere around the Sun */}
        <mesh scale={[1.0251, 1.0251, 1.0251]}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshPhongMaterial
            color={"#ffffaa"}
            emissive={"#ffff66"}
            emissiveIntensity={1.5}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Planets */}
      {planets.map((planet) => (
        <Planet key={planet.name} planet={planet} />
      ))}

      <Controls />
    </Canvas>
  );
}
