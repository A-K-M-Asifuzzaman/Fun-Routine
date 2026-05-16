// Responsive strategy definitions

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const

export const TIMETABLE_MODES = {
  mobile: {
    daysVisible: 1,
    layout: "list" as const,
    showTimeColumn: true,
    cardSize: "compact" as const,
  },
  tablet: {
    daysVisible: 3,
    layout: "compact" as const,
    showTimeColumn: true,
    cardSize: "normal" as const,
  },
  desktop: {
    daysVisible: 6,
    layout: "grid" as const,
    showTimeColumn: true,
    cardSize: "full" as const,
  },
} as const

export type TimetableMode = keyof typeof TIMETABLE_MODES
