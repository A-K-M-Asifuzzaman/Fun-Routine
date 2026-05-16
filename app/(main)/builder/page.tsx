import { Metadata } from 'next'
import { ScheduleBuilder } from '@/features/builder/components/schedule-builder'

export const metadata: Metadata = {
  title: 'Schedule Builder | EDU Routine Helper',
  description: 'Build your custom schedule with conflict detection'
}

export default function BuilderPage() {
  return (
    <div className="space-y-4 md:space-y-6 px-3 md:px-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Schedule Builder</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Customize your schedule, detect conflicts, and export
        </p>
      </div>
      <ScheduleBuilder />
    </div>
  )
}
