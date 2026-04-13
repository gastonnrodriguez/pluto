"use client"

import { useEffect, useState } from "react"
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"
import { TrendingDown, TrendingUp, Plus, Wallet, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Transaction = {
  id: number; type: string; amount: number; description: string
  currencyCode: string; createdAt: string
  category: { id: number; name: string }
}

const COLORS = [
  "bg-blue-600", "bg-indigo-500", "bg-sky-500",
  "bg-blue-800", "bg-indigo-700", "bg-blue-400",
  "bg-sky-700",  "bg-indigo-400", "bg-blue-500",
]
function catColor(id: number) { return COLORS[id % COLORS.length] }

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency", currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const now        = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd   = endOfMonth(now)

  useEffect(() => {
    fetch("/api/expenses?limit=200")
      .then(r => r.json())
      .then(d => setTransactions(d.transactions ?? []))
      .finally(() => setLoading(false))
  }, [])

  const thisMonth = transactions.filter(t =>
    isWithinInterval(new Date(t.createdAt), { start: monthStart, end: monthEnd })
  )

  const income   = thisMonth.filter(t => t.type === "INCOME").reduce((s,t) => s + t.amount, 0)
  const expense  = thisMonth.filter(t => t.type === "EXPENSE").reduce((s,t) => s + t.amount, 0)
  const balance  = income - expense
  const currency = transactions[0]?.currencyCode ?? "UYU"

  const catMap = new Map<number, { id: number; name: string; total: number }>()
  thisMonth.filter(t => t.type === "EXPENSE").forEach(t => {
    const e = catMap.get(t.category.id)
    if (e) e.total += t.amount
    else catMap.set(t.category.id, { id: t.category.id, name: t.category.name, total: t.amount })
  })
  const topCats = Array.from(catMap.values()).sort((a,b) => b.total - a.total).slice(0, 5)
  const maxCat  = topCats[0]?.total ?? 1

  const recent = transactions.slice(0, 4)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold capitalize">
            {format(now, "MMMM yyyy", { locale: es })}
          </h1>
          <p className="text-xs text-muted-foreground">Resumen del mes</p>
        </div>
        <Button asChild size="sm" className="hidden sm:flex">
          <Link href="/expenses/new"><Plus className="mr-1.5 h-4 w-4" />Agregar</Link>
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-32 w-full rounded-2xl" />
      ) : (
        <div className={cn("rounded-2xl p-5 text-white", balance >= 0 ? "bg-primary" : "bg-rose-500")}>
          <p className="text-sm opacity-75 mb-1">Balance del mes</p>
          <p className="text-3xl font-bold tracking-tight">{fmt(balance, currency)}</p>
          <div className="flex gap-5 mt-3">
            <div>
              <div className="flex items-center gap-1 opacity-70">
                <TrendingUp className="h-3 w-3" /><span className="text-xs">Ingresos</span>
              </div>
              <p className="text-sm font-semibold">+{fmt(income, currency)}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 opacity-70">
                <TrendingDown className="h-3 w-3" /><span className="text-xs">Egresos</span>
              </div>
              <p className="text-sm font-semibold">-{fmt(expense, currency)}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && topCats.length > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold mb-3">Top categorías del mes</h2>
          <div className="space-y-3">
            {topCats.map(cat => (
              <div key={cat.id}>
                <div className="flex justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", catColor(cat.id))} />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <span className="text-muted-foreground">{fmt(cat.total, currency)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", catColor(cat.id))}
                    style={{ width: `${(cat.total / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && recent.length > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Últimas transacciones</h2>
            <Link href="/expenses" className="flex items-center gap-0.5 text-xs text-primary">
              Ver todo <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold", catColor(t.category.id))}>
                  {t.category.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description || t.category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.category.name} · {format(new Date(t.createdAt), "d MMM", { locale: es })}
                  </p>
                </div>
                <span className={cn("text-sm font-semibold shrink-0", t.type === "INCOME" ? "text-emerald-500" : "text-red-500")}>
                  {t.type === "INCOME" ? "+" : "-"}{fmt(t.amount, t.currencyCode)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Wallet className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-semibold text-lg">Bienvenido a Pluto</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Empezá registrando tu primer gasto</p>
          <Button asChild>
            <Link href="/expenses/new"><Plus className="mr-2 h-4 w-4" />Agregar primer gasto</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
