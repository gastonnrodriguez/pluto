import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurada" }, { status: 500 })
  }

  const { imageBase64, mimeType } = await req.json()
  if (!imageBase64 || !mimeType) {
    return NextResponse.json({ error: "imageBase64 y mimeType son requeridos" }, { status: 400 })
  }

  const dbCategories = await prisma.category.findMany({
    include: { subcategories: { select: { name: true } } },
    orderBy: { name: "asc" },
  })

  const genai = new GoogleGenerativeAI(apiKey)
  const model = genai.getGenerativeModel({ model: "gemini-3-flash-preview" })

  const cats = dbCategories.map(c => `${c.name}:${c.subcategories.map(s => s.name).join(",")}`).join("|")

  const prompt = `Factura/ticket. JSON válido solamente, sin markdown.
Categorías (nombre:subcats separadas por coma): ${cats}
{"categoria":"<exacto>","subcategoria":"<exacto o null>","importe":<total numérico o null>,"descripcion":"<60 chars es>"}
Importe=total de la factura. Subcategoría=nombre del comercio si aplica, sino la más cercana.`

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    },
  ])

  const text = result.response.text().trim()

  // Strip possible markdown code fences
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()

  try {
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: "No se pudo parsear la respuesta de Gemini", raw: text }, { status: 422 })
  }
}
