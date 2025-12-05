"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useChristmas } from './ChristmasContext'

export const AnimatedSanta = () => {
  const { isChristmasMode } = useChristmas()

  if (!isChristmasMode) return null

  return (
    <>
      {/* Just one subtle flying Santa - smaller and slower */}
      <motion.div
        initial={{ x: '-150px', y: 80 }}
        animate={{
          x: ['100vw', '-150px'],
          y: [80, 70, 90, 75, 85, 80],
        }}
        transition={{
          x: { duration: 35, repeat: Infinity, ease: 'linear' }, // Slower
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="fixed top-24 pointer-events-none z-20"
        style={{
          fontSize: '50px', // Smaller
          opacity: 0.8 // Slightly transparent
        }}
      >
        🎅🛷
      </motion.div>
    </>
  )
}
