"use client"

import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Trash2, TrendingUp, TrendingDown, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Transaction = {
  id: number; type: string; amount: number; description: string
  currencyCode: string; createdAt: string
  category: { id: number; name: string }
  subcategory: { id: number; name: string } | null
  card: { id: number; name: string; bank: string } | null
}

const CATEGORY_COLORS = [
  "bg-blue-600", "bg-indigo-500", "bg-sky-500",
  "bg-blue-800", "bg-indigo-700", "bg-blue-400",
  "bg-sky-700",  "bg-indigo-400", "bg-blue-500", "bg-sky-600",
]
function categoryColor(id: number) { return CATEGORY_COLORS[id % CATEGORY_COLORS.length] }

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency", currency,
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount)
}

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal]               = useState(0)
  const [loading, setLoading]           = useState(true)
  const [deleting, setDeleting]         = useState<number | null>(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch("/api/expenses?limit=50")
      const data = await res.json()
      setTransactions(data.transactions ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta transacción?")) return
    setDeleting(id)
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      setTransactions(prev => prev.filter(t => t.id !== id))
      setTotal(prev => prev - 1)
    } finally {
      setDeleting(null)
    }
  }

  const totalIncome  = transactions.filter(t => t.type === "INCOME").reduce((s,t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s,t) => s + t.amount, 0)
  const primaryCurrency = transactions[0]?.currencyCode ?? "UYU"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Transacciones</h1>
          <p className="text-xs text-muted-foreground">{total} registros</p>
        </div>
        <Button asChild size="sm">
          <Link href="/expenses/new"><Plus className="mr-1.5 h-4 w-4" />Agregar</Link>
        </Button>
      </div>

      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />Ingresos
            </div>
            <p className="font-semibold text-emerald-500">
              {formatAmount(totalIncome, primaryCurrency)}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />Egresos
            </div>
            <p className="font-semibold text-red-500">
              {formatAmount(totalExpense, primaryCurrency)}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
              <TrendingDown className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Sin transacciones</p>
            <p className="text-sm text-muted-foreground mt-1">Agregá tu primer gasto</p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/expenses/new"><Plus className="mr-1.5 h-4 w-4" />Agregar gasto</Link>
            </Button>
          </div>
        ) : (
          transactions.map(t => (
            <div key={t.id} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-semibold", categoryColor(t.category.id))}>
                {t.category.name[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight">
                  {t.description || t.category.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground truncate">
                    {t.category.name}{t.subcategory ? ` · ${t.subcategory.name}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(t.createdAt), "d MMM", { locale: es })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={cn("text-sm font-semibold", t.type === "INCOME" ? "text-emerald-500" : "text-red-500")}>
                  {t.type === "INCOME" ? "+" : "-"}{formatAmount(t.amount, t.currencyCode)}
                </span>
                <Badge variant="outline" className="text-[10px] py-0 h-4">{t.currencyCode}</Badge>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deleting === t.id}
                className="ml-1 shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
