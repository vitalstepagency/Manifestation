'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Subtle particle system configuration - "Dreams Gently Materializing"
const CONFIG = {
  particleCount: 400,
  spawnRate: 2,
  lifespan: 15, // seconds to rise from bottom to top
  speed: {
    min: 0.2,
    max: 0.5
  },
  size: {
    base: 1.5,
    dream: 4
  },
  opacity: {
    base: 0.2,
    dream: 0.35
  },
  connectionDistance: 120,
  connectionOpacity: 0.06,
  colors: [
    new THREE.Color(1, 1, 1),              // White
    new THREE.Color(0.545, 0.361, 0.965),  // Purple
    new THREE.Color(0.925, 0.282, 0.6)     // Pink
  ]
}

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  size: number
  color: THREE.Color
  life: number
  maxLife: number
  opacity: number
  currentOpacity: number
  layer: number // 0, 1, 2 for depth layers
}

export default function DreamParticleSystem() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const particleMeshRef = useRef<THREE.Points | null>(null)
  const connectionLinesRef = useRef<THREE.LineSegments | null>(null)
  const timeRef = useRef(0)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    camera.position.z = 500
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Initialize particles
    initializeParticles()

    // Create visual elements
    createParticleMesh(scene)
    createConnectionLines(scene)

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      const deltaTime = 0.016 // 60 FPS
      timeRef.current += deltaTime

      updateParticles(deltaTime)
      updateParticleMesh()
      updateConnectionLines()

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameRef.current)
      renderer.dispose()
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  const initializeParticles = () => {
    const particles: Particle[] = []

    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(createParticle())
    }

    particlesRef.current = particles
  }

  const createParticle = (): Particle => {
    const isDream = Math.random() > 0.9 // 10% dream particles
    const layer = Math.floor(Math.random() * 3) // 0, 1, 2

    // Spawn at bottom, spread across width
    const x = (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth : 1000)
    const y = -100 // Below viewport
    const z = (layer - 1) * 150 // Depth based on layer

    return {
      position: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3, // Gentle sideways drift
        Math.random() * 0.3 + 0.2,   // Upward (slow)
        0
      ),
      size: isDream ? CONFIG.size.dream : CONFIG.size.base,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)].clone(),
      life: 0,
      maxLife: CONFIG.lifespan,
      opacity: isDream ? CONFIG.opacity.dream : CONFIG.opacity.base,
      currentOpacity: 0,
      layer
    }
  }

  const createParticleMesh = (scene: THREE.Scene) => {
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(CONFIG.particleCount * 3)
    const colors = new Float32Array(CONFIG.particleCount * 3)
    const sizes = new Float32Array(CONFIG.particleCount)
    const opacities = new Float32Array(CONFIG.particleCount)

    particlesRef.current.forEach((particle, i) => {
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z

      colors[i * 3] = particle.color.r
      colors[i * 3 + 1] = particle.color.g
      colors[i * 3 + 2] = particle.color.b

      sizes[i] = particle.size
      opacities[i] = particle.currentOpacity
    })

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('alpha', new THREE.BufferAttribute(opacities, 1))

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexShader: `
        attribute float size;
        attribute float alpha;
        attribute vec3 color;

        varying vec3 vColor;
        varying float vAlpha;

        uniform float time;

        void main() {
          vColor = color;
          vAlpha = alpha;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          // Gentle breathing effect (very subtle)
          float breathe = sin(time * 0.5) * 0.02 + 1.0;

          gl_PointSize = size * breathe * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Circular particle with soft edges
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          if (dist > 0.5) discard;

          // Very soft edges
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          alpha *= vAlpha;

          // Subtle glow
          float glow = exp(-dist * 3.0);
          vec3 color = vColor * (1.0 + glow * 0.2);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        time: { value: 0 }
      }
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)
    particleMeshRef.current = points
  }

  const createConnectionLines = (scene: THREE.Scene) => {
    const geometry = new THREE.BufferGeometry()

    // Pre-allocate for maximum possible connections
    const maxConnections = CONFIG.particleCount * 10
    const positions = new Float32Array(maxConnections * 6) // 2 points per line, 3 coords each

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: CONFIG.connectionOpacity,
      blending: THREE.NormalBlending
    })

    const lines = new THREE.LineSegments(geometry, material)
    scene.add(lines)
    connectionLinesRef.current = lines
  }

  const updateParticles = (deltaTime: number) => {
    const breathe = Math.sin(timeRef.current * 0.5) * 0.02 + 1.0

    particlesRef.current.forEach((particle) => {
      // Update position with layer-based speed
      const layerSpeed = 1 - (particle.layer * 0.2) // Back layer slower
      particle.position.x += particle.velocity.x * layerSpeed
      particle.position.y += particle.velocity.y * layerSpeed

      // Update life
      particle.life += deltaTime

      // Fade in at birth
      if (particle.life < 1) {
        particle.currentOpacity = particle.opacity * particle.life
      }
      // Fade out near death
      else if (particle.life > particle.maxLife - 2) {
        const fadeOut = (particle.maxLife - particle.life) / 2
        particle.currentOpacity = particle.opacity * fadeOut
      }
      else {
        particle.currentOpacity = particle.opacity
      }

      // Respawn if too high or too old
      const maxHeight = typeof window !== 'undefined' ? window.innerHeight + 100 : 1000
      if (particle.position.y > maxHeight || particle.life > particle.maxLife) {
        const newParticle = createParticle()
        Object.assign(particle, newParticle)
      }
    })
  }

  const updateParticleMesh = () => {
    if (!particleMeshRef.current) return

    const geometry = particleMeshRef.current.geometry
    const material = particleMeshRef.current.material as THREE.ShaderMaterial

    const positions = geometry.attributes.position.array as Float32Array
    const opacities = geometry.attributes.alpha.array as Float32Array

    particlesRef.current.forEach((particle, i) => {
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z

      opacities[i] = particle.currentOpacity
    })

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.alpha.needsUpdate = true

    material.uniforms.time.value = timeRef.current
  }

  const updateConnectionLines = () => {
    if (!connectionLinesRef.current) return

    const geometry = connectionLinesRef.current.geometry
    const positions = geometry.attributes.position.array as Float32Array

    let lineIndex = 0
    const particles = particlesRef.current

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i]

      // Only check nearby particles (optimization)
      for (let j = i + 1; j < Math.min(i + 20, particles.length); j++) {
        const p2 = particles[j]

        const dx = p1.position.x - p2.position.x
        const dy = p1.position.y - p2.position.y
        const dz = p1.position.z - p2.position.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < CONFIG.connectionDistance && lineIndex < positions.length / 6) {
          positions[lineIndex * 6] = p1.position.x
          positions[lineIndex * 6 + 1] = p1.position.y
          positions[lineIndex * 6 + 2] = p1.position.z

          positions[lineIndex * 6 + 3] = p2.position.x
          positions[lineIndex * 6 + 4] = p2.position.y
          positions[lineIndex * 6 + 5] = p2.position.z

          lineIndex++
        }
      }
    }

    // Hide unused lines by setting them to 0,0,0
    for (let i = lineIndex; i < positions.length / 6; i++) {
      positions[i * 6] = 0
      positions[i * 6 + 1] = 0
      positions[i * 6 + 2] = 0
      positions[i * 6 + 3] = 0
      positions[i * 6 + 4] = 0
      positions[i * 6 + 5] = 0
    }

    geometry.attributes.position.needsUpdate = true
    geometry.setDrawRange(0, lineIndex * 2)
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
