"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogFormSubcategory } from "@/components/dialog-form-subcategory"

interface Subcategory {
  id: number
  name: string
  description: string
  category: {
    id: number
    name: string
  }
}

interface Category {
  id: number
  name: string
  description: string
}

export default function SubcategoriesTable() {
  const [search, setSearch] = useState("")
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)

  const loadSubcategories = async () => {
    const res = await fetch("/api/subcategories")
    const data = await res.json()
    setSubcategories(data)
  }

  const loadCategories = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => {
    loadSubcategories()
    loadCategories()
  }, [])

  const handleAdd = () => {
    setEditingSubcategory(null)
    setDialogOpen(true)
  }

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory)
    setDialogOpen(true)
  }

  const handleSave = async (data: { name: string; description: string; categoryId: number }) => {
    if (editingSubcategory) {
      await fetch(`/api/subcategories/${editingSubcategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } else {
      await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    }
    setDialogOpen(false)
    setEditingSubcategory(null)
    await loadSubcategories()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Eliminar subcategoría?")) {
      await fetch(`/api/subcategories/${id}`, { method: "DELETE" })
      await loadSubcategories()
    }
  }

  const filtered = subcategories.filter((sub) => {
    const catName = sub.category?.name || ""
    return (
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.description.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subcategorías</h1>
          <p className="text-muted-foreground">
            Gestiona las subcategorías para una mejor organización
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Subcategoría
        </Button>
      </div>

      <div className="flex items-center gap-3 max-w-sm">
        <Input
          placeholder="Buscar subcategoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow max-w-full">
        <table className="min-w-full bg-background text-sm border border-muted">
          <thead>
            <tr>
              <th className="px-4 py-3 border-b text-left">Nombre</th>
              <th className="px-4 py-3 border-b text-left hidden sm:table-cell">Descripción</th>
              <th className="px-4 py-3 border-b text-left hidden sm:table-cell">Categoría</th>
              <th className="px-4 py-3 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay subcategorías que coincidan.
                </td>
              </tr>
            )}
            {filtered.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-muted/60">
                <td className="px-4 py-3 truncate max-w-[120px]">{sub.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell truncate max-w-[200px]">
                  {sub.description}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {sub.category?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(sub.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogFormSubcategory
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            categories={categories}
            initialData={editingSubcategory ? {
              name: editingSubcategory.name,
              description: editingSubcategory.description,
              categoryId: editingSubcategory.category.id,
            } : undefined}
            onSave={handleSave}
            isEdit={!!editingSubcategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
