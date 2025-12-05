"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useChristmas } from './ChristmasContext'

export const ChristmasMusic = () => {
  const { isChristmasMode } = useChristmas()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('https://www.bensound.com/bensound-music/bensound-christmastime.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Stop music when Christmas mode is off
    if (!isChristmasMode && audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [isChristmasMode, isPlaying])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err)
      })
      setIsPlaying(true)
    }
  }

  return (
    <AnimatePresence>
      {isChristmasMode && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="fixed left-4 top-20 z-50"
        >
          <motion.button
            onClick={toggleMusic}
            className={`
              relative p-3 rounded-full font-medium text-sm
              transition-all duration-300 shadow-lg backdrop-blur-sm
              ${isPlaying
                ? 'bg-gradient-to-r from-green-600 to-red-600 text-white border-2 border-white/20'
                : 'bg-black/60 text-gray-300 border-2 border-purple-500/30 hover:border-purple-500/50'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Pause Christmas Music' : 'Play Christmas Music'}
          >
            <motion.div
              animate={{ rotate: isPlaying ? [0, 5, -5, 0] : 0 }}
              transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0, repeatDelay: 0.5 }}
            >
              {isPlaying ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </motion.div>

            {isPlaying && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
