import { prisma } from "@/lib/prisma"

export async function seedSubcategories() {
  const categories = await prisma.category.findMany({
    where: { householdId: null },
  })

  const byName = (name: string) =>
    categories.find(c => c.name === name)?.id

  const subcategories = [
    // Alimentación
    { name: "Supermercado", description: "Compras mensuales de alimentos", categoryId: byName("Alimentación") },
    { name: "Verdulería", description: "Frutas, verduras y alimentos frescos", categoryId: byName("Alimentación") },   
    { name: "Delivery", description: "Pedidos a domicilio", categoryId: byName("Alimentación") },

    // Transporte
    { name: "Combustible", description: "Gasto en gasolina o diésel", categoryId: byName("Transporte") },
    { name: "Transporte público", description: "Ómnibus, metro, taxi", categoryId: byName("Transporte") },
    { name: "Mantenimiento vehículo", description: "Servicio, repuestos, mecánica", categoryId: byName("Transporte") },
    { name: "Estacionamiento", description: "Parking y garages", categoryId: byName("Transporte") },

    // Entretenimiento
    { name: "Cine", description: "Entradas al cine", categoryId: byName("Entretenimiento") },
    { name: "Streaming", description: "Netflix, Spotify, etc.", categoryId: byName("Entretenimiento") },
    { name: "Eventos", description: "Conciertos, ferias, festivales", categoryId: byName("Entretenimiento") },
    { name: "Salidas con amigos", description: "Bares, boliches, cafés", categoryId: byName("Entretenimiento") },
     { name: "Restaurantes", description: "Cenas fuera de casa", categoryId: byName("Entretenimiento") },

    // Salud
    { name: "Farmacia", description: "Medicamentos y productos", categoryId: byName("Salud") },
    { name: "Consultas médicas", description: "Clínicas, mutualistas, especialistas", categoryId: byName("Salud") },
    { name: "Análisis y estudios", description: "Laboratorio, radiografías, etc.", categoryId: byName("Salud") },
    { name: "Emergencia movil", description: "Gasto mensual de cobertura médica", categoryId: byName("Salud") },

    // Servicios
    { name: "Energía eléctrica", description: "Factura de UTE / luz", categoryId: byName("Servicios") },
    { name: "Agua", description: "Factura de OSE / saneamiento", categoryId: byName("Servicios") },
    { name: "Internet y cable", description: "Gastos mensuales de conexión y TV", categoryId: byName("Servicios") },
    { name: "Teléfono móvil", description: "Plan de celular y recargas", categoryId: byName("Servicios") },
     { name: "Hipoteca", description: "Plan de celular y recargas", categoryId: byName("Servicios") },
  ].filter(s => s.categoryId !== undefined)

  await prisma.subcategory.createMany({ data: subcategories })

  console.log("✅ Subcategorías globales creadas.")
}
