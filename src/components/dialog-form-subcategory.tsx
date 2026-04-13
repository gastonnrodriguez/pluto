import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import React, { useState, useEffect } from "react"

interface DialogFormSubcategoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    name: string
    description: string
    categoryId: number
  }
  onSave: (data: { name: string; description: string; categoryId: number }) => void
  isEdit?: boolean
  categories: { id: number; name: string }[]
}

export function DialogFormSubcategory({
  open,
  onOpenChange,
  initialData,
  onSave,
  isEdit,
  categories,
}: DialogFormSubcategoryProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number | "">("")

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setCategoryId(initialData.categoryId)
    } else if (open) {
      setName("")
      setDescription("")
      setCategoryId("")
    }
  }, [open, initialData])

  const handleSave = () => {
    if (!name || !categoryId) return
    onSave({ name, description, categoryId: Number(categoryId) })
    setName("")
    setDescription("")
    setCategoryId("")
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
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            required
          />
        </div>
        <div>
          <Label className="pb-2">Descripción</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={48}
          />
        </div>
        <div>
          <Label className="pb-2">Categoría padre *</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full border border-input rounded px-2 py-2 text-sm"
            required
          >
            <option value="">Seleccionar...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DialogFooter className="mt-3">
        <Button onClick={handleSave} disabled={!name || !categoryId}>
          {isEdit ? "Guardar Cambios" : "Guardar"}
        </Button>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
      </DialogFooter>
    </>
  )
}
