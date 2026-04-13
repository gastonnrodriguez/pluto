"use client"

import type React from "react"
import { useRef, useState } from "react"
import { CalendarIcon, Camera, DollarSign, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { useCategories } from "@/hooks/use-categories"
import { useSubcategories } from "@/hooks/use-subCategories"
import { useCreditCards } from "@/hooks/use-credit-cards"

const TYPES = [
  { id: "INCOME",  name: "Ingreso" },
  { id: "EXPENSE", name: "Egreso" },
]

const CURRENCIES = [
  { id: "UYU", name: "UYU" },
  { id: "USD", name: "USD" },
]

type AiResult = {
  categoria: string
  subcategoria: string | null
  importe: number | null
  descripcion: string
}

export function ExpenseForm() {
  const [selectedType, setSelectedType]               = useState("")
  const [selectedCurrency, setSelectedCurrency]       = useState("UYU")
  const [selectedCategory, setSelectedCategory]       = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [amount, setAmount]                           = useState("")
  const [description, setDescription]                 = useState("")
  const [date, setDate]                               = useState<Date>(new Date())
  const [selectedCreditCard, setSelectedCreditCard]   = useState("")
  const [submitting, setSubmitting]                   = useState(false)
  const [submitError, setSubmitError]                 = useState("")
  const [submitOk, setSubmitOk]                       = useState(false)

  // Gemini AI
  const [scanningReceipt, setScanningReceipt]         = useState(false)
  const [scanError, setScanError]                     = useState("")
  const fileInputRef                                  = useRef<HTMLInputElement>(null)

  const { categories, loading: loadingCategories }   = useCategories()
  const { subcategories, loading: loadingSubcategories } = useSubcategories(selectedCategory || null)
  const { creditCards, loading: loadingCreditCards } = useCreditCards()

  // --- Gemini receipt scan ---
  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScanError("")
    setScanningReceipt(true)

    try {
      const reader = new FileReader()
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          // Strip the data URL prefix: "data:image/jpeg;base64,..."
          resolve(result.split(",")[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await fetch("/api/ai/analyze-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType: file.type }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Error al analizar la imagen")
      }

      const ai: AiResult = await res.json()
      applyAiResult(ai)
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Error al escanear la factura")
    } finally {
      setScanningReceipt(false)
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const applyAiResult = (ai: AiResult) => {
    // Match category by name (case-insensitive)
    const matchedCat = categories.find(
      (c) => c.name.toLowerCase() === ai.categoria?.toLowerCase()
    )
    if (matchedCat) {
      setSelectedCategory(String(matchedCat.id))
    }

    if (ai.importe !== null && ai.importe !== undefined) {
      setAmount(String(ai.importe))
    }

    if (ai.descripcion) {
      setDescription(ai.descripcion)
    }

    // Subcategory is set after subcategories load — store in state and apply after render
    if (ai.subcategoria) {
      setPendingSubcategory(ai.subcategoria)
    }
  }

  // Pending subcategory from AI (applied once subcategories load)
  const [pendingSubcategory, setPendingSubcategory] = useState<string | null>(null)

  // Apply pending subcategory when subcategories list updates
  const prevSubcategoriesRef = useRef<typeof subcategories>([])
  if (
    pendingSubcategory &&
    subcategories.length > 0 &&
    subcategories !== prevSubcategoriesRef.current
  ) {
    prevSubcategoriesRef.current = subcategories
    const matchedSub = subcategories.find(
      (s) => s.name.toLowerCase() === pendingSubcategory.toLowerCase()
    )
    if (matchedSub) {
      setSelectedSubcategory(String(matchedSub.id))
    }
    setPendingSubcategory(null)
  }

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    setSubmitOk(false)
    setSubmitting(true)

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          currencyCode: selectedCurrency,
          amount: parseFloat(amount),
          description,
          categoryId: Number(selectedCategory),
          subcategoryId: selectedSubcategory ? Number(selectedSubcategory) : null,
          cardId: Number(selectedCreditCard) || null,
          date,
        }),
      })

      if (!res.ok) throw new Error("Error al guardar el gasto")

      setSubmitOk(true)
      resetForm()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedType("")
    setSelectedCurrency("UYU")
    setAmount("")
    setDescription("")
    setSelectedCategory("")
    setSelectedSubcategory("")
    setSelectedCreditCard("")
    setDate(new Date())
    setScanError("")
    setPendingSubcategory(null)
  }

  return (
    <Card className="w-full max-w-xl mx-auto border-0 shadow-lg sm:border sm:shadow-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
          Agregar transacción
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Registrá un nuevo gasto o ingreso
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Tipo y Moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo *</Label>
              <Select value={selectedType} onValueChange={setSelectedType} required>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Seleccioná" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Moneda *</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency} required>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Monto *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
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
            <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Anotá algo para recordar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none text-base"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categoría *</Label>
            {loadingCategories ? (
              <Skeleton className="h-11 w-full rounded-md" />
            ) : (
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val)
                  setSelectedSubcategory("")
                }}
                required
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Seleccioná una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Subcategoría (solo si hay categoría seleccionada) */}
          {selectedCategory && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subcategoría</Label>
              {loadingSubcategories ? (
                <Skeleton className="h-11 w-full rounded-md" />
              ) : (
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Seleccioná una subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={String(sub.id)}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Tarjeta */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tarjeta</Label>
            {loadingCreditCards ? (
              <Skeleton className="h-11 w-full rounded-md" />
            ) : creditCards.length === 0 ? (
              <div className="h-11 flex items-center text-muted-foreground text-sm px-3 border rounded-md bg-muted">
                No hay tarjetas disponibles
              </div>
            ) : (
              <Select value={selectedCreditCard} onValueChange={setSelectedCreditCard}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Seleccioná una tarjeta" />
                </SelectTrigger>
                <SelectContent>
                  {creditCards.map((card) => (
                    <SelectItem key={card.id} value={String(card.id)}>
                      {card.issuer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal h-11", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Seleccioná una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Feedback */}
          {submitError && (
            <p className="text-sm text-red-600">{submitError}</p>
          )}
          {submitOk && (
            <p className="text-sm text-green-600">¡Transacción guardada correctamente!</p>
          )}

          <Button type="submit" className="w-full h-12 text-base font-medium" disabled={submitting}>
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
            ) : (
              "Agregar transacción"
            )}
          </Button>

          {/* Escanear factura con IA — al final, cerca del pulgar */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleScanReceipt}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-2"
              disabled={scanningReceipt || loadingCategories}
              onClick={() => fileInputRef.current?.click()}
            >
              {scanningReceipt ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analizando factura...</>
              ) : (
                <><Camera className="h-4 w-4" /> Escanear factura con IA</>
              )}
            </Button>
            {scanError && (
              <p className="text-sm text-red-600 mt-1">{scanError}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
