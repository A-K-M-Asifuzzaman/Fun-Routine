'use client'

import { useMemo } from 'react'
import { THEORY_SLOTS, LAB_SLOTS } from '@/constants/time-slots'

export function CurrentTimeIndicator() {
  const style = useMemo(() => {
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()
    
    const firstSlot = Math.min(...THEORY_SLOTS.map(s => s.startMinutes))
    const lastSlot = Math.max(...THEORY_SLOTS.map(s => s.endMinutes))
    
    if (minutes < firstSlot || minutes > lastSlot) return null
    
    const totalMinutes = lastSlot - firstSlot
    const topPercent = ((minutes - firstSlot) / totalMinutes) * 100
    
    return {
      top: `${topPercent}%`,
    }
  }, [])
  
  if (!style) return null
  
  return (
    <div
      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-destructive via-destructive to-transparent pointer-events-none z-50"
      style={style}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-destructive rounded-full -ml-1" />
    </div>
  )
}
