import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const HOUSEHOLD_ID = 1 // TODO: obtener del contexto de sesión

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 20)

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { householdId: HOUSEHOLD_ID },
      include: { category: true, subcategory: true, card: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where: { householdId: HOUSEHOLD_ID } }),
  ])

  return NextResponse.json({ transactions, total, page, limit })
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("[POST /api/expenses] payload:", JSON.stringify(data))

    if (!data.type)       return NextResponse.json({ error: "type es requerido" }, { status: 400 })
    if (!data.categoryId) return NextResponse.json({ error: "categoryId es requerido" }, { status: 400 })
    if (!data.amount)     return NextResponse.json({ error: "amount es requerido" }, { status: 400 })

    // Garantizar que la moneda existe (Currency es FK requerida)
    await prisma.currency.upsert({
      where:  { code: data.currencyCode },
      create: { code: data.currencyCode, description: data.currencyCode },
      update: {},
    })

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description ?? "",
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId ?? null,
        currencyCode: data.currencyCode,
        paymentMethod: data.paymentMethod ?? null,
        cardId: data.cardId ?? null,
        householdId: HOUSEHOLD_ID,
        createdAt: data.date ? new Date(data.date) : undefined,
      },
      include: { category: true, subcategory: true },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (err) {
    console.error("[POST /api/expenses] error:", err)
    const message = err instanceof Error ? err.message : "Error interno"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
