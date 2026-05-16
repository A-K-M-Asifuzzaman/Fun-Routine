// Time slot constants

import type { TimeSlot } from "@/types"

// Theory class time slots (1.5 hours each)
export const THEORY_SLOTS: TimeSlot[] = [
  { id: "t1", startMinutes: 510, endMinutes: 600, startDisplay: "8:30 AM", endDisplay: "10:00 AM", type: "Theory" },
  { id: "t2", startMinutes: 600, endMinutes: 690, startDisplay: "10:00 AM", endDisplay: "11:30 AM", type: "Theory" },
  { id: "t3", startMinutes: 690, endMinutes: 780, startDisplay: "11:30 AM", endDisplay: "1:00 PM", type: "Theory" },
  { id: "t4", startMinutes: 810, endMinutes: 900, startDisplay: "1:30 PM", endDisplay: "3:00 PM", type: "Theory" },
  { id: "t5", startMinutes: 900, endMinutes: 990, startDisplay: "3:00 PM", endDisplay: "4:30 PM", type: "Theory" },
  { id: "t6", startMinutes: 990, endMinutes: 1080, startDisplay: "4:30 PM", endDisplay: "6:00 PM", type: "Theory" },
]

// Lab class time slots (2 hours each)
export const LAB_SLOTS: TimeSlot[] = [
  { id: "l1", startMinutes: 570, endMinutes: 690, startDisplay: "9:30 AM", endDisplay: "11:30 AM", type: "Lab" },
  { id: "l2", startMinutes: 690, endMinutes: 810, startDisplay: "11:30 AM", endDisplay: "1:30 PM", type: "Lab" },
  { id: "l3", startMinutes: 810, endMinutes: 930, startDisplay: "1:30 PM", endDisplay: "3:30 PM", type: "Lab" },
  { id: "l4", startMinutes: 930, endMinutes: 1050, startDisplay: "3:30 PM", endDisplay: "5:30 PM", type: "Lab" },
]

// Monday has slightly different lab times
export const MONDAY_LAB_SLOTS: TimeSlot[] = [
  { id: "ml1", startMinutes: 540, endMinutes: 660, startDisplay: "9:00 AM", endDisplay: "11:00 AM", type: "Lab" },
  { id: "ml2", startMinutes: 660, endMinutes: 780, startDisplay: "11:00 AM", endDisplay: "1:00 PM", type: "Lab" },
  { id: "ml3", startMinutes: 780, endMinutes: 900, startDisplay: "1:00 PM", endDisplay: "3:00 PM", type: "Lab" },
  { id: "ml4", startMinutes: 930, endMinutes: 1050, startDisplay: "3:30 PM", endDisplay: "5:30 PM", type: "Lab" },
]

// Time range for timetable display
export const TIMETABLE_START_MINUTES = 510 // 8:30 AM
export const TIMETABLE_END_MINUTES = 1080 // 6:00 PM
export const TIMETABLE_TOTAL_MINUTES = TIMETABLE_END_MINUTES - TIMETABLE_START_MINUTES

// Helper to convert time string to minutes
export function timeToMinutes(time: string): number {
  const match = time.match(/(\d+)[:\.](\d+)\s*(AM|PM)?/i)
  if (!match) return 0
  
  let hours = parseInt(match[1])
  const minutes = parseInt(match[2])
  const period = match[3]?.toUpperCase()
  
  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0
  
  return hours * 60 + minutes
}

// Helper to convert minutes to display string
export function minutesToDisplay(minutes: number): string {
  const hours24 = Math.floor(minutes / 60)
  const mins = minutes % 60
  const hours12 = hours24 % 12 || 12
  const period = hours24 >= 12 ? "PM" : "AM"
  return `${hours12}:${mins.toString().padStart(2, "0")} ${period}`
}

// Helper to format time range
export function formatTimeRange(startMinutes: number, endMinutes: number): string {
  return `${minutesToDisplay(startMinutes)} - ${minutesToDisplay(endMinutes)}`
}
