// Complete routine data parsed from SoSET Undergraduate Routine - Summer 2026
// This is the single source of truth for all class entries

import type { ClassEntry, Day, ClassType } from "@/types"
import { getInstructorFullName } from "./instructors"

// Helper to generate unique ID
function generateId(day: string, course: string, room: string, startMinutes: number): string {
  return `${day}-${course}-${room}-${startMinutes}`.replace(/\s+/g, "-").toLowerCase()
}

// Helper to parse course code and section
function parseCourse(course: string): { courseCode: string; section: number } {
  const match = course.match(/^(.+?)\.(\d+)$/)
  if (match) {
    return { courseCode: match[1], section: parseInt(match[2]) }
  }
  return { courseCode: course, section: 0 }
}

// Helper to determine semester from course code
function getSemester(courseCode: string): number {
  const code = courseCode.toUpperCase()
  
  // Semester 1
  if (code.startsWith("AA") || (code.startsWith("CSE 111") || code.startsWith("CSE 112"))) return 1
  
  // Semester 2
  if (code.startsWith("PHY 101") || code.startsWith("PHY 102") || 
      code.startsWith("CSE 113") || code.startsWith("CSE 114") ||
      code.startsWith("MATH 107") || code.startsWith("ENG 111")) return 2
  
  // Semester 3
  if (code.startsWith("EEE 111") || code.startsWith("EEE 112") ||
      code.startsWith("CSE 211") || code.startsWith("CSE 212") ||
      code.startsWith("MATH 207") || code.startsWith("CHEM 201")) return 3
  
  // Semester 4
  if (code.startsWith("EEE 213") || code.startsWith("EEE 214") ||
      code.startsWith("CSE 123") || code.startsWith("CSE 124") ||
      code.startsWith("CSE 115") || code.startsWith("HUM 201")) return 4
  
  // Semester 5
  if (code.startsWith("CSE 215") || code.startsWith("CSE 216") ||
      code.startsWith("CSE 221") || code.startsWith("CSE 222") ||
      code.startsWith("CSE 225") || code.startsWith("CSE 226") ||
      code.startsWith("ENG 112")) return 5
  
  // Semester 6
  if (code.startsWith("CSE 311") || code.startsWith("CSE 312") ||
      code.startsWith("CSE 313") || code.startsWith("CSE 315") ||
      code.startsWith("CSE 316") || code.startsWith("MATH 205")) return 6
  
  // Semester 7
  if (code.startsWith("CSE 223") || code.startsWith("CSE 224") ||
      code.startsWith("CSE 325") || code.startsWith("CSE 326") ||
      code.startsWith("ME 102") || code.startsWith("MATH 203")) return 7
  
  // Semester 8
  if (code.startsWith("CSE 319") || code.startsWith("CSE 320") ||
      code.startsWith("CSE 317") || code.startsWith("MATH 301") ||
      code.startsWith("HUM 301")) return 8
  
  // Semester 9
  if (code.startsWith("CSE 321") || code.startsWith("CSE 322") ||
      code.startsWith("CSE 327") || code.startsWith("CSE 328") ||
      code.startsWith("CSE 411") || code.startsWith("CSE 301")) return 9
  
  // Semester 10
  if (code.startsWith("CSE 443") || code.startsWith("CSE 463") ||
      code.startsWith("CSE 439") || code.startsWith("CSE 459")) return 10
  
  // Semester 11
  if (code.startsWith("CSE 435") || code.startsWith("CSE 436") ||
      code.startsWith("IPD 400") || code.startsWith("HUM 203")) return 11
  
  // EEE courses
  if (code.startsWith("EEE")) return 0 // EEE specific
  
  return 0
}

// Create a class entry
function createEntry(
  day: Day,
  type: ClassType,
  course: string,
  room: string,
  startMinutes: number,
  endMinutes: number,
  instructorShort: string
): ClassEntry {
  const { courseCode, section } = parseCourse(course)
  const hours = Math.floor(startMinutes / 60)
  const mins = startMinutes % 60
  const startDisplay = `${hours % 12 || 12}:${mins.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`
  
  const endHours = Math.floor(endMinutes / 60)
  const endMins = endMinutes % 60
  const endDisplay = `${endHours % 12 || 12}:${endMins.toString().padStart(2, "0")} ${endHours >= 12 ? "PM" : "AM"}`
  
  return {
    id: generateId(day, course, room, startMinutes),
    day,
    type,
    course,
    courseCode,
    section,
    room,
    startMinutes,
    endMinutes,
    startTimeDisplay: startDisplay,
    endTimeDisplay: endDisplay,
    instructorShort,
    instructorFull: getInstructorFullName(instructorShort),
    semester: getSemester(courseCode),
  }
}

