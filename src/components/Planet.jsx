import React, { useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import Moon from "./Moon";
import OrbitTrail from "./OrbitTrail";

export default function Planet({ planet }) {
  const planetRef = useRef();
  const atmosphereRef = useRef();
  const ringRef = useRef();
  const moonRefs = useRef([]);

  const texture = useLoader(THREE.TextureLoader, planet.texture);
  const moonTexture = useLoader(THREE.TextureLoader, "/textures/2k_moon.jpg");

  // Ring geometry & material (same as before)
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
    const c = a * e; // focal distance

    if (!planetRef.current) return;

    // Elliptical orbit
    planetRef.current.position.x = Math.cos(angle) * a - c;
    planetRef.current.position.z = Math.sin(angle) * b;

    // Planet spin
    planetRef.current.rotation.y += 0.005;

    // Axial tilt (in radians)
    const tiltRad = THREE.MathUtils.degToRad(planet.axialTilt || 0);
    planetRef.current.rotation.z = tiltRad;

    // Atmosphere glow pulsate
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

    // Moons orbiting relative to planet
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
    <group position={[0, 0, 0]}>
      {/* Orbit trail */}
      <OrbitTrail
        semiMajorAxis={planet.distance}
        eccentricity={planet.eccentricity || 0}
        color={planet.orbitColor}
      />

      {/* Planet group */}
      <group ref={planetRef}>
        {/* Planet mesh */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Atmosphere glow */}
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

        {/* Rings */}
        {planet.rings && (
          <mesh
            geometry={ringGeometry}
            material={ringMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            ref={ringRef}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          />
        )}

        {/* Moons */}
        {planet.moons.map((moon, i) => (
          <mesh
            key={moon.name}
            ref={(el) => (moonRefs.current[i] = el)}
            position={[moon.distance, 0, 0]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[moon.radius, 32, 32]} />
            <meshStandardMaterial map={moonTexture} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
