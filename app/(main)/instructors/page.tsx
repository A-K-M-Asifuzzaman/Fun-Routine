import { Metadata } from 'next'
import { InstructorDirectory } from '@/features/instructors/components/instructor-directory'

export const metadata: Metadata = {
  title: 'Instructors | EDU Routine Helper',
  description: 'Browse all instructors and their course schedules'
}

export default function InstructorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instructors</h1>
        <p className="text-muted-foreground mt-2">
          Browse faculty members and their teaching schedules
        </p>
      </div>
      <InstructorDirectory />
    </div>
  )
}
