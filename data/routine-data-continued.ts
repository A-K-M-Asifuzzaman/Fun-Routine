// Remaining days: Tuesday, Wednesday, Thursday
// Continuation of routine-data.ts

import type { ClassEntry, Day, ClassType } from "@/types"
import { getInstructorFullName } from "./instructors"

// Helper functions (same as in routine-data.ts)
function generateId(day: string, course: string, room: string, startMinutes: number): string {
  return `${day}-${course}-${room}-${startMinutes}`.replace(/\s+/g, "-").toLowerCase()
}

function parseCourse(course: string): { courseCode: string; section: number } {
  const match = course.match(/^(.+?)\.(\d+)$/)
  if (match) {
    return { courseCode: match[1], section: parseInt(match[2]) }
  }
  return { courseCode: course, section: 0 }
}

function getSemester(courseCode: string): number {
  const code = courseCode.toUpperCase()
  if (code.startsWith("AA") || (code.startsWith("CSE 111") || code.startsWith("CSE 112"))) return 1
  if (code.startsWith("PHY 101") || code.startsWith("PHY 102") || code.startsWith("CSE 113") || code.startsWith("CSE 114") || code.startsWith("MATH 107") || code.startsWith("ENG 111")) return 2
  if (code.startsWith("EEE 111") || code.startsWith("EEE 112") || code.startsWith("CSE 211") || code.startsWith("CSE 212") || code.startsWith("MATH 207") || code.startsWith("CHEM 201")) return 3
  if (code.startsWith("EEE 213") || code.startsWith("EEE 214") || code.startsWith("CSE 123") || code.startsWith("CSE 124") || code.startsWith("CSE 115") || code.startsWith("HUM 201")) return 4
  if (code.startsWith("CSE 215") || code.startsWith("CSE 216") || code.startsWith("CSE 221") || code.startsWith("CSE 222") || code.startsWith("CSE 225") || code.startsWith("CSE 226") || code.startsWith("ENG 112")) return 5
  if (code.startsWith("CSE 311") || code.startsWith("CSE 312") || code.startsWith("CSE 313") || code.startsWith("CSE 315") || code.startsWith("CSE 316") || code.startsWith("MATH 205")) return 6
  if (code.startsWith("CSE 223") || code.startsWith("CSE 224") || code.startsWith("CSE 325") || code.startsWith("CSE 326") || code.startsWith("ME 102") || code.startsWith("MATH 203")) return 7
  if (code.startsWith("CSE 319") || code.startsWith("CSE 320") || code.startsWith("CSE 317") || code.startsWith("MATH 301") || code.startsWith("HUM 301")) return 8
  if (code.startsWith("CSE 321") || code.startsWith("CSE 322") || code.startsWith("CSE 327") || code.startsWith("CSE 328") || code.startsWith("CSE 411") || code.startsWith("CSE 301")) return 9
  if (code.startsWith("CSE 443") || code.startsWith("CSE 463") || code.startsWith("CSE 439") || code.startsWith("CSE 459")) return 10
  if (code.startsWith("CSE 435") || code.startsWith("CSE 436") || code.startsWith("IPD 400") || code.startsWith("HUM 203")) return 11
  return 0
}

function createEntry(day: Day, type: ClassType, course: string, room: string, startMinutes: number, endMinutes: number, instructorShort: string): ClassEntry {
  const { courseCode, section } = parseCourse(course)
  const hours = Math.floor(startMinutes / 60)
  const mins = startMinutes % 60
  const startDisplay = `${hours % 12 || 12}:${mins.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`
  const endHours = Math.floor(endMinutes / 60)
  const endMins = endMinutes % 60
  const endDisplay = `${endHours % 12 || 12}:${endMins.toString().padStart(2, "0")} ${endHours >= 12 ? "PM" : "AM"}`
  
  return {
    id: generateId(day, course, room, startMinutes),
    day, type, course, courseCode, section, room,
    startMinutes, endMinutes, startTimeDisplay: startDisplay, endTimeDisplay: endDisplay,
    instructorShort, instructorFull: getInstructorFullName(instructorShort),
    semester: getSemester(courseCode),
  }
}