// =============================================
// SATURDAY THEORY CLASSES
// =============================================
const saturdayTheory: ClassEntry[] = [
  // Room 103
  createEntry("Saturday", "Theory", "EEE 111.5", "103", 510, 600, "TK"),
  createEntry("Saturday", "Theory", "MATH 207.5", "103", 600, 690, "SWAPNIL"),
  createEntry("Saturday", "Theory", "PHY 101.4", "103", 690, 780, "ABR"),
  createEntry("Saturday", "Theory", "MATH 107.4", "103", 810, 900, "MSR"),
  
  // Room 107
  createEntry("Saturday", "Theory", "MATH 207.6", "107", 510, 600, "SWAPNIL"),
  createEntry("Saturday", "Theory", "EEE 111.6", "107", 600, 690, "TK"),
  createEntry("Saturday", "Theory", "MATH 301.4", "107", 690, 780, "ANJ"),
  createEntry("Saturday", "Theory", "CSE 211.4", "107", 810, 900, "TAS"),
  
  // Room 108
  createEntry("Saturday", "Theory", "EEE 213.3", "108", 690, 780, "SKD"),
  createEntry("Saturday", "Theory", "EEE 213.5", "108", 810, 900, "JUNAYET"),
  createEntry("Saturday", "Theory", "CSE 115.5", "108", 900, 990, "ANB"),
  createEntry("Saturday", "Theory", "HUM 201.5", "108", 990, 1080, "SUMAIYA"),
  
  // Room 110
  createEntry("Saturday", "Theory", "CSE 311.4", "110", 510, 600, "RHN"),
  createEntry("Saturday", "Theory", "CSE 313.4", "110", 600, 690, "IMTIAZ"),
  createEntry("Saturday", "Theory", "CSE 317.2", "110", 690, 780, "FT"),
  createEntry("Saturday", "Theory", "CSE 115.6", "110", 810, 900, "ANB"),
  createEntry("Saturday", "Theory", "HUM 201.6", "110", 900, 990, "SUMAIYA"),
  createEntry("Saturday", "Theory", "EEE 213.6", "110", 990, 1080, "JUNAYET"),
  
  // Room 111
  createEntry("Saturday", "Theory", "CSE 301.2", "111", 510, 600, "YEASIN"),
  createEntry("Saturday", "Theory", "CSE 327.2", "111", 600, 690, "UDD"),
  createEntry("Saturday", "Theory", "HUM 301.3", "111", 690, 780, "NUSRAT"),
  createEntry("Saturday", "Theory", "CSE 319.2", "111", 810, 900, "JHJ"),
  createEntry("Saturday", "Theory", "HUM 201.7", "111", 900, 990, "TBA"),
  createEntry("Saturday", "Theory", "CSE 115.7", "111", 990, 1080, "ANB"),
  
  // Room 114
  createEntry("Saturday", "Theory", "AA 099.5", "114", 510, 600, "AAF1"),
  createEntry("Saturday", "Theory", "AA 150.5", "114", 600, 690, "AAF2"),
  createEntry("Saturday", "Theory", "AA 200.5", "114", 690, 780, "AAF3"),
  createEntry("Saturday", "Theory", "CSE 327.6", "114", 810, 900, "MHN"),
  
  // Room 311
  createEntry("Saturday", "Theory", "CSE 319.1", "311", 600, 690, "JHJ"),
  createEntry("Saturday", "Theory", "EEE 217", "311", 690, 780, "IMTIAZ"),
  
  // Room 312
  createEntry("Saturday", "Theory", "CSE 301.5", "312", 600, 690, "YEASIN"),
  createEntry("Saturday", "Theory", "CSE 327.5", "312", 690, 780, "MHN"),
  createEntry("Saturday", "Theory", "IPD 400 (EEE)", "312", 810, 900, "FARIA"),
  createEntry("Saturday", "Theory", "EEE 471", "312", 900, 990, "JUNAYET"),
  createEntry("Saturday", "Theory", "EEE 453", "312", 990, 1080, "SMI"),
  
  // Room N201
  createEntry("Saturday", "Theory", "HUM 301.4", "N201", 810, 900, "NUSRAT"),
  createEntry("Saturday", "Theory", "IPD 400.1", "N201", 900, 990, "FARIA"),
  createEntry("Saturday", "Theory", "CSE 435.1", "N201", 990, 1080, "ANC"),
  
  // Room N202
  createEntry("Saturday", "Theory", "CSE 223.3", "N202", 690, 780, "RUMKY"),
  createEntry("Saturday", "Theory", "HUM 201.3", "N202", 810, 900, "JAMILA"),
  createEntry("Saturday", "Theory", "CSE 115.3", "N202", 900, 990, "ARFAN"),
  
  // Room N203
  createEntry("Saturday", "Theory", "CSE 317.1", "N203", 810, 900, "FT"),
  createEntry("Saturday", "Theory", "CSE 435.2", "N203", 900, 990, "ANC"),
  createEntry("Saturday", "Theory", "IPD 400.2", "N203", 990, 1080, "FARIA"),
  
  // Room N204
  createEntry("Saturday", "Theory", "CSE 411.6", "N204", 690, 780, "ASHRAF"),
  createEntry("Saturday", "Theory", "CSE 321.5", "N204", 810, 900, "JNM"),
  
  // Room N601
  createEntry("Saturday", "Theory", "AA 099.1 (EEE)", "N601", 600, 690, "AAF4"),
  createEntry("Saturday", "Theory", "AA 150.1 (EEE)", "N601", 690, 780, "AAF5"),
  createEntry("Saturday", "Theory", "MATH 301.3", "N601", 810, 900, "ANJ"),
  
  // Room N602
  createEntry("Saturday", "Theory", "AA 150.2 (EEE)", "N602", 600, 690, "AAF5"),
  createEntry("Saturday", "Theory", "AA 099.2 (EEE)", "N602", 690, 780, "AAF4"),
  createEntry("Saturday", "Theory", "EEE 213.4", "N602", 810, 900, "SKD"),
  createEntry("Saturday", "Theory", "HUM 201.4", "N602", 900, 990, "JAMILA"),
  createEntry("Saturday", "Theory", "CSE 115.4", "N602", 990, 1080, "ARFAN"),
  
  // Room N603
  createEntry("Saturday", "Theory", "AA 150.8", "N603", 510, 600, "AAF5"),
  createEntry("Saturday", "Theory", "CSE 111.8", "N603", 600, 690, "FARJANA"),
  createEntry("Saturday", "Theory", "AA 200.10", "N603", 690, 780, "AAF6"),
  createEntry("Saturday", "Theory", "AA 099.10", "N603", 810, 900, "AAF4"),
  createEntry("Saturday", "Theory", "CSE 111.10", "N603", 900, 990, "MONALISA"),
  
  // Room N604
  createEntry("Saturday", "Theory", "AA 200.6", "N604", 510, 600, "AAF3"),
  createEntry("Saturday", "Theory", "AA 099.6", "N604", 600, 690, "AAF1"),
  createEntry("Saturday", "Theory", "CSE 111.9", "N604", 690, 780, "FARJANA"),
  createEntry("Saturday", "Theory", "CSE 443.3", "N604", 810, 900, "ASHRAF"),
  createEntry("Saturday", "Theory", "CSE 459.3", "N604", 900, 990, "JNM"),
  createEntry("Saturday", "Theory", "CSE 439.3", "N604", 990, 1080, "MUSFEQA"),
  
  // Room N605
  createEntry("Saturday", "Theory", "CSE 111.2", "N605", 600, 690, "SSD"),
  createEntry("Saturday", "Theory", "AA 150.2", "N605", 690, 780, "AAF2"),
  createEntry("Saturday", "Theory", "MATH 205.6", "N605", 810, 900, "MONALISA"),
  createEntry("Saturday", "Theory", "HUM 203.2", "N605", 900, 990, "NUSRAT"),
  
  // Room N606
  createEntry("Saturday", "Theory", "AA 200.1", "N606", 600, 690, "AAF3"),
  createEntry("Saturday", "Theory", "CSE 111.1", "N606", 690, 780, "SSD"),
  createEntry("Saturday", "Theory", "AA 200.7", "N606", 810, 900, "AAF6"),
]

