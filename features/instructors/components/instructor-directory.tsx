'use client'

import { useMemo } from 'react'
import { getAllInstructors, getInstructorStats } from '@/lib/data-access/instructors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users } from 'lucide-react'

export function InstructorDirectory() {
  const instructors = useMemo(() => getAllInstructors(), [])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {instructors.map(instructor => {
        const stats = getInstructorStats(instructor.short)
        return (
          <Card key={instructor.short} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{instructor.full}</CardTitle>
              <CardDescription className="font-mono text-xs">{instructor.short}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span>{stats.totalCourses} courses</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{stats.rooms.length} room{stats.rooms.length !== 1 ? 's' : ''}</span>
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
