"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useChristmas } from './ChristmasContext'

export const ChristmasToggle = () => {
  const { isChristmasMode, toggleChristmasMode } = useChristmas()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed top-20 right-4 z-50"
    >
      <motion.button
        onClick={toggleChristmasMode}
        className={`
          relative px-4 py-2 rounded-full font-medium text-sm
          transition-all duration-300 shadow-lg backdrop-blur-sm
          ${isChristmasMode
            ? 'bg-gradient-to-r from-red-600 to-green-600 text-white border-2 border-white/20'
            : 'bg-black/60 text-gray-300 border-2 border-purple-500/30 hover:border-purple-500/50'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: isChristmasMode ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {isChristmasMode ? '🎄' : '🎅'}
          </motion.span>
          <span>{isChristmasMode ? 'Christmas ON' : 'Christmas OFF'}</span>
        </span>

        {isChristmasMode && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}
