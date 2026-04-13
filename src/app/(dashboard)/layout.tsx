import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-hidden">
      <SidebarProvider defaultOpen={false}>
        {/* Sidebar solo visible en desktop */}
        <AppSidebar />

        <SidebarInset className="overflow-x-hidden">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4">
            {/* Trigger solo en desktop */}
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <SidebarTrigger className="-ml-1 shrink-0" />
              <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
            </div>

            {/* Logo / nombre app */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <span className="text-xs font-bold tracking-tight">PL</span>
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">PLUTO</span>
            </div>

            {/* Breadcrumb + toggle */}
            <div className="ml-auto flex items-center gap-1 min-w-0">
              <DynamicBreadcrumb />
              <ThemeToggle />
            </div>
          </header>

          {/* Contenido — pb-20 en mobile para no quedar tapado por bottom nav */}
          <main className="flex-1 overflow-auto pb-20 sm:pb-0">
            <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      {/* Bottom nav solo en mobile */}
      <BottomNav />
    </div>
  )
}
