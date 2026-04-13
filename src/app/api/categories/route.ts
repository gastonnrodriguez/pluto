// app/api/categories/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { subcategories: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const data = await req.json()
  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      householdId: null, // TODO: Reemplazá esto por el household real del usuario
    },
  })
  return NextResponse.json(category)
}
export async function PUT(req: Request) {
  const data = await req.json()
  const category = await prisma.category.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
    },
  })
  return NextResponse.json(category)
}