"use client"

import Link from "next/link"
import { ChevronRight, Tags, CreditCard, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

function SettingRow({
  href,
  icon: Icon,
  label,
  description,
  iconClass,
}: {
  href: string
  icon: React.ElementType
  label: string
  description?: string
  iconClass?: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors active:bg-muted"
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconClass ?? "bg-primary/10 text-primary")}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </Link>
  )
}

const THEMES = [
  { value: "light",  label: "Claro",   icon: Sun },
  { value: "dark",   label: "Oscuro",  icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Configuración</h1>
      </div>

      {/* Datos */}
      <section>
        <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Datos
        </p>
        <div className="rounded-xl border bg-card divide-y divide-border overflow-hidden">
          <SettingRow
            href="/cards"
            icon={CreditCard}
            label="Tarjetas"
            description="Administrá tus tarjetas de crédito y débito"
            iconClass="bg-blue-500/10 text-blue-500"
          />
          <SettingRow
            href="/categories"
            icon={Tags}
            label="Categorías"
            description="Categorizá y organizá tus gastos"
            iconClass="bg-violet-500/10 text-violet-500"
          />
        </div>
      </section>

      {/* Apariencia */}
      <section>
        <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Apariencia
        </p>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm font-medium mb-3">Tema</p>
          {mounted && (
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg py-3 px-2 text-xs font-medium transition-colors border",
                    theme === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground pt-2">Pluto v0.1</p>
    </div>
  )
}
