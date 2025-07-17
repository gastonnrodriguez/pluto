import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import React, { useState, useEffect } from "react"

type CategoryFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: { name: string; description: string }
  onSave: (data: { name: string; description: string }) => void
  isEdit?: boolean
}

export function DialogFormCategory({ open, onOpenChange, initialData, onSave, isEdit }: CategoryFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // Setea valores iniciales cuando se abre para editar
  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
    }
    if (open && !initialData) {
      setName("")
      setDescription("")
    }
  }, [open, initialData])

  const handleSave = () => {
    if (!name) return
    onSave({ name, description })
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
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
      </div>
      <DialogFooter className="mt-3">
        <Button onClick={handleSave} disabled={!name}>
          {isEdit ? "Guardar Cambios" : "Guardar"}
        </Button>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
      </DialogFooter>
    </>
  )
}
