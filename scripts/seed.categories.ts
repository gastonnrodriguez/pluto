import { prisma } from "@/lib/prisma"

export async function seedCategories() {
  const count = await prisma.category.count({ where: { householdId: null } })
  if (count > 0) {
    console.log("⚠️ Categorías globales ya existentes.")
    return
  }

  await prisma.category.createMany({
    data: [
      { name: "Alimentación", description: "Gastos relacionados con comida" },
      { name: "Transporte", description: "Movilidad, transporte público, gasolina" },
      { name: "Entretenimiento", description: "Ocio, salidas, streaming" },
      { name: "Salud", description: "Consultas médicas, farmacia" },
      { name: "Servicios", description: "Agua, luz, internet, etc." },
    ],
  })

  console.log("✅ Categorías globales creadas.")
}
