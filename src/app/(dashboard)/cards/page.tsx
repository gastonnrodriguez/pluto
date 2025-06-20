import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CreditCard, Banknote } from "lucide-react"

// Datos de ejemplo
const cards = [
  {
    id: "1",
    name: "Visa Platinum",
    number: "**** **** **** 1234",
    type: "Crédito",
    bank: "Banco Nacional",
    balance: 2500.0,
    limit: 5000.0,
    isActive: true,
  },
  {
    id: "2",
    name: "Mastercard Gold",
    number: "**** **** **** 5678",
    type: "Débito",
    bank: "Banco Popular",
    balance: 1250.75,
    limit: null,
    isActive: true,
  },
  {
    id: "3",
    name: "American Express",
    number: "**** **** **** 9012",
    type: "Crédito",
    bank: "Banco Internacional",
    balance: 750.0,
    limit: 3000.0,
    isActive: false,
  },
  {
    id: "4",
    name: "Efectivo",
    number: "N/A",
    type: "Efectivo",
    bank: "N/A",
    balance: 500.0,
    limit: null,
    isActive: true,
  },
]

const typeColors: Record<string, string> = {
  Crédito: "bg-blue-100 text-blue-800",
  Débito: "bg-green-100 text-green-800",
  Efectivo: "bg-yellow-100 text-yellow-800",
}

export default function CardsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarjetas y Métodos de Pago</h1>
          <p className="text-muted-foreground">Gestiona tus tarjetas y métodos de pago</p>
        </div>
        <Button className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Método
        </Button>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.id} className={!card.isActive ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {card.type === "Efectivo" ? (
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{card.number}</p>
                  </div>
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
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={typeColors[card.type]}>
                  {card.type}
                </Badge>
                {!card.isActive && <Badge variant="destructive">Inactiva</Badge>}
              </div>

              {card.bank !== "N/A" && <p className="text-sm text-muted-foreground">{card.bank}</p>}

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Saldo disponible:</span>
                  <span className="font-medium">${card.balance.toFixed(2)}</span>
                </div>
                {card.limit && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Límite:</span>
                    <span>${card.limit.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
