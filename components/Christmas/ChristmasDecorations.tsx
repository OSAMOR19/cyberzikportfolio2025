"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChristmas } from './ChristmasContext'

export const ChristmasDecorations = () => {
  const { isChristmasMode } = useChristmas()

  const decorations = [
    {
      id: 1,
      emoji: '🔔',
      initialX: '5%',
      initialY: '15%',
      duration: 3,
      delay: 0
    },
    {
      id: 2,
      emoji: '⭐',
      initialX: '92%',
      initialY: '20%',
      duration: 3.5,
      delay: 0.5
    },
    {
      id: 3,
      emoji: '🎁',
      initialX: '8%',
      initialY: '70%',
      duration: 4,
      delay: 1
    },
    {
      id: 4,
      emoji: '🎄',
      initialX: '90%',
      initialY: '75%',
      duration: 3.2,
      delay: 0.7
    }
  ]

  return (
    <AnimatePresence>
      {isChristmasMode && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          {decorations.map((decoration) => (
            <motion.div
              key={decoration.id}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: [0, 1, 1, 1],
                scale: [0, 1.2, 1, 1],
                rotate: 0,
                y: [0, -20, 0, -15, 0]
              }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{
                opacity: { duration: 0.5, delay: decoration.delay },
                scale: { duration: 0.5, delay: decoration.delay },
                rotate: { duration: 0.5, delay: decoration.delay },
                y: {
                  duration: decoration.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: decoration.delay
                }
              }}
              className="absolute text-5xl md:text-6xl"
              style={{
                left: decoration.initialX,
                top: decoration.initialY,
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
              }}
            >
              {decoration.emoji}
            </motion.div>
          ))}

          {/* Hanging ornaments at the top */}
          <div className="absolute top-0 left-0 right-0 flex justify-around pt-4">
            {['🔴', '🟢', '🔵', '🟡', '🔴'].map((ornament, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: [0, 5, -5, 0]
                }}
                exit={{ opacity: 0, y: -50 }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  y: { duration: 0.5, delay: index * 0.1 },
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }
                }}
                className="text-3xl"
                style={{
                  transformOrigin: 'top center',
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))'
                }}
              >
                {ornament}
              </motion.div>
            ))}
          </div>

          {/* Candy canes in corners */}
          <motion.div
            initial={{ opacity: 0, rotate: -90, x: -100 }}
            animate={{ opacity: 1, rotate: -45, x: 0 }}
            exit={{ opacity: 0, rotate: -90, x: -100 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-16 left-0 text-6xl"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}
          >
            🍭
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 90, x: 100 }}
            animate={{ opacity: 1, rotate: 45, x: 0 }}
            exit={{ opacity: 0, rotate: 90, x: 100 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-16 right-0 text-6xl"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}
          >
            🍭
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
