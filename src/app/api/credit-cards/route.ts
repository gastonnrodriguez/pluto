import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const HOUSEHOLD_ID = 1 // TODO: obtener del contexto de sesión

export async function GET() {
  const cards = await prisma.card.findMany({
    where: { householdId: HOUSEHOLD_ID, isActive: true },
    select: {
      id: true, name: true, bank: true, type: true,
      number: true, limit: true, balance: true,
      closeDay: true, dueDay: true, isActive: true,
    },
    orderBy: { name: "asc" },
  })

  // Mapeamos a { id, issuer } para el formulario
  const result = cards.map((c) => ({
    ...c,
    issuer: `${c.name} - ${c.bank}`,
  }))

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const body = await req.json()
  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

  const card = await prisma.card.create({
    data: { ...body, householdId: HOUSEHOLD_ID, userId: user.id },
  })

  return NextResponse.json(card, { status: 201 })
}