// =============================================
// SATURDAY LAB CLASSES
// =============================================
const saturdayLab: ClassEntry[] = [
  // Room 102
  createEntry("Saturday", "Lab", "CSE 114.4", "102", 570, 690, "FT"),
  createEntry("Saturday", "Lab", "CSE 212.2", "102", 690, 810, "MRA"),
  createEntry("Saturday", "Lab", "ME 102.3", "102", 810, 930, "AFNAN"),
  createEntry("Saturday", "Lab", "ME 102.7", "102", 930, 1050, "NEZAM"),
  
  // Room 105
  createEntry("Saturday", "Lab", "EEE 112.2", "105", 570, 690, "ANJ"),
  createEntry("Saturday", "Lab", "EEE 112.8", "105", 690, 810, "TK"),
  createEntry("Saturday", "Lab", "CSE 224.7", "105", 810, 930, "SMI"),
  createEntry("Saturday", "Lab", "CSE 224.3", "105", 930, 1050, "RUMKY"),
  
  // Room 106
  createEntry("Saturday", "Lab", "CSE 224.6", "106", 690, 810, "SHAMIM"),
  createEntry("Saturday", "Lab", "CSE 224.4", "106", 810, 930, "RUMKY"),
  createEntry("Saturday", "Lab", "EEE 302", "106", 930, 1050, "TK"),
  
  // Room 109
  createEntry("Saturday", "Lab", "PHY 102.3", "109", 570, 690, "ABR"),
  createEntry("Saturday", "Lab", "EEE 112.4", "109", 690, 810, "MSR"),
  createEntry("Saturday", "Lab", "PHY 102.3 (EEE)", "109", 810, 930, "ABR"),
  createEntry("Saturday", "Lab", "EEE 112.1", "109", 930, 1050, "SHAMIM"),
  
  // Room 115
  createEntry("Saturday", "Lab", "CSE 320.5", "115", 570, 690, "MHN"),
  createEntry("Saturday", "Lab", "CSE 212.6", "115", 690, 810, "TAS"),
  createEntry("Saturday", "Lab", "CSE 212.1", "115", 810, 930, "MRA"),
  createEntry("Saturday", "Lab", "ME 102.4", "115", 930, 1050, "AFNAN"),
  
  // Room 313
  createEntry("Saturday", "Lab", "CSE 320.2", "313", 570, 690, "JHJ"),
  createEntry("Saturday", "Lab", "CSE 114.3", "313", 690, 810, "YEASIN"),
  createEntry("Saturday", "Lab", "ME 102.6", "313", 810, 930, "NEZAM"),
  
  // Room N304
  createEntry("Saturday", "Lab", "CSE 212.4", "N304", 930, 1050, "TAS"),
  
  // Room N607
  createEntry("Saturday", "Lab", "CSE 112.9", "N607", 810, 930, "FARJANA"),
  createEntry("Saturday", "Lab", "CSE 112.7", "N607", 930, 1050, "ASHRAF"),
]

