import type { ClassEntry } from '@/types'

export interface Conflict {
  courses: ClassEntry[]
  type: 'time' | 'room' | 'instructor'
  message: string
}

export function detectConflicts(courses: ClassEntry[]): Conflict[] {
  const conflicts: Conflict[] = []
  
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const a = courses[i]
      const b = courses[j]
      
      // Check time overlap
      const timeOverlap = doTimesOverlap(a, b)
      if (timeOverlap) {
        conflicts.push({
          courses: [a, b],
          type: 'time',
          message: `${a.code} and ${b.code} overlap in time`
        })
      }
      
      // Check same room at same time
      if (a.room === b.room && timeOverlap && a.day === b.day) {
        conflicts.push({
          courses: [a, b],
          type: 'room',
          message: `${a.code} and ${b.code} conflict in room ${a.room}`
        })
      }
      
      // Check same instructor at same time
      if (a.instructorShort === b.instructorShort && timeOverlap && a.day === b.day) {
        conflicts.push({
          courses: [a, b],
          type: 'instructor',
          message: `Same instructor for ${a.code} and ${b.code}`
        })
      }
    }
  }
  
  return conflicts
}

export function doTimesOverlap(a: ClassEntry, b: ClassEntry): boolean {
  if (a.day !== b.day) return false
  return !(a.endMinutes <= b.startMinutes || b.endMinutes <= a.startMinutes)
}

export function getConflictingCourses(courses: ClassEntry[], course: ClassEntry): ClassEntry[] {
  return courses.filter(c => 
    c.id !== course.id && doTimesOverlap(c, course) && c.day === course.day
  )
}

export function suggestAlternativeSections(
  allClasses: ClassEntry[],
  course: ClassEntry,
  selectedCourses: ClassEntry[]
): ClassEntry[] {
  return allClasses.filter(c => 
    c.code === course.code &&
    c.id !== course.id &&
    !selectedCourses.some(sc => doTimesOverlap(c, sc) && c.day === sc.day)
  )
}
