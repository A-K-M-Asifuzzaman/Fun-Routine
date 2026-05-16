import type { ClassEntry } from '@/types'

export interface SchedulerConstraints {
  preferredDays?: string[]
  avoidMornings?: boolean
  maxDailyHours?: number
  maxGapHours?: number
  preferredInstructors?: string[]
}

export function generateOptimalSchedules(
  courses: ClassEntry[],
  availableSections: Map<string, ClassEntry[]>,
  constraints?: SchedulerConstraints
): ClassEntry[][] {
  const schedules: ClassEntry[][] = []
  
  // Group courses by code
  const courseGroups = new Map<string, ClassEntry[]>()
  courses.forEach(course => {
    if (!courseGroups.has(course.courseCode)) {
      courseGroups.set(course.courseCode, [])
    }
    courseGroups.get(course.courseCode)!.push(course)
  })
  
  // Generate all possible combinations (simplified approach)
  const generateCombinations = (groups: ClassEntry[][], index: number = 0, current: ClassEntry[] = []): ClassEntry[][] => {
    if (index === groups.length) {
      const schedule = [...current]
      if (isValidSchedule(schedule, constraints)) {
        return [schedule]
      }
      return []
    }
    
    const results: ClassEntry[][] = []
    const currentGroup = groups[index]
    
    for (const section of currentGroup) {
      const newCurrent = [...current, section]
      if (hasNoConflicts(newCurrent)) {
        results.push(...generateCombinations(groups, index + 1, newCurrent))
      }
    }
    
    return results
  }
  
  const groups = Array.from(courseGroups.values())
  return generateCombinations(groups).slice(0, 5) // Return top 5 schedules
}

function hasNoConflicts(schedule: ClassEntry[]): boolean {
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      const a = schedule[i]
      const b = schedule[j]
      if (a.day === b.day && !(a.endMinutes <= b.startMinutes || b.endMinutes <= a.startMinutes)) {
        return false
      }
    }
  }
  return true
}

function isValidSchedule(schedule: ClassEntry[], constraints?: SchedulerConstraints): boolean {
  if (!constraints) return true
  
  if (constraints.preferredDays && constraints.preferredDays.length > 0) {
    const days = new Set(schedule.map(c => c.day))
    const validDays = days.every(d => constraints.preferredDays!.includes(d))
    if (!validDays) return false
  }
  
  if (constraints.avoidMornings) {
    const hasMorning = schedule.some(c => c.startMinutes < 600) // Before 10 AM
    if (hasMorning) return false
  }
  
  if (constraints.maxDailyHours) {
    for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
      const dayClasses = schedule.filter(c => c.day === day)
      const totalMinutes = dayClasses.reduce((sum, c) => sum + (c.endMinutes - c.startMinutes), 0)
      if (totalMinutes > constraints.maxDailyHours * 60) return false
    }
  }
  
  return true
}

export function scoreSchedule(schedule: ClassEntry[]): number {
  let score = 0
  const days = new Set(schedule.map(c => c.day))
  
  // Prefer fewer class days
  score += (5 - Math.min(days.size, 5)) * 10
  
  // Prefer compact schedules (minimize gaps)
  const dayGroups = new Map<string, ClassEntry[]>()
  schedule.forEach(c => {
    if (!dayGroups.has(c.day)) dayGroups.set(c.day, [])
    dayGroups.get(c.day)!.push(c)
  })
  
  let totalGaps = 0
  dayGroups.forEach(classes => {
    classes.sort((a, b) => a.startMinutes - b.startMinutes)
    for (let i = 0; i < classes.length - 1; i++) {
      totalGaps += classes[i + 1].startMinutes - classes[i].endMinutes
    }
  })
  
  score -= Math.min(totalGaps / 60, 50) // Penalize long gaps
  
  return score
}
