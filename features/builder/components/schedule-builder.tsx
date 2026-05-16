'use client'

import { useState, useMemo } from 'react'
import { allClasses } from '@/data'
import { useBuilderStore } from '@/features/builder/store/builder-store'
import { detectConflicts, getConflictingCourses } from '@/features/builder/lib/conflict-detector'
import { TimetableGrid } from '@/features/routine/components/timetable-grid'
import { SEMESTERS, SEMESTER_COLORS } from '@/constants/semesters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { exportToPDF, exportToICS } from '@/features/export/lib/export-service'
import { AlertTriangle, Trash2, Download, Plus, ChevronDown, Search, X, Clock, MapPin, User, GraduationCap, FileText, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import type { ClassEntry } from '@/types'

export function ScheduleBuilder() {
  const { selectedCourses, addCourse, removeCourse, clearAll } = useBuilderStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  
  const conflicts = useMemo(() => detectConflicts(selectedCourses), [selectedCourses])
  const conflictingIds = useMemo(() => new Set(conflicts.flatMap(c => c.courses.map(co => co.id))), [conflicts])

  // Get courses for selected semester
  const semesterCourses = useMemo(() => {
    if (!selectedSemester) return []
    const semNum = parseInt(selectedSemester)
    return allClasses.filter(c => c.semester === semNum)
  }, [selectedSemester])

  // Group semester courses by code for selection
  const semesterCourseGroups = useMemo(() => {
    const groups = new Map<string, ClassEntry[]>()
    semesterCourses.forEach(course => {
      if (!groups.has(course.courseCode)) groups.set(course.courseCode, [])
      groups.get(course.courseCode)!.push(course)
    })
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [semesterCourses])

  // Handle semester selection - auto-add first section of each course
  const handleSemesterSelect = (semesterId: string) => {
    setSelectedSemester(semesterId)
    if (!semesterId) return

    // Clear existing and add first section of each course in this semester
    clearAll()
    const semNum = parseInt(semesterId)
    const semCourses = allClasses.filter(c => c.semester === semNum)
    
    // Group by course code and pick first section (usually section 1)
    const courseGroups = new Map<string, ClassEntry[]>()
    semCourses.forEach(course => {
      if (!courseGroups.has(course.courseCode)) courseGroups.set(course.courseCode, [])
      courseGroups.get(course.courseCode)!.push(course)
    })

    let addedCount = 0
    courseGroups.forEach((sections) => {
      // Sort by section number and pick first
      const sortedSections = sections.sort((a, b) => a.section - b.section)
      const firstSection = sortedSections[0]
      if (firstSection) {
        addCourse(firstSection)
        addedCount++
      }
    })

    toast.success(`Added ${addedCount} courses from Semester ${semesterId}`, {
      description: 'You can change individual sections below'
    })
  }
  
  // Filter courses not already selected and match search
  const availableCourses = useMemo(() => {
    const selectedIds = new Set(selectedCourses.map(c => c.id))
    return allClasses.filter(c => {
      if (!c || !c.id) return false
      if (selectedIds.has(c.id)) return false
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        (c.courseCode?.toLowerCase() || '').includes(query) ||
        (c.instructorShort?.toLowerCase() || '').includes(query) ||
        (c.room?.toLowerCase() || '').includes(query) ||
        (c.day?.toLowerCase() || '').includes(query)
      )
    })
  }, [selectedCourses, searchQuery])
  
  // Group by course code
  const groupedCourses = useMemo(() => {
    const groups = new Map<string, ClassEntry[]>()
    availableCourses.forEach(course => {
      if (!course.courseCode) return
      if (!groups.has(course.courseCode)) groups.set(course.courseCode, [])
      groups.get(course.courseCode)!.push(course)
    })
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [availableCourses])
  
    // Switch to a different section of the same course
  const handleSwitchSection = (currentCourse: ClassEntry, newSection: ClassEntry) => {
    removeCourse(currentCourse.id)
    addCourse(newSection)
    toast.success(`Switched to ${newSection.courseCode} Section ${newSection.section}`)
  }

  // Get alternative sections for a course
  const getAlternativeSections = (course: ClassEntry) => {
    return allClasses.filter(c => 
      c.courseCode === course.courseCode && 
      c.id !== course.id
    ).sort((a, b) => a.section - b.section)
  }

  const toggleExpanded = (code: string) => {
    setExpandedCourses(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }
  
  const handleAddCourse = (course: ClassEntry) => {
    const newConflicts = getConflictingCourses(selectedCourses, course)
    if (newConflicts.length > 0) {
      toast.warning(`This course conflicts with ${newConflicts.length} other course(s)`, {
        description: newConflicts.map(c => `${c.courseCode}.${c.section}`).join(', ')
      })
    }
    addCourse(course)
    toast.success(`Added ${course.courseCode}.${course.section}`)
  }
  
  const handleRemoveCourse = (course: ClassEntry) => {
    removeCourse(course.id)
    toast.info(`Removed ${course.courseCode}.${course.section}`)
  }
  
  const handleExport = async (type: 'pdf' | 'ics') => {
    if (selectedCourses.length === 0) {
      toast.error('Add courses to export')
      return
    }
    try {
      if (type === 'pdf') {
        await exportToPDF(selectedCourses, 'my-schedule.pdf')
        toast.success('PDF exported successfully')
      } else {
        await exportToICS(selectedCourses, 'my-schedule.ics')
        toast.success('Calendar file exported successfully')
      }
    } catch (error) {
      console.error('[v0] Export error:', error)
      toast.error('Failed to export. Please try again.')
    }
  }

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Main timetable */}
      <div className="lg:col-span-2 space-y-4 lg:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
            <CardDescription>
              {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
              {conflicts.length > 0 && (
                <span className="text-destructive ml-2">
                  ({conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''})
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCourses.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No courses selected</p>
                <p className="text-sm mt-1">Search and add courses from the sidebar to build your schedule</p>
              </div>
            ) : (
              <TimetableGrid entries={selectedCourses} showCurrentTime />
            )}
          </CardContent>
        </Card>
        
        {conflicts.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Schedule Conflicts Detected</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1">
                {conflicts.map((conflict, i) => (
                  <li key={i}>{conflict.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Selected courses list */}
        {selectedCourses.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Selected Courses</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCourses.map(course => {
                  const alternatives = getAlternativeSections(course)
                  return (
                    <div 
                      key={course.id}
                      className={`p-3 rounded-lg border ${
                        conflictingIds.has(course.id) 
                          ? 'border-destructive bg-destructive/5' 
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{course.courseCode}</p>
                          <Badge variant={course.type === 'Theory' ? 'default' : 'secondary'} className="text-xs">
                            {course.type}
                          </Badge>
                          {conflictingIds.has(course.id) && (
                            <Badge variant="destructive" className="text-xs">Conflict</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveCourse(course)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Section selector */}
                      {alternatives.length > 0 ? (
                        <Select 
                          value={course.id} 
                          onValueChange={(newId) => {
                            const newSection = allClasses.find(c => c.id === newId)
                            if (newSection) handleSwitchSection(course, newSection)
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue>
                              Section {course.section} - {course.day} {formatTime(course.startMinutes)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={course.id}>
                              <span className="flex items-center justify-between gap-4">
                                <span>Section {course.section}</span>
                                <span className="text-muted-foreground">{course.day} {formatTime(course.startMinutes)}</span>
                              </span>
                            </SelectItem>
                            {alternatives.map(alt => {
                              const wouldConflict = getConflictingCourses(
                                selectedCourses.filter(c => c.id !== course.id), 
                                alt
                              ).length > 0
                              return (
                                <SelectItem key={alt.id} value={alt.id}>
                                  <span className={`flex items-center justify-between gap-4 ${wouldConflict ? 'text-destructive' : ''}`}>
                                    <span>Section {alt.section} {wouldConflict && '(Conflict)'}</span>
                                    <span className="text-muted-foreground">{alt.day} {formatTime(alt.startMinutes)}</span>
                                  </span>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {course.day} {formatTime(course.startMinutes)} - {formatTime(course.endMinutes)} | {course.room}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {course.instructorShort}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Sidebar: Course selection */}
      <div className="space-y-3 lg:space-y-4">
        {/* Semester Quick Select */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Quick Start
            </CardTitle>
            <CardDescription>Select a semester to auto-fill courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSemester} onValueChange={handleSemesterSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your semester..." />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map(sem => (
                  <SelectItem key={sem.id} value={String(sem.id)}>
                    <span className="flex items-center gap-2">
                      <span>{sem.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ({sem.courses.length} courses)
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedSemester && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Courses in this semester:
                </p>
                <div className="flex flex-wrap gap-1">
                  {SEMESTERS.find(s => s.id === parseInt(selectedSemester))?.courses.map(code => (
                    <Badge key={code} variant="outline" className="text-xs">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add Courses</CardTitle>
            <CardDescription>Search and select courses to add</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by code, instructor, room..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-[500px] pr-4">
              {groupedCourses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    {searchQuery ? 'No courses match your search' : 'All courses have been added'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groupedCourses.map(([code, sections]) => (
                    <Collapsible 
                      key={code}
                      open={expandedCourses.has(code)}
                      onOpenChange={() => toggleExpanded(code)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between h-auto py-2 px-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{code}</span>
                            <Badge variant="outline" className="text-xs">
                              {sections.length} section{sections.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedCourses.has(code) ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-1">
                        <div className="space-y-1 pt-1 pb-2">
                          {sections.map(section => {
                            const wouldConflict = getConflictingCourses(selectedCourses, section).length > 0
                            return (
                              <button
                                key={section.id}
                                onClick={() => handleAddCourse(section)}
                                className={`w-full text-left p-2 rounded-md border transition-colors ${
                                  wouldConflict 
                                    ? 'border-destructive/50 bg-destructive/5 hover:bg-destructive/10' 
                                    : 'border-border hover:bg-accent'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">
                                    Section {section.section}
                                  </span>
                                  {wouldConflict ? (
                                    <Badge variant="destructive" className="text-xs">
                                      Conflict
                                    </Badge>
                                  ) : (
                                    <Plus className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                  <span>{section.day}</span>
                                  <span>{formatTime(section.startMinutes)} - {formatTime(section.endMinutes)}</span>
                                  <span>{section.room}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  {section.instructorShort}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => handleExport('pdf')}
            disabled={selectedCourses.length === 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button 
            className="flex-1"
            variant="secondary"
            onClick={() => handleExport('ics')}
            disabled={selectedCourses.length === 0}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>
    </div>
  )
}
