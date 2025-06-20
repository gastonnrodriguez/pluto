import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, PieChart, TrendingDown, TrendingUp, Download, Calendar } from "lucide-react"

// Datos de ejemplo
const monthlyData = [
  { month: "Enero", income: 3500, expenses: 2800, savings: 700 },
  { month: "Febrero", income: 3500, expenses: 3200, savings: 300 },
  { month: "Marzo", income: 3500, expenses: 2600, savings: 900 },
  { month: "Abril", income: 3500, expenses: 3100, savings: 400 },
  { month: "Mayo", income: 3500, expenses: 2900, savings: 600 },
  { month: "Junio", income: 3500, expenses: 3300, savings: 200 },
]

const categoryExpenses = [
  { category: "Alimentación", amount: 1200, percentage: 35, color: "bg-green-500" },
  { category: "Transporte", amount: 800, percentage: 23, color: "bg-blue-500" },
  { category: "Entretenimiento", amount: 400, percentage: 12, color: "bg-purple-500" },
  { category: "Servicios", amount: 600, percentage: 18, color: "bg-orange-500" },
  { category: "Salud", amount: 300, percentage: 9, color: "bg-red-500" },
  { category: "Otros", amount: 100, percentage: 3, color: "bg-gray-500" },
]

export default function AnalyticsPage() {
  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  const expenseChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">Analiza tus patrones de gasto y ahorro</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mes</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.expenses.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {expenseChange > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
              )}
              {Math.abs(expenseChange).toFixed(1)}% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorros del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.savings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {((currentMonth.savings / currentMonth.income) * 100).toFixed(1)}% de tus ingresos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(currentMonth.expenses / 30).toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">Gasto promedio por día</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoría Principal</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryExpenses[0].category}</div>
            <div className="text-xs text-muted-foreground">
              ${categoryExpenses[0].amount} ({categoryExpenses[0].percentage}%)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gastos por categoría */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gastos por Categoría
            </CardTitle>
            <CardDescription>Distribución de gastos del mes actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryExpenses.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">${item.amount}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tendencia mensual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tendencia Mensual
            </CardTitle>
            <CardDescription>Evolución de gastos y ahorros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyData.slice(-4).map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{month.month}</span>
                  <span className="text-muted-foreground">${month.expenses}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${(month.expenses / 3500) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
