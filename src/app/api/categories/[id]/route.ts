// app/api/categories/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json()
  const category = await prisma.category.update({
    where: { id: parseInt(params.id) },
    data,
  })
  return NextResponse.json(category)
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.category.delete({
    where: { id: parseInt(params.id) },
  })
  return NextResponse.json({ success: true })
}
