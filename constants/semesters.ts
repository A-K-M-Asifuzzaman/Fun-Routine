// Semester constants and metadata

export interface SemesterInfo {
  id: number
  number: number
  name: string
  label: string
  studentCount: number
  courses: string[]
}

export const SEMESTERS: SemesterInfo[] = [
  { id: 1, number: 1, name: "Semester 1", label: "Sem 1", studentCount: 330, courses: ["AA 099", "AA 150", "AA 200", "CSE 111", "CSE 112"] },
  { id: 2, number: 2, name: "Semester 2", label: "Sem 2", studentCount: 120, courses: ["PHY 101", "PHY 102", "CSE 113", "CSE 114", "MATH 107", "ENG 111"] },
  { id: 3, number: 3, name: "Semester 3", label: "Sem 3", studentCount: 185, courses: ["EEE 111", "EEE 112", "CSE 211", "CSE 212", "MATH 207", "CHEM 201"] },
  { id: 4, number: 4, name: "Semester 4", label: "Sem 4", studentCount: 220, courses: ["EEE 213", "EEE 214", "CSE 123", "CSE 124", "CSE 115", "HUM 201"] },
  { id: 5, number: 5, name: "Semester 5", label: "Sem 5", studentCount: 105, courses: ["CSE 215", "CSE 216", "CSE 221", "CSE 222", "CSE 225", "CSE 226", "ENG 112"] },
  { id: 6, number: 6, name: "Semester 6", label: "Sem 6", studentCount: 140, courses: ["CSE 311", "CSE 312", "CSE 313", "CSE 315", "CSE 316", "MATH 205"] },
  { id: 7, number: 7, name: "Semester 7", label: "Sem 7", studentCount: 180, courses: ["CSE 223", "CSE 224", "CSE 325", "CSE 326", "ME 102", "MATH 203"] },
  { id: 8, number: 8, name: "Semester 8", label: "Sem 8", studentCount: 120, courses: ["CSE 319", "CSE 320", "CSE 317", "MATH 301", "HUM 301"] },
  { id: 9, number: 9, name: "Semester 9", label: "Sem 9", studentCount: 245, courses: ["CSE 321", "CSE 322", "CSE 327", "CSE 328", "CSE 411", "CSE 301"] },
  { id: 10, number: 10, name: "Semester 10", label: "Sem 10", studentCount: 80, courses: ["CSE 443", "CSE 463", "CSE 439", "CSE 459"] },
  { id: 11, number: 11, name: "Semester 11", label: "Sem 11", studentCount: 125, courses: ["CSE 435", "CSE 436", "IPD 400", "HUM 203"] },
]

// Semester color coding for visual distinction
export const SEMESTER_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30" },
  2: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/30" },
  3: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  4: { bg: "bg-lime-500/10", text: "text-lime-600 dark:text-lime-400", border: "border-lime-500/30" },
  5: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  6: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-500/30" },
  7: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/30" },
  8: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/30" },
  9: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  10: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
  11: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400", border: "border-fuchsia-500/30" },
}

export const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const
