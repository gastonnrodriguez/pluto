import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get("categoryId")

  if (categoryId) {
    // Caso filtrado por categoría (para el formulario)
    const filtered = await prisma.subcategory.findMany({
      where: { categoryId: Number(categoryId) },
      select: { id: true, name: true },
    })

    return NextResponse.json(filtered)
  }

  // Caso sin filtros (para listar en la tabla)
  const allSubcategories = await prisma.subcategory.findMany({
    include: { category: true },
  })

  return NextResponse.json(allSubcategories)
}

export async function POST(req: Request) {
  const data = await req.json()

  const sub = await prisma.subcategory.create({
    data: {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
    },
    include: { category: true },
  })

  return NextResponse.json(sub)
}
