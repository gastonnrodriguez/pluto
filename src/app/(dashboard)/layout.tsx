import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TrendingUp } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-hidden">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden">
          {/* Header compartido - SE MANTIENE SIEMPRE */}
          <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger className="-ml-1 shrink-0" />
              <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />

              <div className="hidden sm:flex items-center gap-2 min-w-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">
                  <TrendingUp className="h-3 w-3" />
                </div>
                <span className="font-semibold text-sm truncate">ExpenseTracker</span>
              </div>
            </div>

            <div className="ml-auto sm:ml-4 min-w-0">
              <DynamicBreadcrumb />
            </div>
          </header>

          {/* AQUÍ SE RENDERIZA EL CONTENIDO QUE CAMBIA */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-2 sm:p-4 lg:p-6 max-w-7xl">
              {children} {/* ← Este children cambia según la ruta */}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
