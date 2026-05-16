import Link from "next/link"
import {
  Calendar,
  Layers,
  Wand2,
  Users,
  Building2,
  Search,
  Download,
  ArrowRight,
  GraduationCap,
  Clock,
  BookOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { APP_CONFIG } from "@/config/app"
import { dataStats } from "@/data"
import { SEMESTER_COLORS, SEMESTERS } from "@/constants/semesters"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Home",
}

const features = [
  {
    title: "Routine Explorer",
    description: "Browse the complete semester routine with filters by day, semester, and type.",
    icon: Calendar,
    href: "/routine",
    color: "text-blue-500",
  },
  {
    title: "Schedule Builder",
    description: "Build your personalized schedule with automatic conflict detection.",
    icon: Layers,
    href: "/builder",
    color: "text-emerald-500",
  },
  {
    title: "Auto Scheduler",
    description: "Generate optimal schedules based on your preferences automatically.",
    icon: Wand2,
    href: "/scheduler",
    color: "text-amber-500",
    badge: "New",
  },
  {
    title: "Instructor Directory",
    description: "Find instructor schedules and contact information quickly.",
    icon: Users,
    href: "/instructors",
    color: "text-purple-500",
  },
  {
    title: "Room Availability",
    description: "Check room schedules and find available classrooms.",
    icon: Building2,
    href: "/rooms",
    color: "text-rose-500",
  },
  {
    title: "Export & Share",
    description: "Download your schedule as PDF, PNG, or add to calendar.",
    icon: Download,
    href: "/builder",
    color: "text-cyan-500",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container relative px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Badge variant="outline" className="mb-4">
              <GraduationCap className="mr-1 size-3" />
              {APP_CONFIG.semester}
            </Badge>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {APP_CONFIG.university}
              <span className="block text-primary">Routine Helper</span>
            </h1>
            
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              Smart academic scheduling platform for SoSET students. Search courses,
              build conflict-free routines, and never miss a class.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/builder">
                  Start Building
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/routine">
                  <Search className="mr-2 size-4" />
                  Explore Routine
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col items-center rounded-lg border bg-card p-4">
                <span className="text-2xl font-bold text-primary">{dataStats.totalClasses}</span>
                <span className="text-xs text-muted-foreground">Total Classes</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-4">
                <span className="text-2xl font-bold text-primary">{dataStats.semesters.length}</span>
                <span className="text-xs text-muted-foreground">Semesters</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-4">
                <span className="text-2xl font-bold text-primary">{dataStats.totalRooms}</span>
                <span className="text-xs text-muted-foreground">Classrooms</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-4">
                <span className="text-2xl font-bold text-primary">{dataStats.totalInstructors}</span>
                <span className="text-xs text-muted-foreground">Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Everything You Need
          </h2>
          <p className="mt-2 text-muted-foreground">
            Powerful tools to manage your academic schedule
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.href + feature.title} href={feature.href}>
              <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg bg-primary/10 p-2", feature.color)}>
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    {feature.badge && (
                      <Badge className="ml-auto bg-accent text-accent-foreground">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Semester Quick Access */}
      <section className="border-t bg-muted/30">
        <div className="container px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Quick Semester Access
            </h2>
            <p className="mt-2 text-muted-foreground">
              Jump directly to your semester routine
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {SEMESTERS.map((semester) => {
              const colors = SEMESTER_COLORS[semester.number]
              return (
                <Link
                  key={semester.number}
                  href={`/routine?semester=${semester.number}`}
                >
                  <Card className={cn(
                    "group h-full transition-all hover:shadow-md",
                    "border-l-4",
                    colors.border
                  )}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-lg font-bold",
                        colors.bg,
                        colors.text
                      )}>
                        {semester.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{semester.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {semester.studentCount} students
                        </p>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>
            {APP_CONFIG.university} - {APP_CONFIG.school}
          </p>
          <p className="mt-1">
            {APP_CONFIG.semester} | Data Version: {APP_CONFIG.dataVersion}
          </p>
        </div>
      </footer>
    </div>
  )
}
