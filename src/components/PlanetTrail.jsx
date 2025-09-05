// PlanetTrail.jsx
import React, { useRef } from 'react'
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { MeshLine, MeshLineGeometry, MeshLineMaterial } from '@lume/three-meshline'

extend({ MeshLine, MeshLineGeometry, MeshLineMaterial })

export default function PlanetTrail({
  targetRef,
  maxPoints = 100,
  color = '#888888',
  lineWidth = 0.2,
}) {
  const meshRef = useRef()
  const positions = useRef([]) // flat array: [x1,y1,z1, x2,y2,z2, ... ]

  useFrame(() => {
    if (!targetRef.current || !meshRef.current) return

    const { x, y, z } = targetRef.current.position
    positions.current.push(x, y, z)

    if (positions.current.length > maxPoints * 3) {
      positions.current.splice(0, 3)
    }

    meshRef.current.geometry.setPoints(positions.current)
  })

  return (
    <mesh>
      <meshLineGeometry attach="geometry" points={positions.current} />
      <meshLineMaterial
        attach="material"
        transparent
        depthTest={false}
        color={new THREE.Color(color)}
        lineWidth={lineWidth}
        opacity={0.6}
      />
    </mesh>
  )
}
