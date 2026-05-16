export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

export function timeToMinutes(time: string): number {
  const [timeStr, period] = time.split(' ')
  let [hours, mins] = timeStr.split(':').map(Number)
  
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  
  return hours * 60 + mins
}

export function getTimeSlotsForDay(classes: Array<{ startMinutes: number; endMinutes: number }>) {
  const slots = classes.map(c => ({ start: c.startMinutes, end: c.endMinutes }))
  slots.sort((a, b) => a.start - b.start)
  return slots
}

export function getDayStartEnd(classes: Array<{ startMinutes: number; endMinutes: number }>) {
  if (classes.length === 0) return { start: 480, end: 1080 } // 8 AM to 6 PM default
  
  const starts = classes.map(c => c.startMinutes)
  const ends = classes.map(c => c.endMinutes)
  
  return {
    start: Math.floor(Math.min(...starts) / 60) * 60, // Round down to nearest hour
    end: Math.ceil(Math.max(...ends) / 60) * 60, // Round up to nearest hour
  }
}