// =============================================
// TUESDAY THEORY CLASSES
// =============================================
export const tuesdayTheory: ClassEntry[] = [
  // Room 103
  createEntry("Tuesday", "Theory", "EEE 111.5", "103", 600, 690, "TK"),
  createEntry("Tuesday", "Theory", "CHEM 201.5", "103", 690, 780, "TULY"),
  createEntry("Tuesday", "Theory", "PHY 101.2", "103", 810, 900, "SHA"),
  createEntry("Tuesday", "Theory", "HUM 301.2", "103", 900, 990, "NUSRAT"),
  createEntry("Tuesday", "Theory", "MATH 301.2", "103", 990, 1080, "TA"),
  
  // Room 107
  createEntry("Tuesday", "Theory", "CSE 123.6", "107", 510, 600, "SOA"),
  createEntry("Tuesday", "Theory", "EEE 213.6", "107", 600, 690, "JUNAYET"),
  createEntry("Tuesday", "Theory", "CSE 311.2", "107", 690, 780, "SAF"),
  createEntry("Tuesday", "Theory", "CSE 113.3", "107", 810, 900, "TAZ"),
  createEntry("Tuesday", "Theory", "CSE 301.7", "107", 900, 990, "TRINA"),
  createEntry("Tuesday", "Theory", "CSE 327.7", "107", 990, 1080, "MHN"),
  
  // Room 108
  createEntry("Tuesday", "Theory", "EEE 213.7", "108", 510, 600, "JUNAYET"),
  createEntry("Tuesday", "Theory", "CSE 123.7", "108", 600, 690, "SOA"),
  createEntry("Tuesday", "Theory", "EEE 301", "108", 690, 780, "TK"),
  createEntry("Tuesday", "Theory", "CSE 313.1", "108", 810, 900, "Dr. IAZ"),
  createEntry("Tuesday", "Theory", "MATH 205.1", "108", 900, 990, "MC"),
  
  // Room 110
  createEntry("Tuesday", "Theory", "CSE 225.1", "110", 600, 690, "JUD"),
  createEntry("Tuesday", "Theory", "CSE 221.1", "110", 690, 780, "SAH"),
  createEntry("Tuesday", "Theory", "CSE 215.1", "110", 810, 930, "PH"),
  createEntry("Tuesday", "Theory", "EEE 207", "110", 930, 1020, "BB"),
  
  // Room 111
  createEntry("Tuesday", "Theory", "CSE 225.2", "111", 510, 600, "JUD"),
  createEntry("Tuesday", "Theory", "CSE 221.2", "111", 600, 690, "SAH"),
  createEntry("Tuesday", "Theory", "CSE 215.2", "111", 690, 810, "PH"),
  createEntry("Tuesday", "Theory", "CSE 221.3", "111", 810, 900, "SAH"),
  createEntry("Tuesday", "Theory", "CSE 439.1", "111", 900, 990, "GMD"),
  createEntry("Tuesday", "Theory", "CSE 443.1", "111", 990, 1080, "ASHRAF"),
  
  // Room 114
  createEntry("Tuesday", "Theory", "EEE 403", "114", 690, 780, "SAK"),
  createEntry("Tuesday", "Theory", "CSE 223.2", "114", 810, 900, "SMI"),
  createEntry("Tuesday", "Theory", "CSE 443.2", "114", 900, 990, "ASHRAF"),
  createEntry("Tuesday", "Theory", "CSE 439.2", "114", 990, 1080, "GMD"),
  
  // Room 311
  createEntry("Tuesday", "Theory", "EEE 401.2", "311", 600, 690, "AAA"),
  createEntry("Tuesday", "Theory", "EEE 409", "311", 690, 780, "SHAMIM"),
  createEntry("Tuesday", "Theory", "CSE 321.3", "311", 810, 900, "TJ"),
  createEntry("Tuesday", "Theory", "EEE 407", "311", 900, 990, "SMI"),
  createEntry("Tuesday", "Theory", "HUM 303 (EEE)", "311", 990, 1080, "JAVED"),
  
  // Room 312
  createEntry("Tuesday", "Theory", "AA 200.1 (EEE)", "312", 510, 600, "AAF6"),
  createEntry("Tuesday", "Theory", "PHY 101.1 (EEE)", "312", 600, 690, "SHA"),
  createEntry("Tuesday", "Theory", "EEE 111.2", "312", 690, 780, "Dr. MK"),
  createEntry("Tuesday", "Theory", "EEE 111.3", "312", 810, 900, "Dr. MK"),
  createEntry("Tuesday", "Theory", "EEE 103", "312", 900, 990, "Dr. IAZ"),
  createEntry("Tuesday", "Theory", "MATH 103 (EEE)", "312", 990, 1080, "MC"),
  
  // Room N201
  createEntry("Tuesday", "Theory", "ENG 111.3", "N201", 600, 690, "LAM"),
  createEntry("Tuesday", "Theory", "PHY 101.3", "N201", 690, 780, "ABR"),
  createEntry("Tuesday", "Theory", "MATH 207.2", "N201", 810, 900, "TRINA"),
  createEntry("Tuesday", "Theory", "CHEM 201.2", "N201", 900, 990, "TULY"),
  
  // Room N202
  createEntry("Tuesday", "Theory", "CSE 211.3", "N202", 600, 690, "MRA"),
  createEntry("Tuesday", "Theory", "MATH 207.3", "N202", 690, 780, "TRINA"),
  createEntry("Tuesday", "Theory", "CSE 315.2", "N202", 810, 900, "RHN"),
  
  // Room N203
  createEntry("Tuesday", "Theory", "CSE 317.4", "N203", 510, 600, "FT"),
  createEntry("Tuesday", "Theory", "CSE 319.4", "N203", 600, 690, "JHJ"),
  createEntry("Tuesday", "Theory", "CSE 211.6", "N203", 690, 780, "TAS"),
  createEntry("Tuesday", "Theory", "CHEM 201.6", "N203", 810, 900, "TULY"),
  createEntry("Tuesday", "Theory", "CSE 215.3", "N203", 930, 1050, "ANJ"),
  
  // Room N204
  createEntry("Tuesday", "Theory", "AA 150.2 (EEE)", "N204", 510, 600, "AAF5"),
  createEntry("Tuesday", "Theory", "PHY 101.2 (EEE)", "N204", 600, 690, "ABR"),
  createEntry("Tuesday", "Theory", "CSE 315.1", "N204", 690, 780, "RHN"),
  createEntry("Tuesday", "Theory", "CSE 325.1", "N204", 810, 900, "ARC"),
  createEntry("Tuesday", "Theory", "MATH 203.1", "N204", 900, 990, "YEASIN"),
  
  // Room N601
  createEntry("Tuesday", "Theory", "CSE 325.4", "N601", 690, 780, "ABH"),
  createEntry("Tuesday", "Theory", "MATH 203.4", "N601", 810, 900, "SAMIHA"),
  createEntry("Tuesday", "Theory", "CSE 223.4", "N601", 900, 990, "RUMKY"),
  
  // Room N602
  createEntry("Tuesday", "Theory", "IPD 400.3", "N602", 510, 600, "FARIA"),
  createEntry("Tuesday", "Theory", "MATH 205.6", "N602", 600, 690, "MONALISA"),
  createEntry("Tuesday", "Theory", "MATH 205.5", "N602", 690, 780, "MONALISA"),
  createEntry("Tuesday", "Theory", "CSE 301.4", "N602", 810, 900, "YEASIN"),
  
  // Room N603
  createEntry("Tuesday", "Theory", "CSE 319.3", "N603", 510, 600, "JHJ"),
  createEntry("Tuesday", "Theory", "CSE 317.3", "N603", 600, 690, "FT"),
  createEntry("Tuesday", "Theory", "CSE 435.4", "N603", 690, 780, "AN"),
  createEntry("Tuesday", "Theory", "CSE 321.5", "N603", 810, 900, "JNM"),
  
  // Room N604
  createEntry("Tuesday", "Theory", "CSE 111.10", "N604", 510, 600, "MONALISA"),
  createEntry("Tuesday", "Theory", "AA 150.10", "N604", 600, 690, "AAF5"),
  createEntry("Tuesday", "Theory", "ENG 111.2", "N604", 690, 780, "LAM"),
  createEntry("Tuesday", "Theory", "CSE 111.5", "N604", 810, 900, "ANB"),
  createEntry("Tuesday", "Theory", "AA 150.4", "N604", 900, 990, "AAF2"),
  createEntry("Tuesday", "Theory", "AA 099.4", "N604", 990, 1080, "AAF1"),
  
  // Room N605
  createEntry("Tuesday", "Theory", "AA 200.9", "N605", 600, 690, "AAF6"),
  createEntry("Tuesday", "Theory", "AA 150.9", "N605", 690, 780, "AAF5"),
  createEntry("Tuesday", "Theory", "AA 150.3", "N605", 810, 900, "AAF2"),
  createEntry("Tuesday", "Theory", "AA 099.3", "N605", 900, 990, "AAF1"),
  createEntry("Tuesday", "Theory", "AA 200.3", "N605", 990, 1080, "AAF3"),
  
  // Room N606
  createEntry("Tuesday", "Theory", "AA 099.7", "N606", 510, 600, "AAF4"),
  createEntry("Tuesday", "Theory", "CSE 111.7", "N606", 600, 690, "ABH"),
  createEntry("Tuesday", "Theory", "CSE 325.2", "N606", 690, 780, "ARC"),
  createEntry("Tuesday", "Theory", "HUM 203.1", "N606", 810, 900, "NUSRAT"),
  createEntry("Tuesday", "Theory", "AA 200.2", "N606", 900, 990, "AAF3"),
  createEntry("Tuesday", "Theory", "AA 150.2", "N606", 990, 1080, "AAF2"),
]

