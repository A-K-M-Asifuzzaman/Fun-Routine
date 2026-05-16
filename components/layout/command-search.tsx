'use client'

import { useEffect, useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Layers,
  Users,
  Building2,
  Home,
  Search,
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { allClasses, instructors } from '@/data'
import { SEMESTERS } from '@/constants/semesters'
import { ROUTES } from '@/constants/routes'
import { searchCourses, initializeSearch } from '@/lib/search/search-engine'

export function CommandSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize search on mount
  useEffect(() => {
    initializeSearch()
  }, [])

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open])

  const searchResults = useMemo(() => {
    return searchQuery ? searchCourses(searchQuery) : []
  }, [searchQuery])

  const handleSelect = useCallback((callback: () => void) => {
    setOpen(false)
    setSearchQuery('')
    callback()
  }, [])

  const uniqueCourses = useMemo(() => {
    const codes = new Set<string>()
    allClasses.forEach(c => c.courseCode && codes.add(c.courseCode))
    return Array.from(codes).slice(0, 10)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search courses, instructors, rooms..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList className="max-h-96">
        {searchQuery && searchResults.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

        {!searchQuery && (
          <>
            {/* Quick Navigation */}
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => handleSelect(() => router.push(ROUTES.home))}>
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push(ROUTES.routine))}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Routine Explorer</span>
                <CommandShortcut>G R</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push(ROUTES.builder))}>
                <Layers className="mr-2 h-4 w-4" />
                <span>Schedule Builder</span>
                <CommandShortcut>G B</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push(ROUTES.instructors))}>
                <Users className="mr-2 h-4 w-4" />
                <span>Instructors</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push(ROUTES.rooms))}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Rooms</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {/* Semesters */}
            <CommandGroup heading="Semesters">
              {SEMESTERS.slice(0, 5).map((sem) => (
                <CommandItem
                  key={sem.id}
                  onSelect={() => handleSelect(() => router.push(`${ROUTES.routine}?semester=${sem.id}`))}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{sem.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Popular Courses */}
            <CommandGroup heading="Quick Courses">
              {uniqueCourses.map((code) => (
                <CommandItem
                  key={code}
                  onSelect={() => handleSelect(() => router.push(`${ROUTES.builder}?search=${code}`))}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{code}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Sample Instructors */}
            <CommandGroup heading="Instructors">
              {instructors.slice(0, 5).map((inst) => (
                <CommandItem
                  key={inst.short}
                  onSelect={() => handleSelect(() => router.push(`${ROUTES.instructors}?search=${inst.short}`))}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>{inst.full}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{inst.short}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <CommandGroup heading={`${searchResults.length} Results`}>
            {searchResults.map((course) => (
              <CommandItem
                key={course.id}
                onSelect={() => handleSelect(() => router.push(`${ROUTES.builder}?course=${course.id}`))}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{course.courseCode}.{course.section}</span>
                <span className="ml-auto text-xs text-muted-foreground">{course.day}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