// =============================================
// SUNDAY THEORY CLASSES
// =============================================
const sundayTheory: ClassEntry[] = [
  // Room 103
  createEntry("Sunday", "Theory", "CSE 211.4", "103", 510, 600, "TAS"),
  createEntry("Sunday", "Theory", "MATH 207.4", "103", 600, 690, "SWAPNIL"),
  createEntry("Sunday", "Theory", "CSE 311.1", "103", 690, 780, "SAF"),
  createEntry("Sunday", "Theory", "CSE 113.2", "103", 810, 900, "TAZ"),
  createEntry("Sunday", "Theory", "MATH 107.2", "103", 900, 990, "MSR"),
  createEntry("Sunday", "Theory", "PHY 101.2", "103", 990, 1080, "SHA"),
  
  // Room 107
  createEntry("Sunday", "Theory", "CHEM 201.5", "107", 510, 600, "TULY"),
  createEntry("Sunday", "Theory", "CSE 211.5", "107", 600, 690, "TAS"),
  createEntry("Sunday", "Theory", "CSE 319.1", "107", 690, 780, "JHJ"),
  createEntry("Sunday", "Theory", "EEE 303", "107", 810, 900, "IMTIAZ"),
  createEntry("Sunday", "Theory", "PHY 101.1", "107", 900, 990, "SHA"),
  createEntry("Sunday", "Theory", "MATH 107.1", "107", 990, 1080, "MSR"),
  
  // Room 108
  createEntry("Sunday", "Theory", "EEE 111.6", "108", 510, 600, "TK"),
  createEntry("Sunday", "Theory", "CHEM 201.6", "108", 600, 690, "TULY"),
  createEntry("Sunday", "Theory", "EEE 401.1", "108", 690, 780, "AAA"),
  createEntry("Sunday", "Theory", "MATH 107.3", "108", 810, 900, "MSR"),
  createEntry("Sunday", "Theory", "CSE 113.3", "108", 900, 990, "TAZ"),
  
  // Room 110
  createEntry("Sunday", "Theory", "CSE 215.1", "110", 690, 810, "PH"),
  createEntry("Sunday", "Theory", "CSE 225.1", "110", 810, 900, "JUD"),
  createEntry("Sunday", "Theory", "CSE 123.1", "110", 900, 990, "JM"),
  createEntry("Sunday", "Theory", "HUM 201.1", "110", 990, 1080, "ALFA"),
  
  // Room 111
  createEntry("Sunday", "Theory", "CSE 311.2", "111", 600, 690, "SAF"),
  createEntry("Sunday", "Theory", "CSE 315.2", "111", 690, 780, "RHN"),
  createEntry("Sunday", "Theory", "CSE 123.2", "111", 810, 900, "JM"),
  createEntry("Sunday", "Theory", "HUM 201.2", "111", 900, 990, "ALFA"),
  
  // Room 114
  createEntry("Sunday", "Theory", "CSE 315.3", "114", 510, 600, "SAK"),
  createEntry("Sunday", "Theory", "CSE 313.3", "114", 600, 690, "IMTIAZ"),
  createEntry("Sunday", "Theory", "CSE 327.7", "114", 690, 780, "MHN"),
  createEntry("Sunday", "Theory", "CSE 411.2", "114", 810, 900, "SAB"),
  createEntry("Sunday", "Theory", "CSE 301.2", "114", 900, 990, "YEASIN"),
  createEntry("Sunday", "Theory", "CSE 321.2", "114", 990, 1080, "TJ"),
  
  // Room 311
  createEntry("Sunday", "Theory", "CSE 313.4", "311", 510, 600, "IMTIAZ"),
  createEntry("Sunday", "Theory", "CSE 315.4", "311", 600, 690, "SAK"),
  createEntry("Sunday", "Theory", "CHEM 201.3", "311", 690, 780, "TULY"),
  createEntry("Sunday", "Theory", "CSE 223.1", "311", 810, 900, "SMI"),
  createEntry("Sunday", "Theory", "CSE 411.3", "311", 900, 990, "SAB"),
  createEntry("Sunday", "Theory", "CSE 301.3", "311", 990, 1080, "YEASIN"),
  
  // Room 312
  createEntry("Sunday", "Theory", "EEE 301", "312", 600, 690, "TK"),
  createEntry("Sunday", "Theory", "EEE 207", "312", 690, 780, "BB"),
  createEntry("Sunday", "Theory", "MATH 203.2", "312", 810, 900, "SAMIHA"),
  createEntry("Sunday", "Theory", "CSE 321.4", "312", 900, 990, "TJ"),
  createEntry("Sunday", "Theory", "CSE 327.4", "312", 990, 1080, "SAB"),
  
  // Room N201
  createEntry("Sunday", "Theory", "PHY 101.4", "N201", 510, 600, "ABR"),
  createEntry("Sunday", "Theory", "ENG 111.4", "N201", 600, 690, "LAM"),
  createEntry("Sunday", "Theory", "CSE 113.4", "N201", 690, 780, "FT"),
  createEntry("Sunday", "Theory", "CSE 301.6", "N201", 810, 900, "TRINA"),
  createEntry("Sunday", "Theory", "CSE 325.5", "N201", 900, 990, "ABH"),
  createEntry("Sunday", "Theory", "MATH 203.5", "N201", 990, 1080, "SAMIHA"),
  
  // Room N202
  createEntry("Sunday", "Theory", "AA 150.9", "N202", 510, 600, "AAF5"),
  createEntry("Sunday", "Theory", "AA 099.9", "N202", 600, 690, "AAF4"),
  createEntry("Sunday", "Theory", "CSE 103", "N202", 690, 780, "MONALISA"),
  createEntry("Sunday", "Theory", "CSE 325.3", "N202", 810, 900, "ARC"),
  createEntry("Sunday", "Theory", "MATH 203.6", "N202", 900, 990, "SAMIHA"),
  createEntry("Sunday", "Theory", "CSE 325.6", "N202", 990, 1080, "ABH"),
  
  // Room N203
  createEntry("Sunday", "Theory", "AA 200.2 (EEE)", "N203", 510, 600, "AAF6"),
  createEntry("Sunday", "Theory", "PHY 101.2 (EEE)", "N203", 600, 690, "ABR"),
  createEntry("Sunday", "Theory", "CSE 115.2", "N203", 690, 780, "SWAPNIL"),
  createEntry("Sunday", "Theory", "CSE 317.1", "N203", 810, 900, "FT"),
  createEntry("Sunday", "Theory", "MATH 101 (EEE)", "N203", 900, 990, "TRINA"),
  createEntry("Sunday", "Theory", "ENG 111 (EEE)", "N203", 990, 1080, "PRM"),
  
  // Room N204
  createEntry("Sunday", "Theory", "CSE 215.3", "N204", 570, 690, "ANJ"),
  createEntry("Sunday", "Theory", "CSE 225.3", "N204", 690, 780, "JUD"),
  createEntry("Sunday", "Theory", "CSE 221.3", "N204", 810, 900, "SAH"),
  
  // Room N601
  createEntry("Sunday", "Theory", "CSE 317.4", "N601", 600, 690, "FT"),
  createEntry("Sunday", "Theory", "MATH 301.4", "N601", 690, 780, "ANJ"),
  createEntry("Sunday", "Theory", "CSE 111.6", "N601", 810, 900, "ANB"),
  
  // Room N602
  createEntry("Sunday", "Theory", "CSE 459.1", "N602", 510, 600, "JNM"),
  createEntry("Sunday", "Theory", "CSE 463.1", "N602", 600, 690, "ARS"),
  createEntry("Sunday", "Theory", "CSE 321.6", "N602", 690, 780, "FARJANA"),
  createEntry("Sunday", "Theory", "EEE 451", "N602", 810, 900, "RUMKY"),
  
  // Room N603
  createEntry("Sunday", "Theory", "IPD 400.1", "N603", 510, 600, "FARIA"),
  createEntry("Sunday", "Theory", "CSE 435.1", "N603", 600, 690, "ANC"),
  createEntry("Sunday", "Theory", "ENG 111.3", "N603", 690, 780, "LAM"),
  createEntry("Sunday", "Theory", "CSE 321.7", "N603", 810, 900, "FARJANA"),
  createEntry("Sunday", "Theory", "AA 200.5", "N603", 900, 990, "AAF3"),
  createEntry("Sunday", "Theory", "AA 099.5", "N603", 990, 1080, "AAF1"),
  
  // Room N604
  createEntry("Sunday", "Theory", "IPD 400.2", "N604", 600, 690, "FARIA"),
  createEntry("Sunday", "Theory", "CSE 435.2", "N604", 690, 780, "ANC"),
  createEntry("Sunday", "Theory", "AA 099.3", "N604", 900, 990, "AAF1"),
  createEntry("Sunday", "Theory", "AA 150.3", "N604", 990, 1080, "AAF2"),
  
  // Room N605
  createEntry("Sunday", "Theory", "CSE 459.2", "N605", 600, 690, "JNM"),
  createEntry("Sunday", "Theory", "CSE 463.2", "N605", 690, 780, "ARS"),
  createEntry("Sunday", "Theory", "AA 099.2", "N605", 810, 900, "AAF1"),
  createEntry("Sunday", "Theory", "CSE 111.2", "N605", 900, 990, "SSD"),
  createEntry("Sunday", "Theory", "AA 200.2", "N605", 990, 1080, "AAF3"),
  
  // Room N606
  createEntry("Sunday", "Theory", "AA 200.8", "N606", 600, 690, "AAF6"),
  createEntry("Sunday", "Theory", "AA 099.8", "N606", 690, 780, "AAF4"),
  createEntry("Sunday", "Theory", "AA 150.1", "N606", 900, 990, "AAF2"),
  createEntry("Sunday", "Theory", "CSE 111.1", "N606", 990, 1080, "SSD"),
]

