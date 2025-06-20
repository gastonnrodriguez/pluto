import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

// Datos de ejemplo
const subcategories = [
  { id: "1", name: "Supermercado", description: "Compras en supermercados", category: "Alimentación", count: 28 },
  { id: "2", name: "Restaurantes", description: "Comidas en restaurantes", category: "Alimentación", count: 12 },
  { id: "3", name: "Delivery", description: "Pedidos a domicilio", category: "Alimentación", count: 5 },
  { id: "4", name: "Combustible", description: "Gasolina y diésel", category: "Transporte", count: 15 },
  { id: "5", name: "Transporte público", description: "Bus, metro, taxi", category: "Transporte", count: 8 },
  { id: "6", name: "Cine", description: "Entradas de cine", category: "Entretenimiento", count: 4 },
  { id: "7", name: "Streaming", description: "Netflix, Spotify, etc.", category: "Entretenimiento", count: 3 },
  { id: "8", name: "Farmacia", description: "Medicamentos y productos", category: "Salud", count: 6 },
]

const categoryColors: Record<string, string> = {
  Alimentación: "bg-green-100 text-green-800",
  Transporte: "bg-blue-100 text-blue-800",
  Entretenimiento: "bg-purple-100 text-purple-800",
  Salud: "bg-red-100 text-red-800",
}

export default function SubcategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subcategorías</h1>
          <p className="text-muted-foreground">Gestiona las subcategorías para una mejor organización</p>
        </div>
        <Button className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Subcategoría
        </Button>
      </div>

      {/* Grid de subcategorías */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subcategories.map((subcategory) => (
          <Card key={subcategory.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                  <Badge variant="secondary" className={categoryColors[subcategory.category]}>
                    {subcategory.category}
                  </Badge>
                </div>
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
              <CardDescription className="mb-2">{subcategory.description}</CardDescription>
              <div className="text-sm text-muted-foreground">{subcategory.count} gastos registrados</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
