import { Metadata } from 'next'
import { RoomListing } from '@/features/rooms/components/room-listing'

export const metadata: Metadata = {
  title: 'Rooms | EDU Routine Helper',
  description: 'Browse classrooms and their course schedules'
}

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
        <p className="text-muted-foreground mt-2">
          Browse all available classrooms and their schedules
        </p>
      </div>
      <RoomListing />
    </div>
  )
}
