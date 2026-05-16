import { instructors } from '@/data'
import { allClasses } from '@/data'

export function getAllInstructors() {
  return instructors
}

export function getInstructorByShort(short: string) {
  return instructors.find(i => i.short === short)
}

export function getInstructorStats(short: string) {
  const courses = allClasses.filter(c => c.instructorShort === short)
  const uniqueRooms = new Set(courses.map(c => c.room))
  const uniqueDays = new Set(courses.map(c => c.day))
  
  return {
    totalCourses: courses.length,
    rooms: Array.from(uniqueRooms),
    days: Array.from(uniqueDays),
    courses: courses
  }
}
