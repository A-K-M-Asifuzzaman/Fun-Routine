"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/routine": "Routine Explorer",
  "/builder": "Schedule Builder",
  "/scheduler": "Auto Scheduler",
  "/instructors": "Instructor Directory",
  "/rooms": "Room Availability",
  "/compare": "Compare Schedules",
}

export function Header() {
  const pathname = usePathname()
  
  const getPageTitle = () => {
    // Check for exact match first
    if (pageTitles[pathname]) return pageTitles[pathname]
    
    // Check for room detail page
    if (pathname.startsWith("/rooms/")) {
      const room = decodeURIComponent(pathname.split("/")[2] || "")
      return `Room ${room}`
    }
    
    return "Page"
  }

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    
    if (segments.length === 0) return null
    
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/")
            const isLast = index === segments.length - 1
            const title = pageTitles[href] || decodeURIComponent(segment)
            
            return (
              <span key={href} className="flex items-center gap-2">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      {getBreadcrumbs()}
    </header>
  )
}
