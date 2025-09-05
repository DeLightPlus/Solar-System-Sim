// components/OrbitTrail.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function OrbitTrail({
  semiMajorAxis,
  eccentricity,
  color,
  opacity = 0.2,
}) {
  const ref = useRef();

  useEffect(() => {
    const segments = 128;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    const a = semiMajorAxis;
    const e = eccentricity;
    const b = a * Math.sqrt(1 - e * e);
    const c = a * e;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      const x = Math.cos(theta) * a - c;
      const z = Math.sin(theta) * b;
      positions.push(x, 0, z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    ref.current.geometry = geometry;
  }, [semiMajorAxis, eccentricity]);

  return (
    <lineLoop ref={ref} renderOrder={0}>
      <lineBasicMaterial
        color={color || 0xffffff}
        transparent
        opacity={opacity}
        depthTest={true} 
        depthWrite={false} 
        toneMapped={false}
      />
    </lineLoop>
  );
}
