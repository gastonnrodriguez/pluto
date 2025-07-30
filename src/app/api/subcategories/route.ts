import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const subcategories = await prisma.subcategory.findMany({
    include: { category: true },
  })
  return NextResponse.json(subcategories)
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
