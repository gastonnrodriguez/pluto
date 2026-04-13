import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const CATEGORIES = [
  { name: "Ingresos",   subcategories: ["Sueldo Ani","Sueldo Gaston","Tickets Alimentacion","Aguinaldo Ani","Aguinaldo Gaston","Salario Vacacional Gaston","Bono Ani","Quebranto Ani"] },
  { name: "Alimentos",  subcategories: ["Dioma","Rodi","Tienda Inglesa","Disco","Devoto","Puesto Verduras","Panaderia","Carniceria","Feria","Ta-Ta","MultiAhorro","MacroMercado","El Dorado"] },
  { name: "Auto",       subcategories: ["Nafta","Seguro","Patente","Garage","Service","Lavado","Prestamo"] },
  { name: "Transporte", subcategories: ["Taxi","Uber","Bus"] },
  { name: "BHU",        subcategories: ["Hipoteca"] },
  { name: "Salud",      subcategories: ["Terapia Psicologica","Terapia Fonoaudiologica","Terapia Psicomotriz","Emergencia movil Mauro","Emergencia movil Clarita","Casmu"] },
  { name: "Educacion",  subcategories: ["CENI","Escuela 11","Utiles","Uniformes","Otros"] },
  { name: "Servicios",  subcategories: ["UTE","OSE","ANTEL ADSL","ANTEL Movil Ani","ANTEL Movil Gaston","Caja Profesional","Fondo Solidaridad"] },
  { name: "Tributos",   subcategories: ["IM Saneamiento","IM Domiciliario","Impuesto Primaria"] },
  { name: "Tarjetas",   subcategories: ["Visa Santander","Visa Itau","Master BROU"] },
  { name: "Otros",      subcategories: ["Ferreteria","Ropa","Regalos"] },
  { name: "Ocio",       subcategories: ["Restaurantes","Cine","Helados","Pasear","Poker","Salidas"] },
  { name: "Ahorro",     subcategories: ["Dolares"] },
]

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurada" }, { status: 500 })
  }

  const { imageBase64, mimeType } = await req.json()
  if (!imageBase64 || !mimeType) {
    return NextResponse.json({ error: "imageBase64 y mimeType son requeridos" }, { status: 400 })
  }

  const genai = new GoogleGenerativeAI(apiKey)
  const model = genai.getGenerativeModel({ model: "gemini-3-flash-preview" })

  const cats = CATEGORIES.map(c => `${c.name}:${c.subcategories.join(",")}`).join("|")

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
