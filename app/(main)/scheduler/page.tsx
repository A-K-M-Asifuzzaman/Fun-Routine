import { Metadata } from 'next'
import { AutoScheduler } from '@/features/scheduler/components/auto-scheduler'

export const metadata: Metadata = {
  title: 'Auto Scheduler | EDU Routine Helper',
  description: 'Generate optimal schedules automatically'
}

export default function SchedulerPage() {
  return (
    <div className="space-y-4 md:space-y-6 px-3 md:px-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Auto Scheduler</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Generate optimal schedules with automatic optimization
        </p>
      </div>
      <AutoScheduler />
    </div>
  )
}
