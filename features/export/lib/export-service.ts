import type { ClassEntry } from '@/types'
import { formatMinutesToTime } from '@/lib/time-utils'

// Course color palette - unique colors for each course
const courseColors = [
  [59, 130, 246],      // Blue
  [239, 68, 68],       // Red
  [34, 197, 94],       // Green
  [168, 85, 247],      // Purple
  [251, 146, 60],      // Orange
  [14, 165, 233],      // Sky Blue
  [236, 72, 153],      // Pink
  [8, 145, 178],       // Teal
  [217, 119, 6],       // Amber
  [126, 34, 206],      // Violet
]

function getCourseColor(courseCode: string): [number, number, number] {
  const hash = courseCode.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return courseColors[hash % courseColors.length] as [number, number, number]
}

export async function exportToPDF(classes: ClassEntry[], filename: string = 'schedule.pdf') {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 12
  
  // Colors
  const primaryColor = [13, 27, 42] as [number, number, number] // Dark navy
  const accentColor = [59, 130, 246] as [number, number, number] // Blue accent
  const lightBg = [248, 250, 252] as [number, number, number] // Very light blue
  
  let yPos = margin
  
  // ===== PAGE 1: COVER & SUMMARY =====
  
  // Decorative header bar
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 50, 'F')
  
  // Gradient effect with accent
  doc.setFillColor(...accentColor)
  doc.rect(0, 45, pageWidth, 5, 'F')
  
  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.setFont(undefined, 'bold')
  doc.text('EDU', margin, 25)
  doc.setFontSize(28)
  doc.setFont(undefined, 'normal')
  doc.text('CLASS SCHEDULE', margin, 35)
  
  // University info
  doc.setFontSize(11)
  doc.setTextColor(200, 210, 220)
  doc.text('East Delta University', pageWidth - margin - 50, 30)
  doc.setFontSize(9)
  doc.text('Academic Schedule 2026', pageWidth - margin - 50, 37)
  
  yPos = 65
  
  // Generation date
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  doc.text(`Generated on ${formattedDate}`, margin, yPos)
  
  yPos += 15
  
  // Statistics cards
  const uniqueCourses = new Set(classes.map(c => c.courseCode)).size
  const totalHours = classes.reduce((sum, c) => sum + (c.endMinutes - c.startMinutes), 0) / 60
  const activeDays = new Set(classes.map(c => c.day)).size
  
  const stats = [
    { label: 'Total Classes', value: classes.length },
    { label: 'Unique Courses', value: uniqueCourses },
    { label: 'Weekly Hours', value: totalHours.toFixed(1) + 'h' },
    { label: 'Class Days', value: activeDays },
  ]
  
  stats.forEach((stat, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const cardX = margin + col * (pageWidth / 2 - margin - 3)
    const cardY = yPos + row * 20
    
    // Card background
    doc.setFillColor(...lightBg)
    doc.roundedRect(cardX, cardY, pageWidth / 2 - margin - 6, 18, 2, 2, 'F')
    
    // Card border
    doc.setDrawColor(...accentColor)
    doc.setLineWidth(1.5)
    doc.roundedRect(cardX, cardY, pageWidth / 2 - margin - 6, 18, 2, 2)
    
    // Value
    doc.setTextColor(...accentColor)
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text(String(stat.value), cardX + 5, cardY + 10)
    
    // Label
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.text(stat.label, cardX + 5, cardY + 15)
  })
  
  yPos += 50
  
  // Section separator
  doc.setDrawColor(...accentColor)
  doc.setLineWidth(1)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  
  yPos += 8
  
  // Daily breakdown
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Schedule Overview by Day', margin, yPos)
  
  yPos += 8
  
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const classesByDay = new Map<string, ClassEntry[]>()
  dayOrder.forEach(day => classesByDay.set(day, []))
  classes.forEach(c => {
    if (classesByDay.has(c.day)) {
      classesByDay.get(c.day)!.push(c)
    }
  })
  
  let dayCardsPerRow = 0
  const cardWidth = (pageWidth - 2 * margin) / 3.5
  let cardX = margin
  
  dayOrder.forEach((day, idx) => {
    const dayClasses = classesByDay.get(day) || []
    if (dayClasses.length === 0) return
    
    if (dayCardsPerRow === 3) {
      yPos += 22
      cardX = margin
      dayCardsPerRow = 0
    }
    
    const startColor = getCourseColor(dayClasses[0].courseCode)
    doc.setFillColor(...startColor)
    doc.roundedRect(cardX, yPos, cardWidth - 2, 6, 1, 1, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.setFont(undefined, 'bold')
    doc.text(day, cardX + 2, yPos + 4)
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(7)
    doc.setFont(undefined, 'normal')
    doc.text(`${dayClasses.length} class${dayClasses.length !== 1 ? 'es' : ''}`, cardX + 2, yPos + 12)
    
    const hours = dayClasses.reduce((sum, c) => sum + (c.endMinutes - c.startMinutes), 0) / 60
    doc.text(`${hours.toFixed(1)}h`, cardX + 2, yPos + 16)
    
    cardX += cardWidth
    dayCardsPerRow++
  })
  
  // Add page break
  doc.addPage()
  yPos = margin
  
  // ===== PAGE 2+: COURSE DETAILS TABLE =====
  
  // Header for table pages
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont(undefined, 'bold')
  doc.text('COURSE SCHEDULE', margin, 8)
  
  yPos = 20
  
  // Table configuration
  const tableMargin = margin
  const tableWidth = pageWidth - 2 * tableMargin
  const colWidths = [30, 15, 20, 25, 20, 30, 20]
  
  // Sort classes by day then time
  const sortedClasses = [...classes].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
    if (dayDiff !== 0) return dayDiff
    return a.startMinutes - b.startMinutes
  })
  
  // Table header
  const headers = ['Course', 'Sec', 'Day', 'Time', 'Room', 'Instructor', 'Type']
  
  doc.setFillColor(...primaryColor)
  doc.rect(tableMargin, yPos, tableWidth, 9, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8.5)
  doc.setFont(undefined, 'bold')
  let xPos = tableMargin + 2
  headers.forEach((h, i) => {
    doc.text(h, xPos, yPos + 6)
    xPos += colWidths[i]
  })
  
  yPos += 10
  
  // Table rows
  doc.setFont(undefined, 'normal')
  doc.setFontSize(8)
  const rowHeight = 8
  
  sortedClasses.forEach((course, idx) => {
    // Check if new page needed
    if (yPos > pageHeight - 15) {
      doc.addPage()
      
      // Repeat header
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, pageWidth, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('COURSE SCHEDULE (continued)', margin, 8)
      
      yPos = 20
      
      doc.setFillColor(...primaryColor)
      doc.rect(tableMargin, yPos, tableWidth, 9, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8.5)
      doc.setFont(undefined, 'bold')
      let hx = tableMargin + 2
      headers.forEach((h, i) => {
        doc.text(h, hx, yPos + 6)
        hx += colWidths[i]
      })
      yPos += 10
    }
    
    const courseColor = getCourseColor(course.courseCode)
    
    // Subtle alternating background with course color accent
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252)
    } else {
      doc.setFillColor(255, 255, 255)
    }
    doc.rect(tableMargin, yPos, tableWidth, rowHeight, 'F')
    
    // Left border color indicator
    doc.setFillColor(...courseColor)
    doc.rect(tableMargin, yPos, 1.5, rowHeight, 'F')
    
    // Content
    doc.setTextColor(20, 20, 20)
    doc.setFont(undefined, 'bold')
    xPos = tableMargin + 3
    doc.text(course.courseCode || '', xPos, yPos + 5)
    xPos += colWidths[0]
    
    doc.setFont(undefined, 'normal')
    doc.text(String(course.section), xPos, yPos + 5)
    xPos += colWidths[1]
    
    doc.text(course.day?.substring(0, 3) || '', xPos, yPos + 5)
    xPos += colWidths[2]
    
    const startTime = formatMinutesToTime(course.startMinutes)
    const endTime = formatMinutesToTime(course.endMinutes)
    doc.text(`${startTime}-${endTime}`, xPos, yPos + 5)
    xPos += colWidths[3]
    
    doc.text(course.room || '', xPos, yPos + 5)
    xPos += colWidths[4]
    
    doc.text(course.instructorShort || '', xPos, yPos + 5)
    xPos += colWidths[5]
    
    // Type badge
    const typeColor = course.type === 'Theory' ? [59, 130, 246] : [16, 185, 129]
    doc.setFillColor(...typeColor as [number, number, number])
    doc.roundedRect(xPos, yPos + 1.5, 15, 5, 1, 1, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont(undefined, 'bold')
    doc.setFontSize(6.5)
    doc.text(course.type || 'Theory', xPos + 1, yPos + 4.5)
    doc.setFontSize(8)
    
    yPos += rowHeight
  })
  
  // Footer
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(7)
  doc.setFont(undefined, 'normal')
  doc.text('EDU Routine Helper • Smart Academic Scheduling', pageWidth / 2 - 35, pageHeight - 5)
  
  doc.save(filename)
}

export async function exportToICS(classes: ClassEntry[], filename: string = 'schedule.ics') {
  const { default: ics } = await import('ics')
  
  const events = classes.map(course => {
    const today = new Date()
    const dayMap: Record<string, number> = {
      'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0
    }
    
    const dayOffset = dayMap[course.day] || 0
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + (dayOffset - today.getDay() + 7) % 7)
    
    const startHours = Math.floor(course.startMinutes / 60)
    const startMins = course.startMinutes % 60
    const endHours = Math.floor(course.endMinutes / 60)
    const endMins = course.endMinutes % 60
    
    return {
      title: `${course.courseCode} - ${course.instructorShort}`,
      description: `Section: ${course.section}`,
      location: course.room,
      startInputType: 'local',
      start: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startHours, startMins],
      endInputType: 'local',
      end: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), endHours, endMins],
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=' + course.day.substring(0, 2).toUpperCase()
    }
  })
  
  const { value, error } = ics.createEvents(events)
  
  if (error) {
    console.error('ICS generation error:', error)
    return
  }
  
  const blob = new Blob([value || ''], { type: 'text/calendar' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
