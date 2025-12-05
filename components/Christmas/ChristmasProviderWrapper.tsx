"use client"

import { ChristmasProvider } from './ChristmasContext'

export function ChristmasProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ChristmasProvider>{children}</ChristmasProvider>
}
