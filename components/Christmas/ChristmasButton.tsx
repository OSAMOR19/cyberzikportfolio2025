"use client"

import React, { useEffect, useRef } from 'react'
import { useChristmas } from './ChristmasContext'
import { cn } from '@/lib/utils'

interface ChristmasButtonProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export const ChristmasButton = React.forwardRef<HTMLButtonElement, ChristmasButtonProps>(
  ({ children, className, ...props }, ref) => {
    const { isChristmasMode } = useChristmas()
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      if (!isChristmasMode) return

      const button = buttonRef.current || (ref && typeof ref !== 'function' ? ref.current : null)
      if (!button) return

      const createSparkle = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect()
        const sparkleCount = 6

        for (let i = 0; i < sparkleCount; i++) {
          const sparkle = document.createElement('div')
          sparkle.className = 'sparkle-particle'
          sparkle.textContent = '✨'

          const angle = (Math.PI * 2 * i) / sparkleCount
          const distance = 50 + Math.random() * 30
          const tx = Math.cos(angle) * distance
          const ty = Math.sin(angle) * distance

          sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: ${12 + Math.random() * 8}px;
            pointer-events: none;
            z-index: 9999;
            --tx: ${tx}px;
            --ty: ${ty}px;
          `

          document.body.appendChild(sparkle)

          setTimeout(() => sparkle.remove(), 1000)
        }
      }

      button.addEventListener('mouseenter', createSparkle)

      return () => {
        button.removeEventListener('mouseenter', createSparkle)
      }
    }, [isChristmasMode, ref])

    return (
      <button
        ref={ref || buttonRef}
        className={cn(
          className,
          isChristmasMode && 'christmas-sparkle-button christmas-button-glow'
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ChristmasButton.displayName = 'ChristmasButton'
