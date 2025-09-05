// SolarSystem.jsx
import React from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Planet from './components/Planet.jsx'

function Controls() {
  const { camera, gl } = useThree()
  const controls = React.useRef()

  React.useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement)
    controls.current.enableDamping = true
    controls.current.minDistance = 20
    controls.current.maxDistance = 200

    const animate = () => {
      controls.current.update()
      requestAnimationFrame(animate)
    }
    animate()

    return () => controls.current.dispose()
  }, [camera, gl])

  return null
}

export default function SolarSystem() {
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/2k_sun.jpg')

  const planets = [
  {
    name: 'Mercury',
    radius: 0.5,
    distance: 10,    // semi-major axis (a)
    speed: 0.01,
    texture: '/textures/2k_mercury.jpg',
    moons: [],
    eccentricity: 0.205,  // example real eccentricity
    orbitColor: 0xffa500,
  },
  {
    name: 'Venus',
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    texture: '/textures/2k_venus_surface.jpg',
    moons: [],
    eccentricity: 0.007,
    orbitColor: 0xffc0cb,
  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    texture: '/textures/2k_earth_daymap.jpg',
    moons: [{ name: 'Moon', radius: 0.3, distance: 3, speed: 0.015 }],
    eccentricity: 0.017,
    orbitColor: 0x3399ff,
  },
  {
    name: 'Mars',
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    texture: '/textures/2k_mars.jpg',
    moons: [
      { name: 'Phobos', radius: 0.1, distance: 2, speed: 0.02 },
      { name: 'Deimos', radius: 0.2, distance: 3, speed: 0.015 },
    ],
    eccentricity: 0.093,
    orbitColor: 0xff4500,
  },
]


  return (
    <Canvas
      camera={{ position: [0, 5, 100], fov: 35 }}
      style={{ width: '100vw', height: '100vh' }}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color(0x000000)
      }}
    >
      <ambientLight intensity={0.3} />
      <pointLight intensity={1.5} position={[0, 0, 0]} />

      {/* Sun */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>

      {/* Planets */}
      {planets.map((planet) => (
        <Planet key={planet.name} planet={planet} />
      ))}

      <Controls />
    </Canvas>
  )
}
