"use client"

import { useMemo, useState, useEffect } from "react"
import type { ClassEntry, Day } from "@/types"
import { DAYS, SEMESTER_COLORS } from "@/constants/semesters"
import { 
  getTimeSlotLabels, 
  getTimetableHeight,
  getCurrentTimePosition,
  getCurrentDay,
} from "../lib/timetable-engine"
import { resolveVisualConflicts } from "../lib/collision-layout"
import { ClassCard } from "./class-card"
import { cn } from "@/lib/utils"

interface TimetableGridProps {
  entries: ClassEntry[]
  selectedIds?: Set<string>
  conflictIds?: Set<string>
  onClassClick?: (entry: ClassEntry) => void
  showCurrentTime?: boolean
  className?: string
}

export function TimetableGrid({
  entries,
  selectedIds = new Set(),
  conflictIds = new Set(),
  onClassClick,
  showCurrentTime = true,
  className,
}: TimetableGridProps) {
  const [currentTimePos, setCurrentTimePos] = useState<number | null>(null)
  const [currentDay, setCurrentDay] = useState<Day | null>(null)

  // Update current time position
  useEffect(() => {
    if (!showCurrentTime) return

    const updateTime = () => {
      setCurrentTimePos(getCurrentTimePosition())
      setCurrentDay(getCurrentDay())
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [showCurrentTime])

  // Calculate positions with collision handling
  const positions = useMemo(() => {
    return resolveVisualConflicts(entries)
  }, [entries])

  const timeSlots = useMemo(() => getTimeSlotLabels(), [])
  const timetableHeight = useMemo(() => getTimetableHeight(), [])

  return (
    <div className={cn("overflow-auto custom-scrollbar", className)}>
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="sticky top-0 z-20 flex border-b bg-background">
          {/* Time column header */}
          <div className="w-20 shrink-0 border-r bg-muted/50 p-2">
            <span className="text-xs font-medium text-muted-foreground">Time</span>
          </div>
          
          {/* Day headers */}
          {DAYS.map((day) => (
            <div
              key={day}
              className={cn(
                "flex-1 border-r p-2 text-center last:border-r-0",
                currentDay === day && "bg-primary/5"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                currentDay === day && "text-primary"
              )}>
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Timetable body */}
        <div className="relative flex" style={{ height: timetableHeight }}>
          {/* Time column */}
          <div className="w-20 shrink-0 border-r bg-muted/30">
            {timeSlots.map((slot, index) => (
              <div
                key={slot.minutes}
                className="absolute left-0 w-20 border-b px-2"
                style={{ top: index * 60 }}
              >
                <span className="text-xs text-muted-foreground">{slot.label}</span>
              </div>
            ))}
          </div>

          {/* Grid area */}
          <div className="relative flex-1">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-6">
              {DAYS.map((day, dayIndex) => (
                <div
                  key={day}
                  className={cn(
                    "border-r last:border-r-0 relative",
                    currentDay === day && "bg-primary/[0.02]"
                  )}
                >
                  {/* Hour lines */}
                  {timeSlots.map((_, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="absolute left-0 right-0 border-b border-dashed border-border/50"
                      style={{ top: hourIndex * 60 }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Current time indicator */}
            {showCurrentTime && currentTimePos !== null && currentDay && (
              <div
                className="absolute left-0 right-0 z-30 pointer-events-none"
                style={{ top: currentTimePos }}
              >
                <div className="relative">
                  <div 
                    className="absolute h-0.5 bg-destructive"
                    style={{
                      left: `${(DAYS.indexOf(currentDay) / 6) * 100}%`,
                      width: `${100 / 6}%`,
                    }}
                  >
                    <div className="absolute -left-1 -top-1 size-2.5 rounded-full bg-destructive" />
                  </div>
                </div>
              </div>
            )}

            {/* Class cards */}
            {entries.map((entry) => {
              const position = positions.get(entry.id)
              if (!position) return null

              const dayIndex = DAYS.indexOf(entry.day)
              const dayWidth = 100 / 6

              return (
                <ClassCard
                  key={entry.id}
                  entry={entry}
                  position={position}
                  dayIndex={dayIndex}
                  dayWidth={dayWidth}
                  isSelected={selectedIds.has(entry.id)}
                  hasConflict={conflictIds.has(entry.id)}
                  onClick={() => onClassClick?.(entry)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
