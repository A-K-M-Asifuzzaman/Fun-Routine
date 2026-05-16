'use client'

import { useMemo } from 'react'
import { getAllRooms, getRoomStats } from '@/lib/data-access/rooms'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DoorOpen, BookOpen } from 'lucide-react'

export function RoomListing() {
  const rooms = useMemo(() => getAllRooms(), [])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map(room => {
        const stats = getRoomStats(room)
        return (
          <Card key={room} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DoorOpen className="w-4 h-4" />
                {room}
              </CardTitle>
              <CardDescription>Classroom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span>{stats.totalCourses} classes</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {stats.days.map(day => (
                  <Badge key={day} variant="outline" className="text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