// =============================================
// TUESDAY LAB CLASSES
// =============================================
export const tuesdayLab: ClassEntry[] = [
  createEntry("Tuesday", "Lab", "EEE 204.1", "101", 690, 810, "AAA"),
  createEntry("Tuesday", "Lab", "EEE 208", "101", 810, 930, "BB"),
  
  createEntry("Tuesday", "Lab", "CSE 312.2", "102", 570, 690, "SAF"),
  createEntry("Tuesday", "Lab", "CSE 124.4", "102", 690, 810, "SOA"),
  createEntry("Tuesday", "Lab", "CSE 124.2", "102", 810, 930, "JM"),
  createEntry("Tuesday", "Lab", "CSE 124.8", "102", 930, 1050, "JM"),
  
  createEntry("Tuesday", "Lab", "CE 101.1 (EEE)", "104", 570, 690, "SAK"),
  
  createEntry("Tuesday", "Lab", "EEE 206.2", "105", 690, 810, "KA"),
  createEntry("Tuesday", "Lab", "EEE 404", "105", 810, 930, "SAK"),
  
  createEntry("Tuesday", "Lab", "EEE 214.4", "106", 570, 690, "SKD"),
  createEntry("Tuesday", "Lab", "EEE 214.7", "106", 690, 810, "JUNAYET"),
  createEntry("Tuesday", "Lab", "EEE 214.8", "106", 810, 930, "KA"),
  createEntry("Tuesday", "Lab", "EEE 214.2", "106", 930, 1050, "KA"),
  
  createEntry("Tuesday", "Lab", "PHY 102.1 (EEE)", "109", 690, 810, "SHA"),
  
  createEntry("Tuesday", "Lab", "CSE 322.8", "115", 570, 690, "JNM"),
  createEntry("Tuesday", "Lab", "CSE 328.8", "115", 690, 810, "UDD"),
  createEntry("Tuesday", "Lab", "CE 101.2 (EEE)", "115", 810, 930, "ABR"),
  createEntry("Tuesday", "Lab", "CSE 328.4", "115", 930, 1050, "SAB"),
  
  createEntry("Tuesday", "Lab", "CSE 328.1", "313", 570, 690, "UDD"),
  createEntry("Tuesday", "Lab", "CSE 322.1", "313", 690, 810, "TJ"),
  createEntry("Tuesday", "Lab", "EEE 410.1", "313", 810, 930, "SHAMIM"),
  createEntry("Tuesday", "Lab", "CSE 322.3", "313", 930, 1050, "TJ"),
  
  createEntry("Tuesday", "Lab", "CSE 436.1", "N304", 570, 690, "ANC"),
  createEntry("Tuesday", "Lab", "CSE 320.3", "N304", 690, 810, "JHJ"),
  createEntry("Tuesday", "Lab", "CSE 212.5", "N304", 810, 930, "TAS"),
  createEntry("Tuesday", "Lab", "CSE 322.9", "N304", 930, 1050, "SAMIHA"),
  
  createEntry("Tuesday", "Lab", "CSE 326.2", "N607", 570, 690, "ARC"),
  createEntry("Tuesday", "Lab", "CSE 322.5", "N607", 690, 810, "JNM"),
  createEntry("Tuesday", "Lab", "CSE 436.4", "N607", 810, 930, "ANC"),
  createEntry("Tuesday", "Lab", "CSE 112.5", "N607", 930, 1050, "ANB"),
]

