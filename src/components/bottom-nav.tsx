"use client"

import { useState } from "react"
import {
  Home,
  Receipt,
  Plus,
  TrendingUp,
  MoreHorizontal,
  Tags,
  CreditCard,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const navItems = [
  { title: "Inicio",   url: "/",          icon: Home },
  { title: "Gastos",   url: "/expenses",  icon: Receipt },
  { title: "Análisis", url: "/analytics", icon: TrendingUp },
]

const moreItems = [
  { title: "Tarjetas",      url: "/cards",      icon: CreditCard },
  { title: "Categorías",    url: "/categories", icon: Tags },
  { title: "Configuración", url: "/settings",   icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)

  // Split navItems: 2 left, FAB center, 1 right + "Más"
  const leftItems  = navItems.slice(0, 2)
  const rightItems = navItems.slice(2)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-sm sm:hidden">
        {/* Left items */}
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

        {/* FAB — Agregar Gasto */}
        <button
          onClick={() => router.push("/expenses/new")}
          className="flex -mt-5 h-14 w-14 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform active:scale-95"
          aria-label="Agregar gasto"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Right items */}
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

        {/* Más */}
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors",
            moreItems.some((i) => i.url === pathname) ? "text-primary" : "text-muted-foreground"
          )}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>Más</span>
        </button>
      </nav>

      {/* Sheet de "Más" */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader className="mb-4">
            <SheetTitle>Gestión</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3">
            {moreItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl p-3 text-xs transition-colors",
                  pathname === item.url
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-center leading-tight">{item.title}</span>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
