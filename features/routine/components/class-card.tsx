"use client"

import { memo } from "react"
import type { ClassEntry, TimetablePosition } from "@/types"
import { SEMESTER_COLORS } from "@/constants/semesters"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { isCurrentlyOngoing } from "../lib/timetable-engine"

interface ClassCardProps {
  entry: ClassEntry
  position: TimetablePosition
  dayIndex: number
  dayWidth: number
  isSelected?: boolean
  hasConflict?: boolean
  onClick?: () => void
}

export const ClassCard = memo(function ClassCard({
  entry,
  position,
  dayIndex,
  dayWidth,
  isSelected = false,
  hasConflict = false,
  onClick,
}: ClassCardProps) {
  const colors = SEMESTER_COLORS[entry.semester] || SEMESTER_COLORS[1]
  const isOngoing = isCurrentlyOngoing(entry)
  const isLab = entry.type === "Lab"

  // Calculate left position within day column
  const left = dayIndex * dayWidth + (position.leftOffset / 100) * dayWidth
  const width = (position.width / 100) * dayWidth

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "absolute rounded-md border p-1.5 text-left transition-all",
              "hover:shadow-md hover:z-40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
              "overflow-hidden cursor-pointer",
              colors.bg,
              colors.border,
              isSelected && "ring-2 ring-primary ring-offset-1",
              hasConflict && "ring-2 ring-destructive ring-offset-1 animate-pulse",
              isOngoing && "ring-2 ring-accent shadow-lg",
              isLab && "border-dashed"
            )}
            style={{
              top: position.top,
              height: Math.max(position.height - 2, 30), // Minimum height
              left: `${left}%`,
              width: `calc(${width}% - 4px)`,
              zIndex: position.zIndex,
            }}
          >
            <div className="flex flex-col h-full min-w-0">
              {/* Course code */}
              <span className={cn(
                "font-semibold text-xs leading-tight truncate",
                colors.text
              )}>
                {entry.course}
              </span>

              {/* Only show more details if there's space */}
              {position.height > 50 && (
                <>
                  {/* Room */}
                  <span className="text-[10px] text-muted-foreground truncate">
                    {entry.room}
                  </span>

                  {/* Instructor */}
                  {position.height > 70 && (
                    <span className="text-[10px] text-muted-foreground truncate">
                      {entry.instructorShort}
                    </span>
                  )}
                </>
              )}

              {/* Type badge for labs */}
              {isLab && position.height > 40 && (
                <span className="mt-auto text-[9px] font-medium text-muted-foreground">
                  Lab
                </span>
              )}
            </div>
          </button>
        </TooltipTrigger>
        
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-1.5">
            <div>
              <p className="font-semibold">{entry.course}</p>
              <p className="text-xs text-muted-foreground">{entry.type} Class</p>
            </div>
            
            <div className="text-sm space-y-0.5">
              <p>
                <span className="text-muted-foreground">Time:</span>{" "}
                {entry.startTimeDisplay} - {entry.endTimeDisplay}
              </p>
              <p>
                <span className="text-muted-foreground">Room:</span> {entry.room}
              </p>
              <p>
                <span className="text-muted-foreground">Instructor:</span>{" "}
                {entry.instructorFull}
              </p>
              <p>
                <span className="text-muted-foreground">Semester:</span>{" "}
                {entry.semester}
              </p>
            </div>

            {isOngoing && (
              <p className="text-xs text-accent font-medium">Currently ongoing</p>
            )}
            
            {hasConflict && (
              <p className="text-xs text-destructive font-medium">
                Time conflict detected
              </p>
            )}
            
            {isSelected && (
              <p className="text-xs text-primary font-medium">
                Click to remove from selection
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
