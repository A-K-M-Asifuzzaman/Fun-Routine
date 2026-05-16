import { allClasses } from '@/data'

export function getAllRooms() {
  const rooms = new Set(allClasses.map(c => c.room))
  return Array.from(rooms).sort()
}

export function getClassesByRoom(room: string) {
  return allClasses.filter(c => c.room === room)
}

export function getRoomStats(room: string) {
  const courses = allClasses.filter(c => c.room === room)
  const uniqueDays = new Set(courses.map(c => c.day))
  const uniqueTimes = new Set(courses.map(c => `${c.startMinutes}-${c.endMinutes}`))
  
  return {
    totalCourses: courses.length,
    days: Array.from(uniqueDays),
    courses: courses
  }
}

export function getRoomAvailability(room: string, day: string, startMinutes: number, endMinutes: number) {
  const courses = allClasses.filter(c => 
    c.room === room && 
    c.day === day && 
    !(c.endMinutes <= startMinutes || c.startMinutes >= endMinutes)
  )
  
  return courses.length === 0
}
