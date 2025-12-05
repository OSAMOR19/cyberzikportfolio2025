"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChristmas } from './ChristmasContext'

export const ChristmasGlow = () => {
  const { isChristmasMode } = useChristmas()

  return (
    <AnimatePresence>
      {isChristmasMode && (
        <>
          {/* Red Glow - Top Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[1]"
            style={{
              background: 'radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Green Glow - Top Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none z-[1]"
            style={{
              background: 'radial-gradient(circle, rgba(22, 163, 74, 0.3) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Red Glow - Bottom Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-[1]"
            style={{
              background: 'radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />

          {/* Green Glow - Bottom Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-[1]"
            style={{
              background: 'radial-gradient(circle, rgba(22, 163, 74, 0.25) 0%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />

          {/* Gold Glow - Center pulsing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.1, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-[1]"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
