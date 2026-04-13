import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Context = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Context) {
  const { id } = await params
  const data = await req.json()
  const category = await prisma.category.update({
    where: { id: parseInt(id) },
    data,
  })
  return NextResponse.json(category)
}

export async function DELETE(_: Request, { params }: Context) {
  const { id } = await params
  await prisma.category.delete({
    where: { id: parseInt(id) },
  })
  return NextResponse.json({ success: true })
}
