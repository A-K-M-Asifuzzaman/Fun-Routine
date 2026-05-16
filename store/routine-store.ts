"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ClassEntry, Day, Conflict } from "@/types"
import { APP_CONFIG } from "@/config/app"

interface RoutineState {
  // Selected courses for builder
  selectedCourses: ClassEntry[]
  
  // Filters
  selectedSemester: number | null
  selectedDay: Day | null
  selectedInstructor: string | null
  showTheory: boolean
  showLab: boolean
  
  // UI State
  searchQuery: string
  isCommandOpen: boolean
  
  // Actions
  addCourse: (course: ClassEntry) => void
  removeCourse: (courseId: string) => void
  clearCourses: () => void
  toggleCourse: (course: ClassEntry) => void
  
  setSelectedSemester: (semester: number | null) => void
  setSelectedDay: (day: Day | null) => void
  setSelectedInstructor: (instructor: string | null) => void
  setShowTheory: (show: boolean) => void
  setShowLab: (show: boolean) => void
  
  setSearchQuery: (query: string) => void
  setIsCommandOpen: (open: boolean) => void
  
  // URL state
  loadFromUrl: (courses: string[]) => void
}

// Detect conflicts between two classes
function hasConflict(a: ClassEntry, b: ClassEntry): boolean {
  if (a.day !== b.day) return false
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedCourses: [],
      selectedSemester: null,
      selectedDay: null,
      selectedInstructor: null,
      showTheory: true,
      showLab: true,
      searchQuery: "",
      isCommandOpen: false,
      
      // Actions
      addCourse: (course) => {
        set((state) => {
          if (state.selectedCourses.some(c => c.id === course.id)) {
            return state
          }
          return { selectedCourses: [...state.selectedCourses, course] }
        })
      },
      
      removeCourse: (courseId) => {
        set((state) => ({
          selectedCourses: state.selectedCourses.filter(c => c.id !== courseId)
        }))
      },
      
      clearCourses: () => set({ selectedCourses: [] }),
      
      toggleCourse: (course) => {
        const { selectedCourses } = get()
        if (selectedCourses.some(c => c.id === course.id)) {
          set({ selectedCourses: selectedCourses.filter(c => c.id !== course.id) })
        } else {
          set({ selectedCourses: [...selectedCourses, course] })
        }
      },
      
      setSelectedSemester: (semester) => set({ selectedSemester: semester }),
      setSelectedDay: (day) => set({ selectedDay: day }),
      setSelectedInstructor: (instructor) => set({ selectedInstructor: instructor }),
      setShowTheory: (show) => set({ showTheory: show }),
      setShowLab: (show) => set({ showLab: show }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsCommandOpen: (open) => set({ isCommandOpen: open }),
      
      loadFromUrl: (courses) => {
        // This will be populated when we have the data
        // For now just clear
        set({ selectedCourses: [] })
      },
    }),
    {
      name: `edu-routine-${APP_CONFIG.dataVersion}`,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCourses: state.selectedCourses,
        selectedSemester: state.selectedSemester,
        showTheory: state.showTheory,
        showLab: state.showLab,
      }),
    }
  )
)

// Selectors
export const selectConflicts = (state: RoutineState): Conflict[] => {
  const conflicts: Conflict[] = []
  const { selectedCourses } = state
  
  for (let i = 0; i < selectedCourses.length; i++) {
    for (let j = i + 1; j < selectedCourses.length; j++) {
      const a = selectedCourses[i]
      const b = selectedCourses[j]
      
      if (hasConflict(a, b)) {
        const overlapStart = Math.max(a.startMinutes, b.startMinutes)
        const overlapEnd = Math.min(a.endMinutes, b.endMinutes)
        
        conflicts.push({
          class1: a,
          class2: b,
          overlapMinutes: overlapEnd - overlapStart,
        })
      }
    }
  }
  
  return conflicts
}

export const selectHasConflicts = (state: RoutineState): boolean => {
  return selectConflicts(state).length > 0
}

export const selectConflictingIds = (state: RoutineState): Set<string> => {
  const conflicts = selectConflicts(state)
  const ids = new Set<string>()
  
  conflicts.forEach(c => {
    ids.add(c.class1.id)
    ids.add(c.class2.id)
  })
  
  return ids
}
