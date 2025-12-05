"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ChristmasContextType {
  isChristmasMode: boolean
  toggleChristmasMode: () => void
}

const ChristmasContext = createContext<ChristmasContextType | undefined>(undefined)

export const useChristmas = () => {
  const context = useContext(ChristmasContext)
  if (!context) {
    throw new Error('useChristmas must be used within ChristmasProvider')
  }
  return context
}

export const ChristmasProvider = ({ children }: { children: React.ReactNode }) => {
  // Always ON for Christmas season - no toggle needed
  const [isChristmasMode] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleChristmasMode = () => {
    // No-op - Christmas mode is always on during the season
  }

  return (
    <ChristmasContext.Provider value={{ isChristmasMode, toggleChristmasMode }}>
      {children}
    </ChristmasContext.Provider>
  )
}