// =============================================
// WEDNESDAY THEORY CLASSES
// =============================================
export const wednesdayTheory: ClassEntry[] = [
  // Room 103
  createEntry("Wednesday", "Theory", "AA 200.1 (EEE)", "103", 510, 600, "AAF6"),
  createEntry("Wednesday", "Theory", "PHY 101.1 (EEE)", "103", 600, 690, "SHA"),
  createEntry("Wednesday", "Theory", "EEE 409", "103", 690, 780, "SHAMIM"),
  createEntry("Wednesday", "Theory", "CSE 113.1", "103", 810, 900, "TAZ"),
  createEntry("Wednesday", "Theory", "MATH 107.1", "103", 900, 990, "MSR"),
  
  // Room 107
  createEntry("Wednesday", "Theory", "CSE 315.4", "107", 600, 690, "SAK"),
  createEntry("Wednesday", "Theory", "CSE 311.4", "107", 690, 780, "RHN"),
  createEntry("Wednesday", "Theory", "CSE 123.7", "107", 810, 900, "SOA"),
  createEntry("Wednesday", "Theory", "CHEM 201.4", "107", 900, 990, "TULY"),
  createEntry("Wednesday", "Theory", "EEE 111.4", "107", 990, 1080, "Dr. MSA"),
  
  // Room 108
  createEntry("Wednesday", "Theory", "AA 099.2 (EEE)", "108", 510, 600, "AAF4"),
  createEntry("Wednesday", "Theory", "AA 200.2 (EEE)", "108", 600, 690, "AAF6"),
  createEntry("Wednesday", "Theory", "CSE 223.1", "108", 690, 780, "SMI"),
  createEntry("Wednesday", "Theory", "CSE 215.2", "108", 780, 900, "PH"),
  createEntry("Wednesday", "Theory", "CSE 221.2", "108", 900, 990, "SAH"),
  createEntry("Wednesday", "Theory", "CSE 225.2", "108", 990, 1080, "JUD"),
  
  // Room 110
  createEntry("Wednesday", "Theory", "CSE 327.1", "110", 600, 690, "UDD"),
  createEntry("Wednesday", "Theory", "CSE 411.1", "110", 690, 780, "SAB"),
  createEntry("Wednesday", "Theory", "CSE 313.2", "110", 810, 900, "Dr. IAZ"),
  createEntry("Wednesday", "Theory", "MATH 205.3", "110", 900, 990, "MC"),
  createEntry("Wednesday", "Theory", "CSE 313.3", "110", 990, 1080, "IMTIAZ"),
  
  // Room 111
  createEntry("Wednesday", "Theory", "CSE 327.3", "111", 510, 600, "UDD"),
  createEntry("Wednesday", "Theory", "CSE 411.3", "111", 600, 690, "SAB"),
  createEntry("Wednesday", "Theory", "CSE 321.3", "111", 690, 780, "TJ"),
  createEntry("Wednesday", "Theory", "MATH 205.4", "111", 810, 900, "MC"),
  
  // Room 114
  createEntry("Wednesday", "Theory", "EEE 205", "114", 600, 690, "KA"),
  createEntry("Wednesday", "Theory", "EEE 203", "114", 690, 780, "BB"),
  createEntry("Wednesday", "Theory", "CSE 327.6", "114", 810, 900, "MHN"),
  createEntry("Wednesday", "Theory", "HUM 301.1", "114", 900, 990, "NUSRAT"),
  createEntry("Wednesday", "Theory", "MATH 301.1", "114", 990, 1080, "TA"),
  
  // Room 311
  createEntry("Wednesday", "Theory", "EEE 471", "311", 600, 690, "JUNAYET"),
  createEntry("Wednesday", "Theory", "EEE 403", "311", 690, 780, "SAK"),
  createEntry("Wednesday", "Theory", "EEE 407", "311", 810, 900, "SMI"),
  createEntry("Wednesday", "Theory", "CSE 463.2", "311", 900, 990, "ARS"),
  createEntry("Wednesday", "Theory", "CSE 439.2", "311", 990, 1080, "GMD"),
  
  // Room 312
  createEntry("Wednesday", "Theory", "CSE 111.4", "312", 510, 600, "SSD"),
  createEntry("Wednesday", "Theory", "AA 200.4", "312", 600, 690, "AAF3"),
  createEntry("Wednesday", "Theory", "EEE 111.3", "312", 690, 780, "Dr. MK"),
  createEntry("Wednesday", "Theory", "EEE 111.1", "312", 810, 900, "Dr. MK"),
  createEntry("Wednesday", "Theory", "PHY 101.3", "312", 900, 990, "ABR"),
  createEntry("Wednesday", "Theory", "MATH 107.3", "312", 990, 1080, "MSR"),
  
  // Room N201
  createEntry("Wednesday", "Theory", "CSE 319.3", "N201", 510, 600, "JHJ"),
  createEntry("Wednesday", "Theory", "CSE 317.3", "N201", 600, 690, "FT"),
  createEntry("Wednesday", "Theory", "CSE 311.1", "N201", 690, 780, "SAF"),
  createEntry("Wednesday", "Theory", "CSE 211.3", "N201", 810, 900, "MRA"),
  createEntry("Wednesday", "Theory", "MATH 203.3", "N201", 900, 990, "SAMIHA"),
  createEntry("Wednesday", "Theory", "CSE 325.3", "N201", 990, 1080, "ARC"),
  
  // Room N202
  createEntry("Wednesday", "Theory", "MATH 207.1", "N202", 600, 690, "TRINA"),
  createEntry("Wednesday", "Theory", "CSE 211.1", "N202", 690, 780, "MRA"),
  createEntry("Wednesday", "Theory", "CSE 325.2", "N202", 810, 900, "ARC"),
  createEntry("Wednesday", "Theory", "CSE 223.2", "N202", 900, 990, "SMI"),
  createEntry("Wednesday", "Theory", "MATH 203.2", "N202", 990, 1080, "SAMIHA"),
  
  // Room N203
  createEntry("Wednesday", "Theory", "CSE 319.4", "N203", 600, 690, "JHJ"),
  createEntry("Wednesday", "Theory", "HUM 301.4", "N203", 690, 780, "NUSRAT"),
  createEntry("Wednesday", "Theory", "CSE 301.1", "N203", 810, 900, "ARS"),
  
  // Room N204
  createEntry("Wednesday", "Theory", "CSE 113.4", "N204", 510, 600, "FT"),
  createEntry("Wednesday", "Theory", "ENG 111.4", "N204", 600, 690, "LAM"),
  createEntry("Wednesday", "Theory", "MATH 205.2", "N204", 690, 780, "MC"),
  createEntry("Wednesday", "Theory", "CSE 315.1", "N204", 810, 900, "RHN"),
  
  // Room N601
  createEntry("Wednesday", "Theory", "CSE 321.6", "N601", 600, 690, "FARJANA"),
  createEntry("Wednesday", "Theory", "CSE 411.6", "N601", 690, 780, "ASHRAF"),
  createEntry("Wednesday", "Theory", "HUM 203.1", "N601", 810, 900, "NUSRAT"),
  createEntry("Wednesday", "Theory", "MATH 205.5", "N601", 900, 990, "MONALISA"),
  
  // Room N602
  createEntry("Wednesday", "Theory", "CSE 435.3", "N602", 600, 690, "ANC"),
  createEntry("Wednesday", "Theory", "MATH 101 (EEE)", "N602", 690, 780, "TRINA"),
  createEntry("Wednesday", "Theory", "CSE 435.4", "N602", 810, 900, "ANC"),
  createEntry("Wednesday", "Theory", "IPD 400.4", "N602", 900, 990, "FARIA"),
  
  // Room N603
  createEntry("Wednesday", "Theory", "AA 150.10", "N603", 510, 600, "AAF5"),
  createEntry("Wednesday", "Theory", "AA 099.10", "N603", 600, 690, "AAF4"),
  createEntry("Wednesday", "Theory", "ENG 111.1", "N603", 690, 780, "LAM"),
  createEntry("Wednesday", "Theory", "EEE 451", "N603", 810, 900, "RUMKY"),
  
  // Room N604
  createEntry("Wednesday", "Theory", "CSE 411.5", "N604", 600, 690, "ASHRAF"),
  createEntry("Wednesday", "Theory", "CSE 301.5", "N604", 690, 780, "YEASIN"),
  createEntry("Wednesday", "Theory", "MATH 203.1", "N604", 810, 900, "YEASIN"),
  createEntry("Wednesday", "Theory", "CSE 325.1", "N604", 900, 990, "ARC"),
  
  // Room N605
  createEntry("Wednesday", "Theory", "AA 150.7", "N605", 600, 690, "AAF5"),
  createEntry("Wednesday", "Theory", "CSE 111.7", "N605", 690, 780, "ABH"),
  createEntry("Wednesday", "Theory", "MATH 207.5", "N605", 810, 900, "SWAPNIL"),
  createEntry("Wednesday", "Theory", "CSE 211.5", "N605", 900, 990, "TAS"),
  
  // Room N606
  createEntry("Wednesday", "Theory", "AA 200.3", "N606", 510, 600, "AAF3"),
  createEntry("Wednesday", "Theory", "CSE 111.3", "N606", 600, 690, "SSD"),
  createEntry("Wednesday", "Theory", "CSE 111.8", "N606", 690, 780, "FARJANA"),
  createEntry("Wednesday", "Theory", "MATH 207.2", "N606", 810, 900, "TRINA"),
  createEntry("Wednesday", "Theory", "CSE 211.2", "N606", 900, 990, "MRA"),
  createEntry("Wednesday", "Theory", "CHEM 201.2", "N606", 990, 1080, "TULY"),
]

