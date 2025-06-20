"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ExpenseForm } from "@/components/expense-form"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        {/* Header con mejor spacing y responsive */}
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Logo y título solo en desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <TrendingUp className="h-3 w-3" />
              </div>
              <span className="font-semibold text-sm">ExpenseTracker</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb className="ml-auto sm:ml-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main content con padding responsive */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
            {/* Layout responsive para el formulario */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ExpenseForm />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
