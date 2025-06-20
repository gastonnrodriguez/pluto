import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"

// Datos de ejemplo
const categories = [
  { id: "1", name: "Alimentación", description: "Gastos relacionados con comida", count: 45 },
  { id: "2", name: "Transporte", description: "Gastos de movilidad", count: 23 },
  { id: "3", name: "Entretenimiento", description: "Ocio y diversión", count: 12 },
  { id: "4", name: "Salud", description: "Gastos médicos y farmacia", count: 8 },
  { id: "5", name: "Servicios", description: "Servicios básicos del hogar", count: 15 },
]

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">Gestiona las categorías para organizar tus gastos</p>
        </div>
        <Button className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Grid de categorías */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">{category.description}</CardDescription>
              <div className="text-sm text-muted-foreground">{category.count} gastos registrados</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
