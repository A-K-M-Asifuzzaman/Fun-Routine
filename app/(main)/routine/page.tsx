import { Metadata } from 'next'
import { RoutineExplorer } from '@/features/routine/components/routine-explorer'

export const metadata: Metadata = {
  title: 'Routine Explorer | EDU Routine Helper',
  description: 'Browse semester routines and course schedules'
}

export default function RoutinePage() {
  return (
    <div className="space-y-4 md:space-y-6 px-3 md:px-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Routine Explorer</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Browse and view semester routines, courses, and schedules
        </p>
      </div>
      <RoutineExplorer />
    </div>
  )
}