// =============================================
// SUNDAY LAB CLASSES
// =============================================
const sundayLab: ClassEntry[] = [
  // Room 102
  createEntry("Sunday", "Lab", "CSE 124.5", "102", 570, 690, "SOA"),
  createEntry("Sunday", "Lab", "CSE 212.8", "102", 690, 810, "TAS"),
  createEntry("Sunday", "Lab", "CSE 212.7", "102", 810, 930, "MRA"),
  createEntry("Sunday", "Lab", "CSE 212.3", "102", 930, 1050, "MRA"),
  
  // Room 104
  createEntry("Sunday", "Lab", "CSE 316.1", "104", 570, 690, "RHN"),
  createEntry("Sunday", "Lab", "CSE 316.4", "104", 690, 810, "SAK"),
  createEntry("Sunday", "Lab", "CSE 316.6", "104", 810, 930, "SAK"),
  
  // Room 105
  createEntry("Sunday", "Lab", "EEE 402.1", "105", 570, 690, "AAA"),
  createEntry("Sunday", "Lab", "EEE 214.5", "105", 690, 810, "JUNAYET"),
  createEntry("Sunday", "Lab", "EEE 104.2", "105", 810, 930, "BB"),
  createEntry("Sunday", "Lab", "EEE 104.1", "105", 930, 1050, "BB"),
  
  // Room 106
  createEntry("Sunday", "Lab", "EEE 214.6", "106", 570, 690, "JUNAYET"),
  createEntry("Sunday", "Lab", "CSE 224.1", "106", 690, 810, "SMI"),
  createEntry("Sunday", "Lab", "CSE 216.2", "106", 810, 930, "PH"),
  createEntry("Sunday", "Lab", "CSE 224.2", "106", 930, 1050, "SMI"),
  
  // Room 109
  createEntry("Sunday", "Lab", "EEE 112.5", "109", 690, 810, "TK"),
  createEntry("Sunday", "Lab", "EEE 112.3", "109", 810, 930, "ANJ"),
  createEntry("Sunday", "Lab", "EEE 112.7", "109", 930, 1050, "TK"),
  
  // Room 115
  createEntry("Sunday", "Lab", "CSE 320.1", "115", 570, 690, "JHJ"),
  createEntry("Sunday", "Lab", "CSE 124.6", "115", 690, 810, "SOA"),
  createEntry("Sunday", "Lab", "CSE 320.4", "115", 810, 930, "MHN"),
  createEntry("Sunday", "Lab", "CSE 226.2", "115", 930, 1050, "JUD"),
  
  // Room 313
  createEntry("Sunday", "Lab", "CSE 328.7", "313", 570, 690, "MHN"),
  createEntry("Sunday", "Lab", "ME 102.2", "313", 690, 810, "TBA"),
  createEntry("Sunday", "Lab", "CSE 104.1", "313", 810, 930, "MONALISA"),
  createEntry("Sunday", "Lab", "EEE 452.2", "313", 930, 1050, "RUMKY"),
  
  // Room N304
  createEntry("Sunday", "Lab", "CSE 322.6", "N304", 570, 690, "FARJANA"),
  createEntry("Sunday", "Lab", "CSE 326.3", "N304", 690, 810, "ARC"),
  createEntry("Sunday", "Lab", "CSE 312.5", "N304", 810, 930, "RHN"),
  createEntry("Sunday", "Lab", "CSE 326.7", "N304", 930, 1050, "ARC"),
  
  // Room N607
  createEntry("Sunday", "Lab", "CSE 104.2", "N607", 570, 690, "MONALISA"),
  createEntry("Sunday", "Lab", "EEE 452.1", "N607", 690, 810, "RUMKY"),
  createEntry("Sunday", "Lab", "CSE 436.2", "N607", 810, 930, "ANC"),
  createEntry("Sunday", "Lab", "CSE 112.6", "N607", 930, 1050, "ANB"),
]

