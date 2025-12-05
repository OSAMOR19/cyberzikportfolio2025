"use client"

import React, { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useChristmas } from './ChristmasContext'

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  opacity: number
}

export const ChristmasSnow = () => {
  const { isChristmasMode } = useChristmas()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snowflakesRef = useRef<Snowflake[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!isChristmasMode) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create snowflakes - increased density
    const createSnowflakes = () => {
      const count = Math.min(150, Math.floor(window.innerWidth / 10)) // More snowflakes!
      snowflakesRef.current = []

      for (let i = 0; i < count; i++) {
        snowflakesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3.5 + 1, // Slightly bigger snowflakes
          speed: Math.random() * 1.2 + 0.5, // Slightly faster
          drift: Math.random() * 0.6 - 0.3, // More drift
          opacity: Math.random() * 0.7 + 0.4 // Slightly more visible
        })
      }
    }

    createSnowflakes()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakesRef.current.forEach((snowflake) => {
        // Update position
        snowflake.y += snowflake.speed
        snowflake.x += snowflake.drift

        // Reset if out of bounds
        if (snowflake.y > canvas.height) {
          snowflake.y = -10
          snowflake.x = Math.random() * canvas.width
        }
        if (snowflake.x > canvas.width) {
          snowflake.x = 0
        } else if (snowflake.x < 0) {
          snowflake.x = canvas.width
        }

        // Draw snowflake
        ctx.beginPath()
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isChristmasMode])

  return (
    <AnimatePresence>
      {isChristmasMode && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-40"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
    </AnimatePresence>
  )
}
