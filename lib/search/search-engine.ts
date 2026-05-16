import Fuse from 'fuse.js'
import { allClasses } from '@/data'
import type { ClassEntry } from '@/types'

let searchIndex: Fuse<ClassEntry> | null = null
const cache = new Map<string, ClassEntry[]>()

export function initializeSearch() {
  if (!searchIndex) {
    searchIndex = new Fuse(allClasses, {
      keys: ['courseCode', 'course', 'instructorShort', 'instructorFull', 'room', 'day'],
      threshold: 0.3,
      minMatchCharLength: 2,
    })
  }
  return searchIndex
}

export function searchCourses(query: string): ClassEntry[] {
  if (!query.trim()) return []
  
  const cacheKey = query.toLowerCase()
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!
  }
  
  const index = initializeSearch()
  const results = index.search(query).map(r => r.item)
  
  cache.set(cacheKey, results)
  return results
}

export function clearSearchCache() {
  cache.clear()
}
