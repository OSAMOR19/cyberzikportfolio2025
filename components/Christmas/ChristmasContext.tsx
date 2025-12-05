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
  const [isChristmasMode, setIsChristmasMode] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Load Christmas mode state from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('christmasMode')
      if (savedMode === 'true') {
        setIsChristmasMode(true)
      }
    }
  }, [])

  const toggleChristmasMode = () => {
    setIsChristmasMode((prev) => {
      const newValue = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('christmasMode', String(newValue))
      }
      return newValue
    })
  }

  return (
    <ChristmasContext.Provider value={{ isChristmasMode, toggleChristmasMode }}>
      {children}
    </ChristmasContext.Provider>
  )
}