// =============================================
// MONDAY THEORY CLASSES
// =============================================
const mondayTheory: ClassEntry[] = [
  // Room 103
  createEntry("Monday", "Theory", "CSE 123.3", "103", 510, 600, "JM"),
  createEntry("Monday", "Theory", "EEE 213.3", "103", 600, 690, "SKD"),
  createEntry("Monday", "Theory", "PHY 101.1", "103", 690, 780, "SHA"),
  createEntry("Monday", "Theory", "CSE 325.5", "103", 810, 900, "ABH"),
  createEntry("Monday", "Theory", "CSE 223.5", "103", 900, 990, "SHAMIM"),
  
  // Room 107
  createEntry("Monday", "Theory", "EEE 213.4", "107", 510, 600, "SKD"),
  createEntry("Monday", "Theory", "CSE 123.4", "107", 600, 690, "SOA"),
  createEntry("Monday", "Theory", "MATH 107.4", "107", 690, 780, "MSR"),
  createEntry("Monday", "Theory", "MATH 205.3", "107", 810, 900, "MC"),
  createEntry("Monday", "Theory", "EEE 213.2", "107", 900, 990, "KA"),
  createEntry("Monday", "Theory", "HUM 201.2", "107", 990, 1080, "ALFA"),
  
  // Room 108
  createEntry("Monday", "Theory", "CSE 319.2", "108", 510, 600, "JHJ"),
  createEntry("Monday", "Theory", "CSE 317.2", "108", 600, 690, "FT"),
  createEntry("Monday", "Theory", "CSE 123.5", "108", 690, 780, "SOA"),
  createEntry("Monday", "Theory", "CSE 439.1", "108", 810, 900, "GMD"),
  createEntry("Monday", "Theory", "MATH 205.1", "108", 900, 990, "MC"),
  createEntry("Monday", "Theory", "CSE 313.1", "108", 990, 1080, "Dr. IAZ"),
  
  // Room 110
  createEntry("Monday", "Theory", "MATH 207 (EEE)", "110", 510, 600, "MSR"),
  createEntry("Monday", "Theory", "EEE 203", "110", 600, 690, "BB"),
  createEntry("Monday", "Theory", "CSE 221.1", "110", 690, 780, "SAH"),
  createEntry("Monday", "Theory", "ENG 111 (EEE)", "110", 810, 900, "PRM"),
  createEntry("Monday", "Theory", "CHEM 201 (EEE)", "110", 900, 990, "Mustira"),
  createEntry("Monday", "Theory", "EEE 101", "110", 990, 1080, "Dr. MSA"),
  
  // Room 111
  createEntry("Monday", "Theory", "CSE 311.3", "111", 600, 690, "SAF"),
  createEntry("Monday", "Theory", "CSE 315.3", "111", 690, 780, "SAK"),
  createEntry("Monday", "Theory", "EEE 103", "111", 810, 900, "Dr. IAZ"),
  createEntry("Monday", "Theory", "MATH 301.1", "111", 900, 990, "TA"),
  createEntry("Monday", "Theory", "HUM 301.1", "111", 990, 1080, "NUSRAT"),
  
  // Room 114
  createEntry("Monday", "Theory", "CSE 301.1", "114", 510, 600, "ARS"),
  createEntry("Monday", "Theory", "CSE 321.1", "114", 600, 690, "TJ"),
  createEntry("Monday", "Theory", "CSE 411.1", "114", 690, 780, "SAB"),
  createEntry("Monday", "Theory", "CSE 115.7", "114", 810, 900, "ANB"),
  createEntry("Monday", "Theory", "EEE 213.7", "114", 900, 990, "JUNAYET"),
  createEntry("Monday", "Theory", "HUM 201.7", "114", 990, 1080, "TBA"),
  
  // Room 311
  createEntry("Monday", "Theory", "CSE 443.1", "311", 690, 780, "ASHRAF"),
  createEntry("Monday", "Theory", "EEE 111.2", "311", 810, 900, "Dr. MK"),
  createEntry("Monday", "Theory", "CSE 313.2", "311", 900, 990, "Dr. IAZ"),
  createEntry("Monday", "Theory", "MATH 205.2", "311", 990, 1080, "MC"),
  
  // Room 312
  createEntry("Monday", "Theory", "HUM 303 (EEE)", "312", 600, 690, "JAVED"),
  createEntry("Monday", "Theory", "EEE 401.1", "312", 690, 780, "AAA"),
  createEntry("Monday", "Theory", "CSE 211.1", "312", 810, 900, "MRA"),
  createEntry("Monday", "Theory", "EEE 111.1", "312", 900, 990, "Dr. MK"),
  createEntry("Monday", "Theory", "CHEM 201.1", "312", 990, 1080, "Mustira"),
  
  // Room N201
  createEntry("Monday", "Theory", "CSE 211.2", "N201", 690, 780, "MRA"),
  createEntry("Monday", "Theory", "CSE 211.6", "N201", 810, 900, "TAS"),
  createEntry("Monday", "Theory", "MATH 207.6", "N201", 900, 990, "SWAPNIL"),
  
  // Room N202
  createEntry("Monday", "Theory", "MATH 207.3", "N202", 600, 690, "TRINA"),
  createEntry("Monday", "Theory", "CHEM 201.3", "N202", 690, 780, "TULY"),
  createEntry("Monday", "Theory", "EEE 213.5", "N202", 810, 900, "JUNAYET"),
  createEntry("Monday", "Theory", "CSE 115.5", "N202", 900, 990, "ANB"),
  
  // Room N203
  createEntry("Monday", "Theory", "CSE 459.3", "N203", 510, 600, "JNM"),
  createEntry("Monday", "Theory", "CSE 463.3", "N203", 600, 690, "ARS"),
  createEntry("Monday", "Theory", "CSE 301.6", "N203", 690, 780, "TRINA"),
  createEntry("Monday", "Theory", "CSE 327.5", "N203", 810, 900, "MHN"),
  createEntry("Monday", "Theory", "CSE 411.5", "N203", 900, 990, "ASHRAF"),
  
  // Room N204
  createEntry("Monday", "Theory", "CSE 411.7", "N204", 690, 780, "Mehraj"),
  createEntry("Monday", "Theory", "EEE 213.1", "N204", 810, 900, "KA"),
  createEntry("Monday", "Theory", "HUM 201.1", "N204", 900, 990, "ALFA"),
  createEntry("Monday", "Theory", "CSE 115.1", "N204", 990, 1080, "SWAPNIL"),
  
  // Room N601
  createEntry("Monday", "Theory", "ME 101 (EEE)", "N601", 690, 780, "TBA"),
  
  // Room N602
  createEntry("Monday", "Theory", "CSE 223.6", "N602", 510, 600, "SHAMIM"),
  createEntry("Monday", "Theory", "MATH 203.6", "N602", 600, 690, "SAMIHA"),
  createEntry("Monday", "Theory", "EEE 217", "N602", 690, 780, "IMTIAZ"),
  createEntry("Monday", "Theory", "HUM 301.3", "N602", 810, 900, "NUSRAT"),
  createEntry("Monday", "Theory", "CSE 327.3", "N602", 900, 990, "UDD"),
  createEntry("Monday", "Theory", "CSE 301.3", "N602", 990, 1080, "YEASIN"),
  
  // Room N603
  createEntry("Monday", "Theory", "MATH 301.3", "N603", 690, 780, "ANJ"),
  createEntry("Monday", "Theory", "IPD 400.3", "N603", 810, 900, "FARIA"),
  createEntry("Monday", "Theory", "HUM 203.2", "N603", 900, 990, "NUSRAT"),
  createEntry("Monday", "Theory", "CSE 435.3", "N603", 990, 1080, "ANC"),
  
  // Room N604
  createEntry("Monday", "Theory", "AA 150.6", "N604", 510, 600, "AAF2"),
  createEntry("Monday", "Theory", "AA 200.6", "N604", 600, 690, "AAF3"),
  createEntry("Monday", "Theory", "AA 099.6", "N604", 690, 780, "AAF1"),
  createEntry("Monday", "Theory", "CSE 411.4", "N604", 810, 900, "Mehraj"),
  createEntry("Monday", "Theory", "CSE 301.4", "N604", 900, 990, "YEASIN"),
  createEntry("Monday", "Theory", "IPD 400.4", "N604", 990, 1080, "FARIA"),
  
  // Room N605
  createEntry("Monday", "Theory", "AA 099.4", "N605", 510, 600, "AAF1"),
  createEntry("Monday", "Theory", "AA 150.4", "N605", 600, 690, "AAF2"),
  createEntry("Monday", "Theory", "AA 200.4", "N605", 690, 780, "AAF3"),
  createEntry("Monday", "Theory", "EEE 303", "N605", 810, 900, "IMTIAZ"),
  createEntry("Monday", "Theory", "IPD 400 (EEE)", "N605", 900, 990, "FARIA"),
  createEntry("Monday", "Theory", "EEE 453", "N605", 990, 1080, "SMI"),
  
  // Room N606
  createEntry("Monday", "Theory", "AA 200.1", "N606", 510, 600, "AAF3"),
  createEntry("Monday", "Theory", "AA 099.1", "N606", 600, 690, "AAF1"),
  createEntry("Monday", "Theory", "CSE 111.3", "N606", 690, 780, "SSD"),
  createEntry("Monday", "Theory", "CSE 223.4", "N606", 810, 900, "RUMKY"),
  createEntry("Monday", "Theory", "CSE 223.3", "N606", 900, 990, "RUMKY"),
  createEntry("Monday", "Theory", "MATH 203.3", "N606", 990, 1080, "SAMIHA"),
]

