'use client'

import { Calendar, BookOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Routine Selected</h3>
          <p className="text-sm text-muted-foreground">
            Choose a semester from the routine explorer or build a custom schedule to get started.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href={ROUTES.routine}>
            <Button className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse All Routines
            </Button>
          </Link>
          <Link href={ROUTES.builder}>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Build Custom Schedule
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
