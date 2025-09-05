import React, { forwardRef } from "react";

const Moon = forwardRef(({ moon, texture }, ref) => {
  return (
    <mesh ref={ref} position={[moon.distance, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[moon.radius, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
});

export default Moon;
