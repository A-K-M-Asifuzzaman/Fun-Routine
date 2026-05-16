import { useCallback, useMemo } from 'react'
import type { ClassEntry } from '@/types'

export interface URLBuilderState {
  courses: string[]
  semester?: number
}

export function serializeCourses(courses: ClassEntry[]): string {
  return courses.map(c => `${c.code}.${c.section}`).join(',')
}

export function deserializeCourses(encoded: string, allClasses: ClassEntry[]): ClassEntry[] {
  if (!encoded) return []
  
  const courseIds = encoded.split(',')
  return courseIds
    .map(id => {
      const [code, section] = id.split('.')
      return allClasses.find(c => c.code === code && c.section === parseInt(section))
    })
    .filter((c): c is ClassEntry => c !== undefined)
}

export function useURLState() {
  return useCallback((courses: ClassEntry[], semester?: number) => {
    const params = new URLSearchParams()
    if (courses.length > 0) {
      params.set('courses', serializeCourses(courses))
    }
    if (semester) {
      params.set('semester', semester.toString())
    }
    return params.toString()
  }, [])
}
