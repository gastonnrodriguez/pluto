"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react"
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



type ExpenseFormProps = {
  totalIngresos: number
  totalEgresos: number
  saldo: number
}

// Datos de ejemplo - en tu app real vendrían de tu base de datos
const types = [
  { id: "1", name: "Ingreso" },
  { id: "2", name: "Egreso" },
]

const currencies = [
  { id: "1", name: "UYU" },
  { id: "2", name: "USD" },
]

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


export function ExpenseForm({
  totalIngresos,
  totalEgresos,
  saldo,
}: ExpenseFormProps) {
  const [selectedType, setSelectedType] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("")
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
      selectedType,
      selectedCurrency,
      amount,
      description,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      card: selectedCard,
      date, 
    })

    // Reset form
    setSelectedType("")
    setSelectedCurrency("")
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

 

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const now = new Date();
  const mesActual = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;


  // Asegura que los valores sean números
  const ingresos = typeof totalIngresos === "number" && !isNaN(totalIngresos) ? totalIngresos : 0;
  const egresos = typeof totalEgresos === "number" && !isNaN(totalEgresos) ? totalEgresos : 0;
  const balance = typeof saldo === "number" && !isNaN(saldo) ? saldo : 0;

  return (
    <Card className="w-full max-w-xl mx-auto border-0 shadow-lg sm:border sm:shadow-sm">
      {/* Header Resumen Financiero */}
      <div className="text-center mb-4 mt-6">
        <h1 className="text-2xl font-bold text-gray-900">Resumen Financiero</h1>
        <p className="text-sm text-gray-600">{mesActual}</p>
      </div>
      {/* Indicadores arriba */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 pb-4">
        {/* Ingresos */}
        <Card className="bg-green-50 border border-green-200 shadow-none">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-700 font-semibold">Ingresos</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-800">{ingresos.toLocaleString("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 1, minimumFractionDigits: 0 })}</div>
            <div className="text-xs text-green-600 mt-1">+12% vs mes anterior</div>
          </CardContent>
        </Card>
        {/* Gastos */}
        <Card className="bg-red-50 border border-red-200 shadow-none">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-700 font-semibold">Gastos</span>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-800">{egresos.toLocaleString("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 1, minimumFractionDigits: 0 })}</div>
            <div className="text-xs text-red-600 mt-1">+8% vs mes anterior</div>
          </CardContent>
        </Card>
        {/* Balance */}
        <Card className="bg-blue-50 border border-blue-200 shadow-none">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-700 font-semibold">Balance</span>
              <Wallet className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-800">{balance.toLocaleString("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 1, minimumFractionDigits: 0 })}</div>
            <div className="text-xs text-blue-600 mt-1">{balance >= 0 ? "Saldo positivo" : "Saldo negativo"}</div>
          </CardContent>
        </Card>
      </div>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
          Agregar transacción
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Registra un nuevo gasto de forma rápida y sencilla
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Grid para Tipo y Moneda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-medium">Tipo *</Label>
              <Select value={selectedType} onValueChange={setSelectedType} required>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Moneda */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-medium">Moneda *</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency} required>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Monto *
            </Label>
            <div className="relative w-full">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-11 text-base w-full"
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
              placeholder="Anotá porque despues no te acordas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none text-base w-full"
            />
          </div>
          {/* Categoría */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categoría *</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
              <SelectTrigger className="h-11 w-full">
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
                <SelectTrigger className="h-11 w-full">
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
              <SelectTrigger className="h-11 w-full">
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
            Agregar transacción
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
