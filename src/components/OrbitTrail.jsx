import React from 'react'
import * as THREE from 'three'

export default function OrbitTrail({ radius = 20, eccentricity = 0, segments = 100, color = 0x888888 }) {
  // Calculate semi-minor axis based on eccentricity
  const b = radius * Math.sqrt(1 - eccentricity * eccentricity)

  // Create ellipse points
  const points = new THREE.EllipseCurve(
    0, 0,
    radius, b,          // a = radius (semi-major), b = calculated semi-minor
    0, 2 * Math.PI,
    false,
    0
  ).getPoints(segments)

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return (
    <lineLoop  
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={geometry}
    >
      <lineBasicMaterial 
        attach="material" 
        color={color} 
        linewidth={1}
        transparent
        opacity={0.1}
      />
    </lineLoop>
  )
}
