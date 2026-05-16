// Core data types for EDU Routine Helper

export type Day = "Saturday" | "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday"

export type ClassType = "Theory" | "Lab"

export interface ClassEntry {
  id: string
  day: Day
  type: ClassType
  course: string              // "CSE 223.3"
  courseCode: string          // "CSE 223"
  section: number             // 3
  room: string                // "N202"
  // Time as minutes (critical for conflict detection)
  startMinutes: number        // 510 (8:30 AM)
  endMinutes: number          // 600 (10:00 AM)
  // Display strings
  startTimeDisplay: string    // "8:30 AM"
  endTimeDisplay: string      // "10:00 AM"
  instructorShort: string     // "RHN"
  instructorFull: string      // "Riad Hossain"
  semester: number
  // Enhanced metadata
  courseTitle?: string
  credits?: number
}

export interface Instructor {
  shortForm: string
  fullName: string
}

// Visual positioning for timetable
export interface TimetablePosition {
  top: number
  height: number
  column: number
  width: number
  leftOffset: number
  zIndex: number
}

// Auto-scheduler types
export interface SchedulePreferences {
  courses: string[]
  preferredDays: Day[]
  avoidMornings: boolean
  maxGapMinutes: number
  preferredInstructors: string[]
}

export interface GeneratedSchedule {
  classes: ClassEntry[]
  score: number
  conflicts: number
  totalGap: number
  compactness: number
}

// Conflict types
export interface Conflict {
  class1: ClassEntry
  class2: ClassEntry
  overlapMinutes: number
}

// Search result types
export interface SearchResult {
  item: ClassEntry
  score: number
  matches?: {
    key: string
    value: string
    indices: [number, number][]
  }[]
}

// Gap analysis types
export interface ScheduleAnalytics {
  totalCampusHours: number
  totalCampusMinutes: number
  largestGap: number
  averageGap: number
  compactnessScore: number
  classesByDay: Record<Day, number>
  freeSlots: FreeSlot[]
}

export interface FreeSlot {
  day: Day
  startMinutes: number
  endMinutes: number
  durationMinutes: number
}

// Export types
export interface ExportOptions {
  format: "pdf" | "png" | "ics"
  template: "modern" | "compact" | "monochrome"
  includeQR: boolean
  includeBranding: boolean
}

// Exam schedule types
export interface ExamEntry {
  course: string
  courseCode: string
  semester: number
  day: number // Day 1-8
  department: "CSE" | "EEE"
}

// Time slot types
export interface TimeSlot {
  id: string
  startMinutes: number
  endMinutes: number
  startDisplay: string
  endDisplay: string
  type: ClassType
}

// Room types
export interface Room {
  id: string
  name: string
  building?: string
  capacity?: number
  type: "Theory" | "Lab" | "Both"
}

// Semester info
export interface SemesterInfo {
  id: number
  number: number
  name: string
  label: string
  studentCount: number
  courses: string[]
}
