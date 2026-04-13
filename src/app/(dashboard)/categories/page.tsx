"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Subcategory = { id: number; name: string }
type Category    = { id: number; name: string; subcategories: Subcategory[] }

export default function CategoriesPage() {
  const [categories, setCategories]   = useState<Category[]>([])
  const [loading, setLoading]         = useState(true)
  const [expanded, setExpanded]       = useState<number | null>(null)

  // inline edit state
  const [editingCat, setEditingCat]   = useState<number | null>(null)
  const [editingCatName, setEditingCatName] = useState("")

  const [editingSub, setEditingSub]   = useState<number | null>(null)
  const [editingSubName, setEditingSubName] = useState("")

  // new item state
  const [newCatName, setNewCatName]   = useState("")
  const [addingCat, setAddingCat]     = useState(false)
  const [addingSubFor, setAddingSubFor] = useState<number | null>(null)
  const [newSubName, setNewSubName]   = useState("")

  const load = async () => {
    const res  = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // --- Category actions ---
  const saveNewCat = async () => {
    const name = newCatName.trim()
    if (!name) return
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: "" }),
    })
    setNewCatName("")
    setAddingCat(false)
    await load()
  }

  const saveCatEdit = async (id: number) => {
    const name = editingCatName.trim()
    if (!name) return
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    setEditingCat(null)
    await load()
  }

  const deleteCat = async (id: number) => {
    if (!confirm("¿Eliminar categoría y todas sus subcategorías?")) return
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    if (expanded === id) setExpanded(null)
    await load()
  }

  // --- Subcategory actions ---
  const saveNewSub = async (categoryId: number) => {
    const name = newSubName.trim()
    if (!name) return
    await fetch("/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: "", categoryId }),
    })
    setNewSubName("")
    setAddingSubFor(null)
    await load()
  }

  const saveSubEdit = async (id: number) => {
    const name = editingSubName.trim()
    if (!name) return
    await fetch(`/api/subcategories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    setEditingSub(null)
    await load()
  }

  const deleteSub = async (id: number) => {
    if (!confirm("¿Eliminar subcategoría?")) return
    await fetch(`/api/subcategories/${id}`, { method: "DELETE" })
    await load()
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Categorías</h1>
          <p className="text-xs text-muted-foreground">{categories.length} categorías</p>
        </div>
        <Button size="sm" onClick={() => { setAddingCat(true); setExpanded(null) }}>
          <Plus className="h-4 w-4 mr-1.5" />Nueva
        </Button>
      </div>

      {/* Nueva categoría inline */}
      {addingCat && (
        <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5">
          <Input
            autoFocus
            placeholder="Nombre de la categoría"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") saveNewCat(); if (e.key === "Escape") setAddingCat(false) }}
            className="h-8 text-sm border-0 bg-transparent p-0 focus-visible:ring-0"
          />
          <button onClick={saveNewCat} className="text-primary"><Check className="h-4 w-4" /></button>
          <button onClick={() => { setAddingCat(false); setNewCatName("") }} className="text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-xl border bg-card overflow-hidden">
            {/* Fila categoría */}
            <div className="flex items-center gap-3 px-3 py-3">
              {/* Chevron expand */}
              <button
                onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                className="text-muted-foreground shrink-0"
              >
                {expanded === cat.id
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />}
              </button>

              {/* Nombre editable inline */}
              {editingCat === cat.id ? (
                <Input
                  autoFocus
                  value={editingCatName}
                  onChange={e => setEditingCatName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveCatEdit(cat.id); if (e.key === "Escape") setEditingCat(null) }}
                  className="h-7 text-sm flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 font-medium"
                />
              ) : (
                <button
                  className="flex-1 text-left text-sm font-medium"
                  onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                >
                  {cat.name}
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    {cat.subcategories.length} subcats
                  </span>
                </button>
              )}

              {/* Acciones categoría */}
              <div className="flex items-center gap-0.5 shrink-0">
                {editingCat === cat.id ? (
                  <>
                    <button onClick={() => saveCatEdit(cat.id)} className="p-1.5 text-primary"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setEditingCat(null)} className="p-1.5 text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingCat(cat.id); setEditingCatName(cat.name) }}
                      className="p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCat(cat.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Subcategorías expandidas */}
            {expanded === cat.id && (
              <div className="border-t bg-muted/30 px-3 py-2 space-y-1">
                {cat.subcategories.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 py-1.5">
                    {editingSub === sub.id ? (
                      <>
                        <Input
                          autoFocus
                          value={editingSubName}
                          onChange={e => setEditingSubName(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") saveSubEdit(sub.id); if (e.key === "Escape") setEditingSub(null) }}
                          className="h-7 text-sm flex-1 bg-background border-border"
                        />
                        <button onClick={() => saveSubEdit(sub.id)} className="text-primary shrink-0"><Check className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setEditingSub(null)} className="text-muted-foreground shrink-0"><X className="h-3.5 w-3.5" /></button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-muted-foreground pl-1">{sub.name}</span>
                        <button
                          onClick={() => { setEditingSub(sub.id); setEditingSubName(sub.name) }}
                          className="p-1 text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteSub(sub.id)}
                          className="p-1 text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {/* Nueva subcategoría inline */}
                {addingSubFor === cat.id ? (
                  <div className="flex items-center gap-2 pt-1">
                    <Input
                      autoFocus
                      placeholder="Nueva subcategoría"
                      value={newSubName}
                      onChange={e => setNewSubName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveNewSub(cat.id); if (e.key === "Escape") { setAddingSubFor(null); setNewSubName("") } }}
                      className="h-7 text-sm bg-background border-border"
                    />
                    <button onClick={() => saveNewSub(cat.id)} className="text-primary shrink-0"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { setAddingSubFor(null); setNewSubName("") }} className="text-muted-foreground shrink-0"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddingSubFor(cat.id); setNewSubName("") }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs text-primary mt-1 py-1 pl-1",
                      "hover:underline"
                    )}
                  >
                    <Plus className="h-3 w-3" />Agregar subcategoría
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No hay categorías. Creá la primera.
          </div>
        )}
      </div>
    </div>
  )
}
