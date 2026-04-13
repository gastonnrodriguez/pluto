"use client"

import { useEffect, useState } from "react"
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Transaction = {
  id: number; type: string; amount: number
  currencyCode: string; createdAt: string
  category: { id: number; name: string }
}

const COLORS = [
  "bg-blue-600", "bg-indigo-500", "bg-sky-500",
  "bg-blue-800", "bg-indigo-700", "bg-blue-400",
  "bg-sky-700",  "bg-indigo-400",
]
function catColor(id: number) { return COLORS[id % COLORS.length] }

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency", currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/expenses?limit=500")
      .then(r => r.json())
      .then(d => setTransactions(d.transactions ?? []))
      .finally(() => setLoading(false))
  }, [])

  const now      = new Date()
  const currency = transactions[0]?.currencyCode ?? "UYU"

  const months = Array.from({ length: 6 }, (_, i) => {
    const date  = subMonths(now, 5 - i)
    const start = startOfMonth(date)
    const end   = endOfMonth(date)
    const slice = transactions.filter(t =>
      isWithinInterval(new Date(t.createdAt), { start, end })
    )
    const income  = slice.filter(t => t.type === "INCOME").reduce((s,t) => s + t.amount, 0)
    const expense = slice.filter(t => t.type === "EXPENSE").reduce((s,t) => s + t.amount, 0)
    return { label: format(date, "MMM", { locale: es }), income, expense, balance: income - expense }
  })

  const maxBar = Math.max(...months.map(m => Math.max(m.income, m.expense)), 1)

  const thisMonthSlice = transactions.filter(t =>
    isWithinInterval(new Date(t.createdAt), {
      start: startOfMonth(now), end: endOfMonth(now),
    })
  )
  const thisIncome  = thisMonthSlice.filter(t => t.type === "INCOME").reduce((s,t) => s + t.amount, 0)
  const thisExpense = thisMonthSlice.filter(t => t.type === "EXPENSE").reduce((s,t) => s + t.amount, 0)

  const catMap = new Map<number, { id: number; name: string; total: number }>()
  thisMonthSlice.filter(t => t.type === "EXPENSE").forEach(t => {
    const e = catMap.get(t.category.id)
    if (e) e.total += t.amount
    else catMap.set(t.category.id, { id: t.category.id, name: t.category.name, total: t.amount })
  })
  const topCats  = Array.from(catMap.values()).sort((a,b) => b.total - a.total)
  const totalExp = topCats.reduce((s,c) => s + c.total, 0) || 1

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Análisis</h1>
        <p className="text-xs text-muted-foreground capitalize">
          {format(now, "MMMM yyyy", { locale: es })}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />Ingresos
            </div>
            <p className="text-lg font-bold text-emerald-500">{fmt(thisIncome, currency)}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />Egresos
            </div>
            <p className="text-lg font-bold text-red-500">{fmt(thisExpense, currency)}</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold mb-4">Últimos 6 meses</h2>
        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-4 w-full rounded-full" />)}
          </div>
        ) : (
          <div className="space-y-1">
            {months.map(m => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="w-8 text-xs text-muted-foreground capitalize shrink-0">{m.label}</span>
                <div className="flex-1 flex gap-1">
                  <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${(m.income / maxBar) * 100}%` }} />
                  </div>
                  <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-red-500"
                      style={{ width: `${(m.expense / maxBar) * 100}%` }} />
                  </div>
                </div>
                <span className={cn("w-20 text-xs text-right shrink-0 font-medium",
                  m.balance >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {m.balance >= 0 ? "+" : ""}{fmt(m.balance, currency)}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-2 pt-2 border-t">
              <span className="w-8" />
              <div className="flex-1 flex gap-1 text-xs text-muted-foreground">
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />Ingresos
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />Egresos
                </div>
              </div>
              <span className="w-20" />
            </div>
          </div>
        )}
      </div>

      {!loading && topCats.length > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold mb-3">Distribución por categoría</h2>
          <div className="space-y-3">
            {topCats.map(cat => {
              const pct = Math.round((cat.total / totalExp) * 100)
              return (
                <div key={cat.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2.5 w-2.5 rounded-full", catColor(cat.id))} />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{pct}%</span>
                      <span className="font-medium text-foreground">{fmt(cat.total, currency)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", catColor(cat.id))}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="font-medium">Sin datos todavía</p>
          <p className="text-sm text-muted-foreground mt-1">
            Empezá a registrar gastos para ver el análisis
          </p>
        </div>
      )}
    </div>
  )
}
