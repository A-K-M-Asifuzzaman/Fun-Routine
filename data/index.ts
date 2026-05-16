// Main data index - Single source of truth
// This file exports all routine data and derived collections

import type { ClassEntry, Day } from "@/types"
import { ALL_CLASSES } from "./routine-data"
import { 
  tuesdayTheory, tuesdayLab, 
  wednesdayTheory, wednesdayLab, 
  thursdayTheory, thursdayLab 
} from "./routine-data-continued"
import { INSTRUCTORS as INSTRUCTORS_RAW } from "./instructors"

// Transform instructor format
export const instructors = INSTRUCTORS_RAW.map(inst => ({
  short: inst.shortForm,
  full: inst.fullName,
}))

// Combine all classes from all days
export const allClasses: ClassEntry[] = [
  ...ALL_CLASSES,
  ...tuesdayTheory,
  ...tuesdayLab,
  ...wednesdayTheory,
  ...wednesdayLab,
  ...thursdayTheory,
  ...thursdayLab,
]

// =============================================
// DERIVED DATA - Rooms extracted from classes
// =============================================
export const allRooms = (() => {
  const roomSet = new Set<string>()
  allClasses.forEach(c => roomSet.add(c.room))
  
  return Array.from(roomSet).map(name => {
    const classes = allClasses.filter(c => c.room === name)
    const hasTheory = classes.some(c => c.type === "Theory")
    const hasLab = classes.some(c => c.type === "Lab")
    
    // Determine building from room name
    let building: string | undefined
    if (name.startsWith("N")) {
      building = "New Building"
    } else if (parseInt(name) >= 100 && parseInt(name) < 200) {
      building = "Main Building Ground Floor"
    } else if (parseInt(name) >= 300 && parseInt(name) < 400) {
      building = "Main Building 3rd Floor"
    }
    
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      building,
      type: hasTheory && hasLab ? "Both" : hasTheory ? "Theory" : "Lab",
    }
  }).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
})()

// =============================================
// SEARCH INDEXES - Pre-computed for performance
// =============================================
export const searchIndex = {
  bySemester: new Map<number, ClassEntry[]>(),
  byInstructor: new Map<string, ClassEntry[]>(),
  byRoom: new Map<string, ClassEntry[]>(),
  byDay: new Map<Day, ClassEntry[]>(),
  byCourseCode: new Map<string, ClassEntry[]>(),
}

// Build indexes
allClasses.forEach(entry => {
  // By semester
  const semClasses = searchIndex.bySemester.get(entry.semester) || []
  semClasses.push(entry)
  searchIndex.bySemester.set(entry.semester, semClasses)
  
  // By instructor
  const instClasses = searchIndex.byInstructor.get(entry.instructorShort) || []
  instClasses.push(entry)
  searchIndex.byInstructor.set(entry.instructorShort, instClasses)
  
  // By room
  const roomClasses = searchIndex.byRoom.get(entry.room) || []
  roomClasses.push(entry)
  searchIndex.byRoom.set(entry.room, roomClasses)
  
  // By day
  const dayClasses = searchIndex.byDay.get(entry.day) || []
  dayClasses.push(entry)
  searchIndex.byDay.set(entry.day, dayClasses)
  
  // By course code
  const codeClasses = searchIndex.byCourseCode.get(entry.courseCode) || []
  codeClasses.push(entry)
  searchIndex.byCourseCode.set(entry.courseCode, codeClasses)
})

// =============================================
// STATISTICS
// =============================================
export const dataStats = {
  totalClasses: allClasses.length,
  totalTheory: allClasses.filter(c => c.type === "Theory").length,
  totalLab: allClasses.filter(c => c.type === "Lab").length,
  totalRooms: allRooms.length,
  totalInstructors: instructors.length,
  semesters: Array.from(new Set(allClasses.map(c => c.semester))).filter(s => s > 0).sort((a, b) => a - b),
  days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as Day[],
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Get unique course codes
export function getUniqueCourses(): string[] {
  return Array.from(new Set(allClasses.map(c => c.courseCode))).sort()
}

// Get courses by semester
export function getCoursesBySemester(semester: number): string[] {
  const classes = searchIndex.bySemester.get(semester) || []
  return Array.from(new Set(classes.map(c => c.courseCode))).sort()
}

// Get sections for a course
export function getSectionsForCourse(courseCode: string): ClassEntry[] {
  return searchIndex.byCourseCode.get(courseCode) || []
}

// Get instructor's schedule
export function getInstructorSchedule(shortForm: string): ClassEntry[] {
  return searchIndex.byInstructor.get(shortForm) || []
}

// Get room schedule
export function getRoomSchedule(room: string): ClassEntry[] {
  return searchIndex.byRoom.get(room) || []
}

// Get classes for a specific day
export function getClassesByDay(day: Day): ClassEntry[] {
  return searchIndex.byDay.get(day) || []
}
