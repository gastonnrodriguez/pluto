import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import React, { useState, useEffect } from "react"

export type SubcategoryFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: { name: string; description: string; category: string }
  onSave: (data: { name: string; description: string; category: string }) => void
  isEdit?: boolean
}

const categories = [
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Salud"
]

export function DialogFormSubcategory({ open, onOpenChange, initialData, onSave, isEdit }: SubcategoryFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(categories[0])

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setCategory(initialData.category)
    }
    if (open && !initialData) {
      setName("")
      setDescription("")
      setCategory(categories[0])
    }
  }, [open, initialData])

  const handleSubmit = () => {
    const subcategory = { name, description, category }
    console.log("Subcategoría ingresada:", subcategory)
    return subcategory
  }

  const handleSave = () => {
    if (!name || !category) return
    const subcategory = handleSubmit()
    onSave(subcategory)
    setName("")
    setDescription("")
    setCategory(categories[0])
    onOpenChange(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar Subcategoría" : "Nueva Subcategoría"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 pt-2">
        <div>
          <Label className="pb-2">Nombre *</Label>
          <Input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            required
          />
        </div>
        <div>
          <Label className="pb-2">Descripción</Label>
          <Input
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={48}
          />
        </div>
        <div>
          <Label className="pb-2">Categoría *</Label>
          <select
            className="w-full border rounded px-2 py-1"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <DialogFooter className="mt-3">
        <Button onClick={handleSave} disabled={!name || !category}>
          {isEdit ? "Guardar Cambios" : "Guardar"}
        </Button>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
      </DialogFooter>
    </>
  )
}
