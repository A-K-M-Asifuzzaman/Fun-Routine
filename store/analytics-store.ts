import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AnalyticsEvent {
  type: 'search' | 'export' | 'schedule_created' | 'conflict_detected' | 'share'
  data?: Record<string, any>
  timestamp: Date
}

export interface AnalyticsStore {
  events: AnalyticsEvent[]
  addEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => void
  getStats: () => {
    totalSearches: number
    totalExports: number
    totalSchedules: number
    totalConflicts: number
  }
}

export const useAnalytics = create<AnalyticsStore>(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            { ...event, timestamp: new Date() },
          ].slice(-1000), // Keep last 1000 events
        })),
      getStats: () => {
        const events = get().events
        return {
          totalSearches: events.filter(e => e.type === 'search').length,
          totalExports: events.filter(e => e.type === 'export').length,
          totalSchedules: events.filter(e => e.type === 'schedule_created').length,
          totalConflicts: events.filter(e => e.type === 'conflict_detected').length,
        }
      },
    }),
    {
      name: 'analytics-store',
    }
  )
)
