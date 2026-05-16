// Application configuration

export const APP_CONFIG = {
  appName: "EDU Routine Helper",
  shortName: "RoutineHelper",
  university: "East Delta University",
  school: "School of Science, Engineering & Technology",
  semester: "Summer 2026",
  semesterStart: new Date("2026-05-15"),
  semesterEnd: new Date("2026-08-30"),
  version: "1.0.0",
  dataVersion: "summer-2026-v1",
} as const

export const UNIVERSITY_COLORS = {
  primary: "#1e40af", // Blue
  secondary: "#0f766e", // Teal
  accent: "#7c3aed", // Violet
} as const