// =============================================
// WEDNESDAY LAB CLASSES
// =============================================
export const wednesdayLab: ClassEntry[] = [
  createEntry("Wednesday", "Lab", "EEE 204.2", "101", 810, 930, "AAA"),
  
  createEntry("Wednesday", "Lab", "CSE 124.9", "102", 570, 690, "JM"),
  createEntry("Wednesday", "Lab", "CSE 124.3", "102", 690, 810, "JM"),
  createEntry("Wednesday", "Lab", "CSE 124.1", "102", 810, 930, "JM"),
  createEntry("Wednesday", "Lab", "ENG 112 (EEE)", "102", 930, 1050, "PRM"),
  
  createEntry("Wednesday", "Lab", "CSE 326.8", "104", 690, 810, "ARC"),
  createEntry("Wednesday", "Lab", "CSE 316.3", "104", 780, 900, "SAK"),
  createEntry("Wednesday", "Lab", "CSE 316.2", "104", 930, 1050, "RHN"),
  
  createEntry("Wednesday", "Lab", "EEE 214.9", "105", 690, 810, "SKD"),
  createEntry("Wednesday", "Lab", "EEE 206.1", "105", 810, 930, "KA"),
  
  createEntry("Wednesday", "Lab", "EEE 214.3", "106", 570, 690, "SKD"),
  createEntry("Wednesday", "Lab", "EEE 214.1", "106", 690, 810, "KA"),
  createEntry("Wednesday", "Lab", "EEE 102", "106", 810, 930, "ANJ"),
  createEntry("Wednesday", "Lab", "CSE 216.3", "106", 930, 1050, "ANJ"),
  
  createEntry("Wednesday", "Lab", "PHY 102.2 (EEE)", "109", 690, 810, "SHA"),
  createEntry("Wednesday", "Lab", "PHY 102.2", "109", 810, 930, "SHA"),
  
  createEntry("Wednesday", "Lab", "EEE 410.2", "115", 570, 690, "SHAMIM"),
  createEntry("Wednesday", "Lab", "CSE 124.7", "115", 690, 810, "SWAPNIL"),
  createEntry("Wednesday", "Lab", "ENG 112.3", "115", 810, 930, "PRM"),
  createEntry("Wednesday", "Lab", "EEE 306", "115", 930, 1050, "Dr. IAZ"),
  
  createEntry("Wednesday", "Lab", "CSE 322.2", "313", 570, 690, "TJ"),
  createEntry("Wednesday", "Lab", "CSE 328.2", "313", 690, 810, "UDD"),
  createEntry("Wednesday", "Lab", "ME 102.8", "313", 810, 930, "TBA"),
  createEntry("Wednesday", "Lab", "CSE 114.2", "313", 930, 1050, "TAZ"),
  
  createEntry("Wednesday", "Lab", "CSE 312.1", "N304", 570, 690, "SAF"),
  createEntry("Wednesday", "Lab", "CSE 436.5", "N304", 690, 810, "ARS"),
  createEntry("Wednesday", "Lab", "CSE 326.5", "N304", 810, 930, "ABH"),
  createEntry("Wednesday", "Lab", "ME 102.5", "N304", 930, 1050, "TBA"),
  
  createEntry("Wednesday", "Lab", "CSE 436.3", "N607", 690, 810, "ANC"),
  createEntry("Wednesday", "Lab", "CSE 112.8", "N607", 810, 930, "FARJANA"),
]

