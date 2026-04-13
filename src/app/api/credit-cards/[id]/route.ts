import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params
  const body   = await req.json()

  const card = await prisma.card.update({
    where: { id: Number(id) },
    data:  body,
  })

  return NextResponse.json(card)
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params

  await prisma.card.delete({ where: { id: Number(id) } })

  return NextResponse.json({ success: true })
}
