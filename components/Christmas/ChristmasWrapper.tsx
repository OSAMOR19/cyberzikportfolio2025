"use client"

import React, { useEffect, useState } from 'react'
import { ChristmasGlow } from './ChristmasGlow'
import { ChristmasSnow } from './ChristmasSnow'
import { ChristmasMusic } from './ChristmasMusic'
import { ChristmasDecorations } from './ChristmasDecorations'
import { AnimatedSanta } from './AnimatedSanta'

export const ChristmasWrapper = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <ChristmasGlow />
      <ChristmasSnow />
      <ChristmasDecorations />
      <AnimatedSanta />
      <ChristmasMusic />
    </>
  )
}