// =============================================
// THURSDAY THEORY CLASSES
// =============================================
export const thursdayTheory: ClassEntry[] = [
  // Room 103
  createEntry("Thursday", "Theory", "MATH 107.2", "103", 600, 690, "MSR"),
  createEntry("Thursday", "Theory", "CSE 113.2", "103", 690, 780, "TAZ"),
  createEntry("Thursday", "Theory", "CSE 113.1", "103", 810, 900, "TAZ"),
  createEntry("Thursday", "Theory", "HUM 301.2", "103", 900, 990, "NUSRAT"),
  createEntry("Thursday", "Theory", "MATH 301.2", "103", 990, 1080, "TA"),
  
  // Room 107
  createEntry("Thursday", "Theory", "EEE 213.1", "107", 510, 600, "KA"),
  createEntry("Thursday", "Theory", "CSE 123.1", "107", 600, 690, "JM"),
  createEntry("Thursday", "Theory", "CSE 115.1", "107", 690, 780, "SWAPNIL"),
  createEntry("Thursday", "Theory", "CSE 111.4", "107", 810, 900, "SSD"),
  createEntry("Thursday", "Theory", "CSE 321.1", "107", 900, 990, "TJ"),
  createEntry("Thursday", "Theory", "CSE 327.1", "107", 990, 1080, "UDD"),
  
  // Room 108
  createEntry("Thursday", "Theory", "CSE 123.2", "108", 510, 600, "JM"),
  createEntry("Thursday", "Theory", "CSE 115.2", "108", 600, 690, "SWAPNIL"),
  createEntry("Thursday", "Theory", "EEE 213.2", "108", 690, 780, "KA"),
  createEntry("Thursday", "Theory", "MATH 207.4", "108", 810, 900, "SWAPNIL"),
  createEntry("Thursday", "Theory", "EEE 111.4", "108", 900, 990, "Dr. MSA"),
  createEntry("Thursday", "Theory", "CHEM 201.4", "108", 990, 1080, "TULY"),
  
  // Room 110
  createEntry("Thursday", "Theory", "HUM 201.3", "110", 510, 600, "JAMILA"),
  createEntry("Thursday", "Theory", "CSE 115.3", "110", 600, 690, "ARFAN"),
  createEntry("Thursday", "Theory", "CSE 123.3", "110", 690, 780, "JM"),
  createEntry("Thursday", "Theory", "CSE 311.3", "110", 810, 900, "SAF"),
  createEntry("Thursday", "Theory", "CHEM 201 (EEE)", "110", 900, 990, "Mustira"),
  createEntry("Thursday", "Theory", "EEE 101", "110", 990, 1080, "Dr. MSA"),
  
  // Room 111
  createEntry("Thursday", "Theory", "CSE 115.4", "111", 510, 600, "ARFAN"),
  createEntry("Thursday", "Theory", "HUM 201.4", "111", 600, 690, "JAMILA"),
  createEntry("Thursday", "Theory", "CSE 123.4", "111", 690, 780, "SOA"),
  createEntry("Thursday", "Theory", "MATH 205.4", "111", 810, 900, "MC"),
  
  // Room 114
  createEntry("Thursday", "Theory", "CSE 123.5", "114", 510, 600, "SOA"),
  createEntry("Thursday", "Theory", "HUM 201.5", "114", 600, 690, "SUMAIYA"),
  createEntry("Thursday", "Theory", "CSE 225.3", "114", 690, 780, "JUD"),
  createEntry("Thursday", "Theory", "CSE 411.2", "114", 810, 900, "SAB"),
  createEntry("Thursday", "Theory", "CSE 327.2", "114", 900, 990, "UDD"),
  createEntry("Thursday", "Theory", "CSE 321.2", "114", 990, 1080, "TJ"),
  
  // Room 311
  createEntry("Thursday", "Theory", "CSE 123.6", "311", 600, 690, "SOA"),
  createEntry("Thursday", "Theory", "HUM 201.6", "311", 690, 780, "SUMAIYA"),
  createEntry("Thursday", "Theory", "CSE 321.4", "311", 810, 900, "TJ"),
  createEntry("Thursday", "Theory", "CSE 327.4", "311", 900, 990, "SAB"),
  createEntry("Thursday", "Theory", "CSE 411.4", "311", 990, 1080, "Mehraj"),
  
  // Room 312
  createEntry("Thursday", "Theory", "MATH 207 (EEE)", "312", 510, 600, "MSR"),
  createEntry("Thursday", "Theory", "EEE 205", "312", 600, 690, "KA"),
  createEntry("Thursday", "Theory", "EEE 401.2", "312", 690, 780, "AAA"),
  createEntry("Thursday", "Theory", "ME 101 (EEE)", "312", 810, 900, "TBA"),
  createEntry("Thursday", "Theory", "MATH 103 (EEE)", "312", 900, 990, "MC"),
  
  // Room N201
  createEntry("Thursday", "Theory", "CSE 325.4", "N201", 510, 600, "ABH"),
  createEntry("Thursday", "Theory", "MATH 203.4", "N201", 600, 690, "SAMIHA"),
  createEntry("Thursday", "Theory", "ENG 111.1", "N201", 690, 780, "LAM"),
  createEntry("Thursday", "Theory", "ENG 111.2", "N201", 810, 900, "LAM"),
  
  // Room N202
  createEntry("Thursday", "Theory", "MATH 203.5", "N202", 510, 600, "SAMIHA"),
  createEntry("Thursday", "Theory", "CSE 223.5", "N202", 600, 690, "SHAMIM"),
  createEntry("Thursday", "Theory", "CSE 321.7", "N202", 690, 780, "FARJANA"),
  createEntry("Thursday", "Theory", "CSE 115.6", "N202", 810, 900, "ANB"),
  createEntry("Thursday", "Theory", "AA 150.1 (EEE)", "N202", 900, 990, "AAF5"),
  createEntry("Thursday", "Theory", "AA 099.1 (EEE)", "N202", 990, 1080, "AAF4"),
  
  // Room N203
  createEntry("Thursday", "Theory", "CSE 223.6", "N203", 510, 600, "SHAMIM"),
  createEntry("Thursday", "Theory", "CSE 325.6", "N203", 600, 690, "ABH"),
  createEntry("Thursday", "Theory", "CSE 463.3", "N203", 690, 780, "ARS"),
  createEntry("Thursday", "Theory", "CSE 301.7", "N203", 810, 900, "TRINA"),
  createEntry("Thursday", "Theory", "CSE 411.7", "N203", 900, 990, "Mehraj"),
  
  // Room N204
  createEntry("Thursday", "Theory", "CSE 463.1", "N204", 600, 690, "ARS"),
  createEntry("Thursday", "Theory", "CSE 459.1", "N204", 690, 780, "JNM"),
  createEntry("Thursday", "Theory", "CSE 443.3", "N204", 810, 900, "ASHRAF"),
  createEntry("Thursday", "Theory", "CSE 439.3", "N204", 900, 990, "MUSFEQA"),
  
  // Room N601
  createEntry("Thursday", "Theory", "CSE 443.2", "N601", 690, 780, "ASHRAF"),
  createEntry("Thursday", "Theory", "CSE 459.2", "N601", 810, 900, "JNM"),
  
  // Room N602
  createEntry("Thursday", "Theory", "CSE 103", "N602", 690, 780, "MONALISA"),
  createEntry("Thursday", "Theory", "CHEM 201.1", "N602", 810, 900, "Mustira"),
  createEntry("Thursday", "Theory", "MATH 207.1", "N602", 900, 990, "TRINA"),
  
  // Room N603
  createEntry("Thursday", "Theory", "AA 099.8", "N603", 810, 900, "AAF4"),
  createEntry("Thursday", "Theory", "AA 200.8", "N603", 900, 990, "AAF6"),
  createEntry("Thursday", "Theory", "AA 150.8", "N603", 990, 1080, "AAF5"),
  
  // Room N604
  createEntry("Thursday", "Theory", "AA 200.10", "N604", 690, 780, "AAF6"),
  createEntry("Thursday", "Theory", "AA 150.7", "N604", 810, 900, "AAF5"),
  createEntry("Thursday", "Theory", "AA 099.7", "N604", 900, 990, "AAF4"),
  createEntry("Thursday", "Theory", "AA 200.7", "N604", 990, 1080, "AAF6"),
  
  // Room N605
  createEntry("Thursday", "Theory", "CSE 111.9", "N605", 600, 690, "FARJANA"),
  createEntry("Thursday", "Theory", "AA 099.9", "N605", 690, 780, "AAF4"),
  createEntry("Thursday", "Theory", "AA 200.9", "N605", 810, 900, "AAF6"),
  createEntry("Thursday", "Theory", "AA 150.6", "N605", 900, 990, "AAF2"),
  createEntry("Thursday", "Theory", "CSE 111.6", "N605", 990, 1080, "ANB"),
  
  // Room N606
  createEntry("Thursday", "Theory", "AA 099.1", "N606", 600, 690, "AAF1"),
  createEntry("Thursday", "Theory", "AA 099.2", "N606", 690, 780, "AAF1"),
  createEntry("Thursday", "Theory", "AA 150.1", "N606", 810, 900, "AAF2"),
  createEntry("Thursday", "Theory", "CSE 111.5", "N606", 900, 990, "ANB"),
  createEntry("Thursday", "Theory", "AA 150.5", "N606", 990, 1080, "AAF2"),
]

