"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei"
import { Vector3 } from "three"
import type * as THREE from "three"

function FloatingSphere({
  position,
  size,
  color,
  speed,
  distort,
}: {
  position: [number, number, number]
  size: number
  color: string
  speed: number
  distort: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const initialPosition = new Vector3(...position)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = initialPosition.y + Math.sin(clock.getElapsedTime() * speed) * 0.5
      ref.current.rotation.x = clock.getElapsedTime() * 0.2
      ref.current.rotation.z = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={ref} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />

      <FloatingSphere position={[-3, 0, -5]} size={1.5} color="#9333ea" speed={0.5} distort={0.4} />

      <FloatingSphere position={[3, 1, -2]} size={1} color="#06b6d4" speed={0.7} distort={0.3} />

      <FloatingSphere position={[0, -2, -3]} size={0.8} color="#8b5cf6" speed={0.6} distort={0.5} />

      <Environment preset="night" />
    </>
  )
}

export function ThreeDScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <Scene />
    </Canvas>
  )
}

