import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function seedUser() {
  const username = "gaston"
  const password = "123456"

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    console.log("⚠️ Usuario ya existe:", existing.username)
    return existing
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name: "Gastón",
      username,
      password: hashed,
    },
  })

  console.log("✅ Usuario creado:", user.username)
  return user
}
