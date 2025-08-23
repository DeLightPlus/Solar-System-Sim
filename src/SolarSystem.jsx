import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'

export default function SolarSystem() {
  useEffect(() => {
    // === Scene ===
    const scene = new THREE.Scene()

    // === Loaders ===
    const textureLoader = new THREE.TextureLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader().setPath('/textures/cubeMap/')

    // === Background ===
    scene.background = cubeTextureLoader.load([
      'px.png', 'nx.png',
      'py.png', 'ny.png',
      'pz.png', 'nz.png',
    ])

    // === Textures ===
    const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
    const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg')
    const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg')
    const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg')
    const marsTexture = textureLoader.load('/textures/2k_mars.jpg')
    const moonTexture = textureLoader.load('/textures/2k_moon.jpg')

    sunTexture.colorSpace =
    mercuryTexture.colorSpace =
    venusTexture.colorSpace =
    earthTexture.colorSpace =
    marsTexture.colorSpace =
    moonTexture.colorSpace = THREE.SRGBColorSpace

    // === Materials ===
    const createMaterial = (map) => new THREE.MeshStandardMaterial({ map })
    const materials = {
      mercury: createMaterial(mercuryTexture),
      venus: createMaterial(venusTexture),
      earth: createMaterial(earthTexture),
      mars: createMaterial(marsTexture),
      moon: createMaterial(moonTexture),
    }

    // === Geometry ===
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

    // === Sun ===
    const sun = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ map: sunTexture }))
    sun.scale.setScalar(5)
    scene.add(sun)

    // === Planets ===
    const planets = [
      {
        name: 'Mercury', radius: 0.5, distance: 10, speed: 0.01, material: materials.mercury, moons: [],
      },
      {
        name: 'Venus', radius: 0.8, distance: 15, speed: 0.007, material: materials.venus, moons: [],
      },
      {
        name: 'Earth', radius: 1, distance: 20, speed: 0.005, material: materials.earth, moons: [
          { name: 'Moon', radius: 0.3, distance: 3, speed: 0.015 },
        ],
      },
      {
        name: 'Mars', radius: 0.7, distance: 25, speed: 0.003, material: materials.mars, moons: [
          { name: 'Phobos', radius: 0.1, distance: 2, speed: 0.02 },
          { name: 'Deimos', radius: 0.2, distance: 3, speed: 0.015 },
        ],
      },
    ]

    const createPlanet = (p) => {
      const mesh = new THREE.Mesh(sphereGeometry, p.material)
      mesh.scale.setScalar(p.radius)
      mesh.position.x = p.distance
      return mesh
    }

    const createMoon = (moon) => {
      const mesh = new THREE.Mesh(sphereGeometry, materials.moon)
      mesh.scale.setScalar(moon.radius)
      mesh.position.x = moon.distance
      return mesh
    }

    const planetMeshes = planets.map((planet) => {
      const mesh = createPlanet(planet)
      scene.add(mesh)
      planet.moons.forEach((moon) => {
        const moonMesh = createMoon(moon)
        mesh.add(moonMesh)
      })
      return mesh
    })

    // === Lights ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    scene.add(new THREE.PointLight(0xffffff, 1000))

    // === Camera & Renderer ===
    const canvas = document.querySelector('canvas.threejs')
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 400)
    camera.position.set(0, 5, 100)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // === Controls ===
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.minDistance = 20
    controls.maxDistance = 200

    // === Resize ===
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    // === Animate ===
    const tick = () => {
      planetMeshes.forEach((planet, i) => {
        planet.rotation.y += planets[i].speed
        planet.position.x = Math.sin(planet.rotation.y) * planets[i].distance
        planet.position.z = Math.cos(planet.rotation.y) * planets[i].distance

        planet.children.forEach((moon, mi) => {
          moon.rotation.y += planets[i].moons[mi].speed
          moon.position.x = Math.sin(moon.rotation.y) * planets[i].moons[mi].distance
          moon.position.z = Math.cos(moon.rotation.y) * planets[i].moons[mi].distance
        })
      })

      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()

    // === Cleanup ===
    return () => {
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return null
}