// =============================================
// THURSDAY LAB CLASSES
// =============================================
export const thursdayLab: ClassEntry[] = [
  createEntry("Thursday", "Lab", "CSE 312.3", "102", 690, 810, "SAF"),
  createEntry("Thursday", "Lab", "CSE 222.1", "102", 810, 930, "SAH"),
  
  createEntry("Thursday", "Lab", "CSE 316.7", "104", 570, 690, "RHN"),
  createEntry("Thursday", "Lab", "ENG 112.1", "104", 690, 810, "PRM"),
  
  createEntry("Thursday", "Lab", "EEE 402.2", "105", 570, 690, "AAA"),
  createEntry("Thursday", "Lab", "CSE 216.4", "105", 690, 810, "PH"),
  createEntry("Thursday", "Lab", "CSE 216.5", "105", 810, 930, "PH"),
  
  createEntry("Thursday", "Lab", "EEE 402.3", "106", 810, 930, "AAA"),
  
  createEntry("Thursday", "Lab", "CSE 312.6", "115", 690, 810, "TRINA"),
  createEntry("Thursday", "Lab", "CSE 226.5", "115", 930, 1050, "ASHRAF"),
  
  createEntry("Thursday", "Lab", "ENG 112.4", "313", 570, 690, "PRM"),
  createEntry("Thursday", "Lab", "CSE 312.4", "313", 690, 810, "RHN"),
  createEntry("Thursday", "Lab", "CSE 226.3", "313", 810, 930, "JUD"),
  createEntry("Thursday", "Lab", "CSE 222.3", "313", 930, 1050, "SAH"),
  
  createEntry("Thursday", "Lab", "CSE 326.6", "N304", 690, 810, "ABH"),
  createEntry("Thursday", "Lab", "CSE 326.1", "N304", 810, 930, "ARC"),
  createEntry("Thursday", "Lab", "ME 102.1", "N304", 930, 1050, "TBA"),
  
  createEntry("Thursday", "Lab", "CSE 112.2", "N607", 570, 690, "SSD"),
  createEntry("Thursday", "Lab", "CSE 112.1", "N607", 690, 810, "SSD"),
  createEntry("Thursday", "Lab", "CSE 112.10", "N607", 810, 930, "MONALISA"),
  createEntry("Thursday", "Lab", "CSE 112.4", "N607", 930, 1050, "MONALISA"),
]
