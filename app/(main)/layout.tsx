import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { CommandSearch } from "@/components/layout/command-search"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
      <CommandSearch />
    </SidebarProvider>
  )
}
