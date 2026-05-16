'use client'

import { useMemo, useState } from 'react'
import { allClasses } from '@/data'
import { SEMESTERS } from '@/constants/semesters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TimetableGrid } from './timetable-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export function RoutineExplorer() {
  const [selectedSemester, setSelectedSemester] = useState(1)
  
  const semesterClasses = useMemo(() => {
    return allClasses.filter(c => c.semester === selectedSemester)
  }, [selectedSemester])
  
  const semesterData = SEMESTERS.find(s => s.id === selectedSemester)
  
  return (
    <div className="space-y-4 md:space-y-6">
      <Tabs value={selectedSemester.toString()} onValueChange={(v) => setSelectedSemester(Number(v))}>
        <TabsList className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-11 w-full h-auto gap-1">
          {SEMESTERS.map(sem => (
            <TabsTrigger key={sem.id} value={String(sem.id)} className="text-xs md:text-sm py-2">
              {sem.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {SEMESTERS.map(sem => (
          <TabsContent key={sem.id} value={String(sem.id)} className="space-y-4 md:space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-2xl">{sem.label}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {semesterClasses.length} courses • Tap a class for details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 overflow-x-auto">
                <TimetableGrid 
                  entries={semesterClasses}
                  showCurrentTime
                />
              </CardContent>
            </Card>
            
            <div className="flex gap-2 px-4 md:px-6">
              <Link href={`${ROUTES.builder}?semester=${sem.id}`} className="flex-1">
                <Button className="w-full text-sm md:text-base">Build Schedule for {sem.label}</Button>
              </Link>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
