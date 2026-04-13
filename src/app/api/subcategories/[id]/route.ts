import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Context = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Context) {
  const { id } = await params
  const data = await req.json()

  const updated = await prisma.subcategory.update({
    where: { id: parseInt(id) },
    data,
    include: { category: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Context) {
  const { id } = await params
  await prisma.subcategory.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
