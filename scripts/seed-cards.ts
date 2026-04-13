import { prisma } from "@/lib/prisma"

/**
 * Seed para tarjetas (crédito, débito, prepago) asociadas a un usuario y household.
 * Se asume que ya existe al menos un usuario y un household en la base.
 */
export async function seedCards() {
  // Busca el primer usuario y household existentes
  const user = await prisma.user.findFirst()
  const household = await prisma.household.findFirst()
  if (!user || !household) {
    console.error("❌ No se encontró usuario u hogar para asociar las tarjetas.")
    return
  }

  // Evita duplicados
  const existing = await prisma.card.count({ where: { userId: user.id, householdId: household.id } })
  if (existing > 0) {
    console.log("⚠️ Ya existen tarjetas para este usuario y hogar.")
    return
  }

  await prisma.card.createMany({
    data: [
      {
        name: "Visa Classic",
        type: "crédito",
        bank: "Banco República",
        number: "1234",
        limit: 40000,
        balance: 15000,
        closeDay: 10,
        dueDay: 20,
        isActive: true,
        userId: user.id,
        householdId: household.id,
      },
      {
        name: "Brou Recompensas",
        type: "débito",
        bank: "BROU",
        number: "5678",
        balance: 8000,
        isActive: true,
        userId: user.id,
        householdId: household.id,
      },
      {
        name: "Visa Alimentación",
        type: "prepago",
        bank: "Midinero",
        number: "4321",
        balance: 2500,
        isActive: true,
        userId: user.id,
        householdId: household.id,
      },
    ],
  })

  console.log("✅ Tarjetas por defecto creadas para el usuario y hogar.")
}

// Si querés ejecutarlo standalone:
if (require.main === module) {
  seedCards().finally(() => process.exit())
}
