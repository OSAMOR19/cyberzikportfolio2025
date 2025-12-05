"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChristmas } from './ChristmasContext'

interface SantaHatProps {
  targetSelector?: string
  top?: string
  left?: string
  right?: string
  scale?: number
}

export const SantaHat = ({
  top = '-15px',
  left = 'auto',
  right = '-10px',
  scale = 0.35
}: SantaHatProps) => {
  const { isChristmasMode } = useChristmas()

  return (
    <AnimatePresence>
      {isChristmasMode && (
        <motion.div
          initial={{ opacity: 0, rotate: -45, scale: 0 }}
          animate={{
            opacity: 1,
            rotate: -25,
            scale: scale,
            y: [0, -3, 0]
          }}
          exit={{ opacity: 0, rotate: -45, scale: 0 }}
          transition={{
            opacity: { duration: 0.5 },
            rotate: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute pointer-events-none z-10"
          style={{
            top,
            left: left !== 'auto' ? left : undefined,
            right: right !== 'auto' ? right : undefined,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hat main body */}
            <path
              d="M30 70 L60 10 L90 70 Z"
              fill="#DC2626"
              stroke="#B91C1C"
              strokeWidth="2"
            />

            {/* Hat brim */}
            <ellipse
              cx="60"
              cy="70"
              rx="35"
              ry="8"
              fill="#F9FAFB"
            />

            {/* Pom-pom */}
            <circle
              cx="60"
              cy="10"
              r="8"
              fill="#F9FAFB"
            />

            {/* Shine on hat */}
            <path
              d="M50 30 Q55 35 50 40"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Wrapper component for easy logo decoration
export const LogoWithSantaHat = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative inline-block">
      {children}
      <SantaHat />
    </div>
  )
}
