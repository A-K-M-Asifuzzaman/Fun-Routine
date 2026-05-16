// Route path constants

export const ROUTES = {
  home: "/",
  routine: "/routine",
  builder: "/builder",
  scheduler: "/scheduler",
  instructors: "/instructors",
  rooms: "/rooms",
  roomDetail: (room: string) => `/rooms/${encodeURIComponent(room)}`,
  compare: "/compare",
  print: "/print",
} as const

export const NAV_ITEMS = [
  { label: "Home", href: ROUTES.home, icon: "Home" },
  { label: "Routine", href: ROUTES.routine, icon: "Calendar" },
  { label: "Builder", href: ROUTES.builder, icon: "Layers" },
  { label: "Scheduler", href: ROUTES.scheduler, icon: "Wand2" },
  { label: "Instructors", href: ROUTES.instructors, icon: "Users" },
  { label: "Rooms", href: ROUTES.rooms, icon: "Building2" },
] as const
