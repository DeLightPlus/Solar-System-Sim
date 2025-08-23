import React from 'react'
import SolarSystem from './SolarSystem'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <canvas className="threejs" />
      <SolarSystem />
    </div>
  )
}
