// components/Planet.jsx
import React, { useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import Moon from "./Moon";
import OrbitTrail from "./OrbitTrail";

export default function Planet({ planet }) {
  const planetRef = useRef();
  const moonRefs = useRef([]);

  const texture = useLoader(THREE.TextureLoader, planet.texture);
  const moonTexture = useLoader(THREE.TextureLoader, "/textures/2k_moon.jpg");

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const angle = elapsed * planet.speed;
    const a = planet.distance;
    const e = planet.eccentricity || 0;
    const b = a * Math.sqrt(1 - e * e);
    const c = a * e; // focal distance

    if (!planetRef.current) return;

    planetRef.current.position.x = Math.cos(angle) * a - c;
    planetRef.current.position.z = Math.sin(angle) * b;

    planetRef.current.rotation.y += 0.005;

    planet.moons.forEach((moon, i) => {
      const moonAngle = elapsed * moon.speed;
      const moonMesh = moonRefs.current[i];
      moonMesh.position.x = Math.sin(moonAngle) * moon.distance;
      moonMesh.position.z = Math.cos(moonAngle) * moon.distance;
      moonMesh.rotation.y += 0.01;
    });
  });

  return (
    <>
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Moons */}
        {planet.moons.map((moon, i) => (
          <Moon
            key={moon.name}
            ref={(el) => (moonRefs.current[i] = el)}
            moon={moon}
            texture={moonTexture}
          />
        ))}
      </group>

      {/* Orbit trail */}
      <OrbitTrail
        radius={planet.distance}
        eccentricity={planet.eccentricity || 0}
        color={planet.orbitColor || 0x888888}
      />
    </>
  );
}
