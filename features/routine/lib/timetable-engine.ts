// Timetable positioning engine
// Calculates pixel-perfect positions for timetable cards

import type { ClassEntry, Day, TimetablePosition } from "@/types"
import { TIMETABLE_START_MINUTES, TIMETABLE_END_MINUTES, TIMETABLE_TOTAL_MINUTES } from "@/constants/time-slots"
import { DAYS } from "@/constants/semesters"

// Configurable constants
const HOUR_HEIGHT = 60 // pixels per hour
const DAY_WIDTH = 100 // percentage per day column

// Calculate the top offset for a given start time
export function calculateTopOffset(startMinutes: number): number {
  const offsetMinutes = startMinutes - TIMETABLE_START_MINUTES
  return (offsetMinutes / 60) * HOUR_HEIGHT
}

// Calculate the height for a given duration
export function calculateHeight(startMinutes: number, endMinutes: number): number {
  const durationMinutes = endMinutes - startMinutes
  return (durationMinutes / 60) * HOUR_HEIGHT
}

// Calculate column index for a day
export function calculateColumn(day: Day): number {
  return DAYS.indexOf(day)
}

// Check if two time intervals overlap
export function intervalsOverlap(a: ClassEntry, b: ClassEntry): boolean {
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes
}

// Group entries by day
export function groupByDay(entries: ClassEntry[]): Map<Day, ClassEntry[]> {
  const grouped = new Map<Day, ClassEntry[]>()
  
  for (const day of DAYS) {
    grouped.set(day, [])
  }
  
  for (const entry of entries) {
    const dayEntries = grouped.get(entry.day)
    if (dayEntries) {
      dayEntries.push(entry)
    }
  }
  
  return grouped
}

// Calculate position for a single entry (no conflicts)
export function calculatePosition(entry: ClassEntry): TimetablePosition {
  return {
    top: calculateTopOffset(entry.startMinutes),
    height: calculateHeight(entry.startMinutes, entry.endMinutes),
    column: calculateColumn(entry.day),
    width: 100,
    leftOffset: 0,
    zIndex: 1,
  }
}

// Get time slot labels for the grid
export function getTimeSlotLabels(): { minutes: number; label: string }[] {
  const slots: { minutes: number; label: string }[] = []
  
  for (let minutes = TIMETABLE_START_MINUTES; minutes <= TIMETABLE_END_MINUTES; minutes += 60) {
    const hours = Math.floor(minutes / 60)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    slots.push({
      minutes,
      label: `${displayHours}:00 ${period}`,
    })
  }
  
  return slots
}

// Calculate total timetable height
export function getTimetableHeight(): number {
  return (TIMETABLE_TOTAL_MINUTES / 60) * HOUR_HEIGHT
}

// Get current time position (for live indicator)
export function getCurrentTimePosition(): number | null {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  if (currentMinutes < TIMETABLE_START_MINUTES || currentMinutes > TIMETABLE_END_MINUTES) {
    return null
  }
  
  return calculateTopOffset(currentMinutes)
}

// Get current day (Bangladesh timezone)
export function getCurrentDay(): Day | null {
  const now = new Date()
  const dayIndex = now.getDay()
  
  // 0 = Sunday, 6 = Saturday
  // Our days are: Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday
  const dayMap: Record<number, Day> = {
    6: "Saturday",
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
  }
  
  return dayMap[dayIndex] || null
}

// Check if an entry is currently ongoing
export function isCurrentlyOngoing(entry: ClassEntry): boolean {
  const currentDay = getCurrentDay()
  if (currentDay !== entry.day) return false
  
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  return currentMinutes >= entry.startMinutes && currentMinutes < entry.endMinutes
}
