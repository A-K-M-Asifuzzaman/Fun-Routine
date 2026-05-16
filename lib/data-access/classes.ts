import { allClasses, instructors } from '@/data'
import type { ClassEntry, Instructor } from '@/types'

export function getAllClasses(): ClassEntry[] {
  return allClasses
}

export function getClassesBySemester(semester: number): ClassEntry[] {
  return allClasses.filter(c => c.semester === semester)
}

export function getClassesByInstructor(instructorShort: string): ClassEntry[] {
  return allClasses.filter(c => c.instructorShort === instructorShort)
}

export function getClassesByCode(code: string): ClassEntry[] {
  return allClasses.filter(c => c.code === code)
}

export function getClassesByRoom(room: string): ClassEntry[] {
  return allClasses.filter(c => c.room === room)
}

export function getClassesByDay(day: string): ClassEntry[] {
  return allClasses.filter(c => c.day === day)
}
