import { prisma } from "@/lib/prisma"

export async function seedCategories() {
  const count = await prisma.category.count({ where: { householdId: null } })
  if (count > 0) {
    console.log("⚠️ Categorías globales ya existentes.")
    return
  }

  await prisma.category.createMany({
    data: [
      { name: "Ingresos",    description: "Entradas de dinero" },
      { name: "Alimentos",   description: "Supermercados, almacenes y alimentos" },
      { name: "Auto",        description: "Gastos relacionados al vehículo" },
      { name: "Transporte",  description: "Taxi, Uber, bus y movilidad" },
      { name: "BHU",         description: "Banco Hipotecario del Uruguay" },
      { name: "Salud",       description: "Médicos, emergencias y mutualistas" },
      { name: "Educacion",   description: "Escuela, materiales y uniformes" },
      { name: "Servicios",   description: "UTE, OSE, ANTEL y otros servicios" },
      { name: "Tributos",    description: "Impuestos municipales y nacionales" },
      { name: "Tarjetas",    description: "Pago de resúmenes de tarjetas" },
      { name: "Otros",       description: "Gastos varios no clasificados" },
      { name: "Ocio",        description: "Entretenimiento, salidas y recreación" },
      { name: "Ahorro",      description: "Reservas y ahorro" },
    ],
  })

  console.log("✅ Categorías globales creadas.")
}
