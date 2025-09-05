// components/Moon.jsx
import React, { forwardRef } from 'react'

const Moon = forwardRef(({ moon, texture }, ref) => {
  return (
    <mesh ref={ref} position={[moon.distance, 0, 0]}>
      <sphereGeometry args={[moon.radius, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
})

export default Moon
