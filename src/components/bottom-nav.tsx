"use client"

import {
  Home,
  Receipt,
  Plus,
  TrendingUp,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Inicio",   url: "/",          icon: Home },
  { title: "Gastos",   url: "/expenses",  icon: Receipt },
  { title: "Análisis", url: "/analytics", icon: TrendingUp },
  { title: "Ajustes",  url: "/settings",  icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()
  const router   = useRouter()

  // 2 items left of FAB, 2 items right
  const leftItems  = navItems.slice(0, 2)
  const rightItems = navItems.slice(2)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-sm sm:hidden">
      {leftItems.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors",
            pathname === item.url ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      ))}

      {/* FAB */}
      <button
        onClick={() => router.push("/expenses/new")}
        className="flex -mt-5 h-14 w-14 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform active:scale-95"
        aria-label="Agregar gasto"
      >
        <Plus className="h-6 w-6" />
      </button>

      {rightItems.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors",
            pathname === item.url ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
