"use client"

import { useEffect, useState } from "react"
import { Plus, CreditCard, Pencil, Trash2, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Card = {
  id: number
  name: string
  bank: string
  type: string
  number: string | null
  limit: number | null
  balance: number
  closeDay: number | null
  dueDay: number | null
  isActive: boolean
}

const TYPE_COLORS: Record<string, string> = {
  crédito:  "bg-blue-100 text-blue-700 border-blue-200",
  débito:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  prepago:  "bg-amber-100 text-amber-700 border-amber-200",
}

const TYPE_BG: Record<string, string> = {
  crédito: "from-blue-600 to-blue-900",
  débito:  "from-slate-600 to-slate-800",
  prepago: "from-indigo-500 to-indigo-800",
}

const EMPTY_FORM = {
  name: "", bank: "", type: "crédito",
  number: "", limit: "", closeDay: "", dueDay: "",
}

export default function CardsPage() {
  const [cards, setCards]       = useState<Card[]>([])
  const [loading, setLoading]   = useState(true)
  const [dialogOpen, setDialog] = useState(false)
  const [editing, setEditing]   = useState<Card | null>(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    fetch("/api/credit-cards")
      .then((r) => r.json())
      .then(setCards)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialog(true)
  }

  const openEdit = (card: Card) => {
    setEditing(card)
    setForm({
      name: card.name, bank: card.bank, type: card.type,
      number:   card.number   ?? "",
      limit:    card.limit    != null ? String(card.limit)    : "",
      closeDay: card.closeDay != null ? String(card.closeDay) : "",
      dueDay:   card.dueDay   != null ? String(card.dueDay)   : "",
    })
    setDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const body = {
      name:     form.name,
      bank:     form.bank,
      type:     form.type,
      number:   form.number   || null,
      limit:    form.limit    ? parseFloat(form.limit)    : null,
      closeDay: form.closeDay ? parseInt(form.closeDay)   : null,
      dueDay:   form.dueDay   ? parseInt(form.dueDay)     : null,
    }
    try {
      if (editing) {
        await fetch(`/api/credit-cards/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      } else {
        await fetch("/api/credit-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      }
      setDialog(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta tarjeta?")) return
    setDeleting(id)
    try {
      await fetch(`/api/credit-cards/${id}`, { method: "DELETE" })
      setCards((prev) => prev.filter((c) => c.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Tarjetas</h1>
          <p className="text-xs text-muted-foreground">{cards.length} tarjeta{cards.length !== 1 ? "s" : ""}</p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="mr-1.5 h-4 w-4" />
          Agregar
        </Button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">Sin tarjetas</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Agregá tu primera tarjeta</p>
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-1.5 h-4 w-4" />
            Agregar tarjeta
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "relative rounded-2xl p-5 text-white overflow-hidden bg-gradient-to-br",
                TYPE_BG[card.type] ?? "from-slate-600 to-slate-800",
                !card.isActive && "opacity-60"
              )}
            >
              {/* Decoración */}
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -right-2 -bottom-8 h-32 w-32 rounded-full bg-white/5" />

              {/* Contenido */}
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-base">{card.name}</p>
                    <p className="text-xs opacity-70">{card.bank}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(card)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      disabled={deleting === card.id}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-red-400/40 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs opacity-60 mb-0.5">Número</p>
                    <p className="text-sm font-mono tracking-widest">
                      {card.number ? `•••• ${card.number}` : "————"}
                    </p>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 text-xs capitalize">
                    {card.type}
                  </Badge>
                </div>

                {/* Cierre / Vencimiento */}
                {(card.closeDay || card.dueDay) && (
                  <div className="flex gap-4 mt-3 pt-3 border-t border-white/20">
                    {card.closeDay && (
                      <div className="flex items-center gap-1 text-xs opacity-75">
                        <CalendarDays className="h-3 w-3" />
                        Cierre: día {card.closeDay}
                      </div>
                    )}
                    {card.dueDay && (
                      <div className="flex items-center gap-1 text-xs opacity-75">
                        <CalendarDays className="h-3 w-3" />
                        Vence: día {card.dueDay}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog agregar / editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tarjeta" : "Nueva tarjeta"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input
                placeholder="Visa, Mastercard..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Banco *</Label>
              <Input
                placeholder="Santander, BROU..."
                value={form.bank}
                onChange={(e) => setForm({ ...form, bank: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crédito">Crédito</SelectItem>
                  <SelectItem value="débito">Débito</SelectItem>
                  <SelectItem value="prepago">Prepago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Últimos 4 dígitos</Label>
                <Input
                  placeholder="1234"
                  maxLength={4}
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Límite</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Día de cierre</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="20"
                  value={form.closeDay}
                  onChange={(e) => setForm({ ...form, closeDay: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Día de vencimiento</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="10"
                  value={form.dueDay}
                  onChange={(e) => setForm({ ...form, dueDay: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="w-full mt-1"
              disabled={!form.name || !form.bank || saving}
              onClick={handleSave}
            >
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar tarjeta"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
