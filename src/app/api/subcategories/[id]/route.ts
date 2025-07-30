import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json()

  const updated = await prisma.subcategory.update({
    where: { id: parseInt(params.id) },
    data,
    include: { category: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.subcategory.delete({ where: { id: parseInt(params.id) } })
  return NextResponse.json({ success: true })
}
