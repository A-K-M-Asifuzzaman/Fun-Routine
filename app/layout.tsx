import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppProviders } from "@/providers/app-providers"
import "./globals.css"

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "EDU Routine Helper | East Delta University",
    template: "%s | EDU Routine Helper",
  },
  description: "Smart academic scheduling platform for East Delta University. Search courses, build conflict-free routines, and export schedules.",
  keywords: ["East Delta University", "EDU", "routine", "schedule", "timetable", "CSE", "courses"],
  authors: [{ name: "EDU SoSET" }],
  generator: "ASIF Zaman",
  icons: {
    icon: [
      {
        url: "/DotEDU_domain_logo.svg.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/DotEDU_domain_logo.svg.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/public/DotEDU_domain_logo.svg.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/public/DotEDU_domain_logo.svg.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${geist.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AppProviders>
          {children}
        </AppProviders>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
