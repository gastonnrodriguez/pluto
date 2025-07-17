"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogFormCategory } from "@/components/dialog-form-category"

type Category = {
  id: string
  name: string
  description: string  
}

const initialCategories: Category[] = [
  { id: "1", name: "Alimentación", description: "Gastos relacionados con comida"},
  { id: "2", name: "Transporte", description: "Gastos de movilidad" },
  { id: "3", name: "Entretenimiento", description: "Ocio y diversión"},
  { id: "4", name: "Salud", description: "Gastos médicos y farmacia"},
  { id: "5", name: "Servicios", description: "Servicios básicos del hogar"},
]

export default function CategoriesTable() {
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Filtro simple
  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleSave = (data: { name: string; description: string }) => {
    if (editingCategory) {
      // Edita existente
      setCategories(cats =>
        cats.map(c =>
          c.id === editingCategory.id ? { ...c, ...data } : c
        )
      )
    } else {
      // Crea nueva
      setCategories([
        ...categories,
        { id: Date.now().toString(), ...data,}
      ])
    }
    setEditingCategory(null)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Eliminar categoría?")) setCategories(cats => cats.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">Gestiona las categorías para organizar tus gastos</p>
        </div>
        <Button className="sm:w-auto" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>
      {/* Buscador */}
      <div className="flex items-center gap-3 max-w-sm">
        <Input
          placeholder="Buscar categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow max-w-full">
        <table className="min-w-full bg-background text-sm border border-muted">
          <thead>
            <tr>
              <th className="px-4 py-3 border-b font-medium text-left">Nombre</th>
              <th className="px-4 py-3 border-b font-medium text-left hidden sm:table-cell">Descripción</th>              
              <th className="px-4 py-3 border-b font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay categorías que coincidan.
                </td>
              </tr>
            )}
            {filtered.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-muted/60">
                <td className="px-4 py-3 truncate max-w-[120px]">{cat.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell truncate max-w-[200px]">{cat.description}</td>                
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cat)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal reutilizable */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogFormCategory
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            initialData={
              editingCategory
                ? { name: editingCategory.name, description: editingCategory.description }
                : undefined
            }
            onSave={handleSave}
            isEdit={!!editingCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
