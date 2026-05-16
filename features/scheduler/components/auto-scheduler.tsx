'use client'

import { useState, useMemo } from 'react'
import { allClasses } from '@/data'
import { useBuilderStore } from '@/features/builder/store/builder-store'
import { generateOptimalSchedules, scoreSchedule } from '@/features/scheduler/lib/scheduler'
import { TimetableGrid } from '@/features/routine/components/timetable-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, CheckCircle2, Zap, Plus, Trash2, Search } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import type { ClassEntry } from '@/types'

export function AutoScheduler() {
  const { selectedCourses, addCourse, removeCourse, clearAll } = useBuilderStore()
  const [generatedSchedules, setGeneratedSchedules] = useState<any[]>([])
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0)
  const [avoidMornings, setAvoidMornings] = useState(false)
  const [preferCompact, setPreferCompact] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter available courses for search
  const availableCourses = useMemo(() => {
    const selectedIds = new Set(selectedCourses.map(c => c.id))
    const query = searchQuery.toLowerCase()
    
    return allClasses.filter(c => {
      if (!c || !c.courseCode) return false
      if (selectedIds.has(c.id)) return false
      if (!query) return true
      return (
        c.courseCode.toLowerCase().includes(query) ||
        c.instructorShort?.toLowerCase().includes(query) ||
        c.room?.toLowerCase().includes(query)
      )
    }).slice(0, 50) // Limit to 50 results
  }, [selectedCourses, searchQuery])

  const generateSchedules = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Add courses first')
      return
    }

    setIsGenerating(true)
    try {
      // Get unique course codes from selected courses
      const uniqueCourseCodes = new Set(selectedCourses.map(c => c.courseCode))
      
      // Build available sections map: for each selected course code,
      // get ALL sections from allClasses (not just the selected ones)
      const courseMap = new Map<string, typeof selectedCourses>()
      uniqueCourseCodes.forEach(code => {
        const allSections = allClasses.filter(c => c.courseCode === code)
        if (allSections.length > 0) {
          courseMap.set(code, allSections)
        }
      })

      // Create a list with one representative per course code for the generator
      const coursesForGenerator = Array.from(uniqueCourseCodes).map(code => {
        return allClasses.find(c => c.courseCode === code)!
      }).filter(Boolean)

      const schedules = generateOptimalSchedules(
        coursesForGenerator,
        courseMap,
        {
          avoidMornings,
          maxDailyHours: 8,
          maxGapHours: preferCompact ? 2 : 4,
        }
      )
      
      console.log('[v0] Scheduler debug:', {
        uniqueCourseCodes: Array.from(uniqueCourseCodes),
        coursesForGenerator: coursesForGenerator.length,
        courseMapSize: courseMap.size,
        schedulesGenerated: schedules.length,
        avoidMornings,
        preferCompact
      })

      if (schedules.length === 0) {
        toast.info('No valid schedules found with current constraints')
        setGeneratedSchedules([])
        return
      }

      const scored = schedules.map((schedule, idx) => ({
        schedule,
        score: scoreSchedule(schedule),
        index: idx,
      }))

      scored.sort((a, b) => b.score - a.score)
      setGeneratedSchedules(scored)
      setSelectedScheduleIndex(0)
      toast.success(`Generated ${scored.length} optimal schedule${scored.length !== 1 ? 's' : ''}`)
    } catch (error) {
      console.error('[v0] Scheduler error:', error)
      toast.error('Failed to generate schedules')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedSchedule = useMemo(() => {
    return generatedSchedules[selectedScheduleIndex]?.schedule || []
  }, [generatedSchedules, selectedScheduleIndex])

  // Calculate schedule stats
  const stats = useMemo(() => {
    if (selectedSchedule.length === 0) return null
    const days = new Set(selectedSchedule.map(c => c.day))
    const totalHours = selectedSchedule.reduce((sum, c) => sum + (c.endMinutes - c.startMinutes), 0) / 60
    return {
      daysPerWeek: days.size,
      totalHours: totalHours.toFixed(1),
      courses: selectedSchedule.length,
    }
  }, [selectedSchedule])

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Select Courses
          </CardTitle>
          <CardDescription>Search and add courses to optimize your schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Courses */}
          {selectedCourses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Courses ({selectedCourses.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedCourses.map(course => (
                  <Badge key={course.id} variant="default" className="pl-2">
                    {course.courseCode}.{course.section}
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="ml-1 hover:opacity-70"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by course code, instructor, room..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Available Courses */}
          {searchQuery && (
            <ScrollArea className="h-[300px] border rounded-lg p-3 space-y-2">
              {availableCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No courses found
                </p>
              ) : (
                <div className="space-y-2">
                  {availableCourses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => {
                        addCourse(course)
                        setSearchQuery('')
                        toast.success(`Added ${course.courseCode}.${course.section}`)
                      }}
                      className="w-full text-left p-2 rounded-md border hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{course.courseCode}.{course.section}</span>
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {course.day} {Math.floor(course.startMinutes / 60)}:{String(course.startMinutes % 60).padStart(2, '0')} - {course.room}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Scheduling Preferences
          </CardTitle>
          <CardDescription>Configure how the scheduler should optimize your schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <button
            onClick={() => setAvoidMornings(!avoidMornings)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
              avoidMornings 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:bg-muted'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              avoidMornings ? 'bg-primary border-primary' : 'border-muted-foreground'
            }`}>
              {avoidMornings && <div className="text-white text-xs">✓</div>}
            </div>
            <span className="text-sm font-medium">Avoid morning classes (before 10 AM)</span>
          </button>
          
          <button
            onClick={() => setPreferCompact(!preferCompact)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
              preferCompact 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:bg-muted'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              preferCompact ? 'bg-primary border-primary' : 'border-muted-foreground'
            }`}>
              {preferCompact && <div className="text-white text-xs">✓</div>}
            </div>
            <span className="text-sm font-medium">Prefer compact schedules (minimize gaps)</span>
          </button>
        </CardContent>
      </Card>

      {/* Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Auto Schedule Generator</CardTitle>
          <CardDescription>
            Generate optimal schedules based on your selected courses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCourses.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Add courses to your schedule first using the Schedule Builder
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Button 
                onClick={generateSchedules} 
                size="lg" 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Optimal Schedules'}
              </Button>
              
              {generatedSchedules.length > 0 && (
                <>
                  {/* Schedule Options */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {generatedSchedules.map((option, idx) => (
                      <Button
                        key={idx}
                        variant={selectedScheduleIndex === idx ? 'default' : 'outline'}
                        onClick={() => setSelectedScheduleIndex(idx)}
                        className="whitespace-nowrap"
                      >
                        Option {idx + 1}
                        <Badge variant="secondary" className="ml-2">
                          {Math.round(option.score)}
                        </Badge>
                      </Button>
                    ))}
                  </div>

                  {/* Schedule Stats */}
                  {stats && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-lg bg-muted text-center">
                        <div className="text-2xl font-bold">{stats.daysPerWeek}</div>
                        <div className="text-xs text-muted-foreground">Days/Week</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted text-center">
                        <div className="text-2xl font-bold">{stats.totalHours}</div>
                        <div className="text-xs text-muted-foreground">Total Hours</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted text-center">
                        <div className="text-2xl font-bold">{stats.courses}</div>
                        <div className="text-xs text-muted-foreground">Courses</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Timetable */}
                  <TimetableGrid 
                    entries={selectedSchedule}
                    showCurrentTime
                  />
                  
                  {/* Success Message */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      No conflicts detected in this schedule
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
