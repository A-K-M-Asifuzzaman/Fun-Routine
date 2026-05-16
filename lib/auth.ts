// Simple auth utility for admin import feature
// In production, use proper authentication like Auth.js, Supabase Auth, or Clerk

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD // Change this to your secure password

export function setAdminSession(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_session', 'true')
      localStorage.setItem('admin_timestamp', Date.now().toString())
    }
    return true
  }
  return false
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_timestamp')
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const session = localStorage.getItem('admin_session')
  const timestamp = localStorage.getItem('admin_timestamp')
  
  if (!session || !timestamp) return false
  
  // Session expires after 24 hours
  const sessionAge = Date.now() - parseInt(timestamp)
  const twentyFourHours = 24 * 60 * 60 * 1000
  
  if (sessionAge > twentyFourHours) {
    clearAdminSession()
    return false
  }
  
  return session === 'true'
}
