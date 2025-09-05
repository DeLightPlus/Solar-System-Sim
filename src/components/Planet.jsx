import React, { useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import Moon from "./Moon";
import OrbitTrail from "./OrbitTrail";

export default function Planet({ planet, onClick }) {
  const planetRef = useRef();
  const atmosphereRef = useRef();
  const ringRef = useRef();
  const moonRefs = useRef([]);

  const texture = useLoader(THREE.TextureLoader, planet.texture);
  const moonTexture = useLoader(THREE.TextureLoader, "/textures/2k_moon.jpg");

  let ringGeometry = null;
  let ringMaterial = null;
  if (planet.rings) {
    ringGeometry = new THREE.RingGeometry(
      planet.rings.innerRadius,
      planet.rings.outerRadius,
      64
    );
    ringMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
  }

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const angle = elapsed * planet.speed;
    const a = planet.distance;
    const e = planet.eccentricity || 0;
    const b = a * Math.sqrt(1 - e * e);
    const c = a * e;

    if (!planetRef.current) return;

    planetRef.current.position.x = Math.cos(angle) * a - c;
    planetRef.current.position.z = Math.sin(angle) * b;

    planetRef.current.rotation.y += 0.005;

    const tiltRad = THREE.MathUtils.degToRad(planet.axialTilt || 0);
    planetRef.current.rotation.z = tiltRad;

    if (atmosphereRef.current) {
      atmosphereRef.current.material.emissiveIntensity =
        0.5 + 0.2 * Math.sin(elapsed * 3);

      const baseColor = new THREE.Color(planet.glowColor || "cyan");
      const pulseColor = new THREE.Color(planet.glowPulseColor || "#00ffff");

      atmosphereRef.current.material.emissive = baseColor.lerp(
        pulseColor,
        (Math.sin(elapsed * 3) + 1) / 2
      );
    }

    planet.moons.forEach((moon, i) => {
      const moonAngle = elapsed * moon.speed;
      const moonMesh = moonRefs.current[i];
      if (moonMesh) {
        moonMesh.position.x = Math.sin(moonAngle) * moon.distance;
        moonMesh.position.z = Math.cos(moonAngle) * moon.distance;
      }
    });
  });

  return (
    <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <OrbitTrail
        semiMajorAxis={planet.distance}
        eccentricity={planet.eccentricity || 0}
        color={planet.orbitColor}
      />

      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        <mesh scale={[1.2, 1.2, 1.2]} ref={atmosphereRef}>
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshPhongMaterial
            color={planet.glowColor}
            emissive={planet.glowColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {planet.rings && (
          <mesh
            geometry={ringGeometry}
            material={ringMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            ref={ringRef}
            position={[0, 0, 0]}
          />
        )}

        {planet.moons.map((moon, i) => (
          <Moon
            key={moon.name}
            moon={moon}
            texture={moonTexture}
            ref={(el) => (moonRefs.current[i] = el)}
          />
        ))}
      </group>
    </group>
  );
}
