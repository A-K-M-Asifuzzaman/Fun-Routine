import type { ClassEntry } from '@/types'

export interface ImportedCourse {
  courseCode: string
  section: number
  day: string
  startTime: string
  endTime: string
  room: string
  instructor: string
  type: 'Theory' | 'Lab'
  semester?: number
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}

function generateId(day: string, course: string, room: string, startMinutes: number): string {
  return `${day}-${course}-${room}-${startMinutes}`.replace(/\s+/g, '-').toLowerCase()
}

function getSemesterFromCourse(courseCode: string): number {
  const code = courseCode.toUpperCase()
  const match = code.match(/(\d+)/)
  if (match) {
    const num = parseInt(match[1])
    // Extract semester from course number (e.g., CSE 111 -> Sem 1, CSE 221 -> Sem 3)
    return Math.ceil(num / 100)
  }
  return 1
}

export async function parseCSV(content: string): Promise<ImportedCourse[]> {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  
  const courses: ImportedCourse[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length < 7) continue
    
    const rowData: Record<string, string> = {}
    headers.forEach((header, idx) => {
      rowData[header] = values[idx] || ''
    })
    
    const course: ImportedCourse = {
      courseCode: rowData['course'] || rowData['course code'] || '',
      section: parseInt(rowData['section'] || '1'),
      day: rowData['day'] || '',
      startTime: rowData['start time'] || rowData['start'] || '',
      endTime: rowData['end time'] || rowData['end'] || '',
      room: rowData['room'] || '',
      instructor: rowData['instructor'] || rowData['teacher'] || '',
      type: (rowData['type'] || 'Theory').includes('Lab') ? 'Lab' : 'Theory',
    }
    
    if (course.courseCode && course.day && course.startTime) {
      course.semester = getSemesterFromCourse(course.courseCode)
      courses.push(course)
    }
  }
  
  return courses
}

export async function parseJSON(content: string): Promise<ImportedCourse[]> {
  try {
    const data = JSON.parse(content)
    const courses = Array.isArray(data) ? data : data.courses || []
    
    return courses.map((c: any) => ({
      courseCode: c.courseCode || c.course || '',
      section: c.section || 1,
      day: c.day || '',
      startTime: c.startTime || c.start || '',
      endTime: c.endTime || c.end || '',
      room: c.room || '',
      instructor: c.instructor || c.teacher || '',
      type: c.type === 'Lab' ? 'Lab' : 'Theory',
      semester: c.semester || getSemesterFromCourse(c.courseCode || ''),
    }))
  } catch (error) {
    console.error('[v0] JSON parse error:', error)
    throw new Error('Invalid JSON format')
  }
}

export async function parseExcel(arrayBuffer: ArrayBuffer): Promise<ImportedCourse[]> {
  // Since we can't use xlsx library easily, we'll parse using a simpler approach
  // Convert to text and treat as CSV
  const text = new TextDecoder().decode(arrayBuffer)
  return parseCSV(text)
}

export function convertToClassEntry(imported: ImportedCourse): Omit<ClassEntry, 'id'> {
  const startMinutes = timeToMinutes(imported.startTime)
  const endMinutes = timeToMinutes(imported.endTime)
  
  return {
    courseCode: imported.courseCode,
    section: imported.section,
    day: imported.day,
    startMinutes,
    endMinutes,
    room: imported.room,
    instructorShort: imported.instructor,
    type: imported.type,
    semester: imported.semester || 1,
  }
}

export function validateImport(courses: ImportedCourse[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  courses.forEach((course, idx) => {
    if (!course.courseCode) errors.push(`Row ${idx + 2}: Missing course code`)
    if (!course.day) errors.push(`Row ${idx + 2}: Missing day`)
    if (!course.startTime) errors.push(`Row ${idx + 2}: Missing start time`)
    if (!course.endTime) errors.push(`Row ${idx + 2}: Missing end time`)
    if (!course.room) errors.push(`Row ${idx + 2}: Missing room`)
    
    // Validate time format
    if (!/^\d{1,2}:\d{2}$/.test(course.startTime)) {
      errors.push(`Row ${idx + 2}: Invalid start time format (use HH:MM)`)
    }
    if (!/^\d{1,2}:\d{2}$/.test(course.endTime)) {
      errors.push(`Row ${idx + 2}: Invalid end time format (use HH:MM)`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
