'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ClassEntry } from '@/types'

export interface BuilderStoreState {
  selectedCourses: ClassEntry[]
  addCourse: (course: ClassEntry) => void
  removeCourse: (courseId: string) => void
  clearAll: () => void
}

export const useBuilderStore = create<BuilderStoreState>(
  persist(
    (set) => ({
      selectedCourses: [],
      addCourse: (course) =>
        set((state) => ({
          selectedCourses: [...state.selectedCourses, course],
        })),
      removeCourse: (courseId) =>
        set((state) => ({
          selectedCourses: state.selectedCourses.filter(c => c.id !== courseId),
        })),
      clearAll: () => set({ selectedCourses: [] }),
    }),
    {
      name: 'builder-store',
    }
  )
)
