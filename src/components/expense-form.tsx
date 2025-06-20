"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Datos de ejemplo - en tu app real vendrían de tu base de datos
const categories = [
  { id: "1", name: "Alimentación" },
  { id: "2", name: "Transporte" },
  { id: "3", name: "Entretenimiento" },
  { id: "4", name: "Salud" },
  { id: "5", name: "Servicios" },
]

const subcategories = {
  "1": [
    { id: "1-1", name: "Supermercado" },
    { id: "1-2", name: "Restaurantes" },
    { id: "1-3", name: "Delivery" },
  ],
  "2": [
    { id: "2-1", name: "Combustible" },
    { id: "2-2", name: "Transporte público" },
    { id: "2-3", name: "Uber/Taxi" },
  ],
  "3": [
    { id: "3-1", name: "Cine" },
    { id: "3-2", name: "Streaming" },
    { id: "3-3", name: "Juegos" },
  ],
}

const cards = [
  { id: "1", name: "Visa **** 1234", type: "Crédito" },
  { id: "2", name: "Mastercard **** 5678", type: "Débito" },
  { id: "3", name: "Efectivo", type: "Efectivo" },
]

export function ExpenseForm() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedCard, setSelectedCard] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí manejarías el envío del formulario
    console.log({
      amount,
      description,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      card: selectedCard,
      date,
    })

    // Reset form
    setAmount("")
    setDescription("")
    setSelectedCategory("")
    setSelectedSubcategory("")
    setSelectedCard("")
    setDate(new Date())
  }

  const availableSubcategories = selectedCategory
    ? subcategories[selectedCategory as keyof typeof subcategories] || []
    : []

  return (
    <Card className="w-full border-0 shadow-lg sm:border sm:shadow-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
          Agregar Gasto
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Registra un nuevo gasto de forma rápida y sencilla
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Monto *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-11 text-base"
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              placeholder="¿En qué gastaste?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none text-base"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categoría *</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategoría */}
          {selectedCategory && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subcategoría</Label>
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona una subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tarjeta/Método de pago */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Método de pago *</Label>
            <Select value={selectedCard} onValueChange={setSelectedCard} required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecciona método de pago" />
              </SelectTrigger>
              <SelectContent>
                {cards.map((card) => (
                  <SelectItem key={card.id} value={card.id}>
                    <div className="flex flex-col">
                      <span>{card.name}</span>
                      <span className="text-xs text-muted-foreground">{card.type}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal h-11", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Botón de envío */}
          <Button type="submit" className="w-full h-12 text-base font-medium mt-6">
            Agregar Gasto
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
