import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Palette, Database, Shield, HelpCircle } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia en ExpenseTracker</p>
      </div>

      <div className="grid gap-6">
        {/* Perfil de usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil de Usuario
            </CardTitle>
            <CardDescription>Información básica de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" placeholder="Tu nombre" defaultValue="Usuario Demo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="tu@email.com" defaultValue="demo@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda predeterminada</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD - Dólar estadounidense</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="cop">COP - Peso colombiano</SelectItem>
                  <SelectItem value="mxn">MXN - Peso mexicano</SelectItem>
                  <SelectItem value="ars">ARS - Peso argentino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Guardar cambios</Button>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de gastos</Label>
                <p className="text-sm text-muted-foreground">Recibe recordatorios para registrar gastos</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de presupuesto</Label>
                <p className="text-sm text-muted-foreground">Notificaciones cuando superes tu presupuesto</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reportes mensuales</Label>
                <p className="text-sm text-muted-foreground">Resumen mensual de tus gastos</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apariencia
            </CardTitle>
            <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Datos y privacidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Datos y Privacidad
            </CardTitle>
            <CardDescription>Controla tus datos y configuración de privacidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-2">
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Exportar datos
              </Button>
              <Button variant="outline">
                <HelpCircle className="mr-2 h-4 w-4" />
                Solicitar soporte
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="destructive" className="w-full">
                Eliminar cuenta
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
