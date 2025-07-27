import { prisma } from "@/lib/prisma"

export async function seedHousehold(userId: number) {
  const existing = await prisma.userHousehold.findFirst({
    where: { userId },
  })

  if (existing) {
    console.log("⚠️ Household ya vinculado para el usuario.")
    return
  }

  const household = await prisma.household.create({
    data: {
      name: "Mi hogar",
      members: {
        create: {
          userId,
          role: "admin",
        },
      },
    },
  })

  console.log("✅ Household creado y vinculado:", household.name)
}