// =============================================
// MONDAY LAB CLASSES (Slightly different times)
// =============================================
const mondayLab: ClassEntry[] = [
  // Room 102
  createEntry("Monday", "Lab", "ENG 112.5", "102", 540, 660, "PRM"),
  createEntry("Monday", "Lab", "CSE 222.5", "102", 660, 780, "TAS"),
  createEntry("Monday", "Lab", "CSE 114.5", "102", 780, 900, "TULY"),
  createEntry("Monday", "Lab", "CSE 226.1", "102", 930, 1050, "JUD"),
  
  // Room 104
  createEntry("Monday", "Lab", "CSE 316.5", "104", 780, 900, "SAK"),
  
  // Room 105
  createEntry("Monday", "Lab", "EEE 218", "105", 540, 660, "IMTIAZ"),
  createEntry("Monday", "Lab", "CSE 224.8", "105", 660, 780, "RUMKY"),
  createEntry("Monday", "Lab", "CSE 216.1", "105", 780, 900, "PH"),
  
  // Room 106
  createEntry("Monday", "Lab", "CSE 224.5", "106", 660, 780, "SHAMIM"),
  
  // Room 109
  createEntry("Monday", "Lab", "PHY 102.4", "109", 540, 660, "ABR"),
  createEntry("Monday", "Lab", "EEE 112.6", "109", 660, 780, "TK"),
  createEntry("Monday", "Lab", "PHY 102.1", "109", 780, 900, "SHA"),
  createEntry("Monday", "Lab", "PHY 102.5", "109", 930, 1050, "SHA"),
  
  // Room 115
  createEntry("Monday", "Lab", "CSE 328.6", "115", 540, 660, "MHN"),
  createEntry("Monday", "Lab", "ENG 112.2", "115", 660, 780, "PRM"),
  createEntry("Monday", "Lab", "CSE 226.4", "115", 780, 900, "JUD"),
  createEntry("Monday", "Lab", "CSE 222.4", "115", 930, 1050, "SAH"),
  
  // Room 313
  createEntry("Monday", "Lab", "CSE 328.10", "313", 540, 660, "SAB"),
  createEntry("Monday", "Lab", "CSE 328.5", "313", 660, 780, "MHN"),
  createEntry("Monday", "Lab", "CSE 222.2", "313", 780, 900, "SAH"),
  createEntry("Monday", "Lab", "CSE 114.1", "313", 930, 1050, "TAZ"),
  
  // Room N304
  createEntry("Monday", "Lab", "CSE 322.7", "N304", 540, 660, "FARJANA"),
  createEntry("Monday", "Lab", "CSE 328.9", "N304", 660, 780, "UDD"),
  createEntry("Monday", "Lab", "CSE 328.3", "N304", 780, 900, "UDD"),
  createEntry("Monday", "Lab", "CSE 326.4", "N304", 930, 1050, "ABH"),
  
  // Room N607
  createEntry("Monday", "Lab", "CSE 112.3", "N607", 540, 660, "SSD"),
  createEntry("Monday", "Lab", "CSE 322.4", "N607", 660, 780, "JNM"),
  createEntry("Monday", "Lab", "CSE 322.10", "N607", 780, 900, "SAMIHA"),
]

// Continue with more days...
// Exporting all classes combined
export const ALL_CLASSES: ClassEntry[] = [
  ...saturdayTheory,
  ...saturdayLab,
  ...sundayTheory,
  ...sundayLab,
  ...mondayTheory,
  ...mondayLab,
]

// Will add remaining days in the next part
