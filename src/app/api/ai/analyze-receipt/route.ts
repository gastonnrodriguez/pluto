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

  const prompt = `Analizá esta imagen de factura o ticket de compra y respondé SOLO con un JSON válido (sin markdown, sin explicaciones).

Categorías disponibles y sus subcategorías:
${CATEGORIES.map(c => `- ${c.name}: ${c.subcategories.join(", ")}`).join("\n")}

Retorná exactamente este JSON:
{
  "categoria": "<nombre exacto de la categoría>",
  "subcategoria": "<nombre exacto de la subcategoría, o null si no aplica>",
  "importe": <número con el total a pagar, sin símbolo de moneda>,
  "descripcion": "<descripción breve del gasto en español, máximo 60 caracteres>"
}

Reglas:
- El importe debe ser el TOTAL de la factura (no ítems individuales)
- Si es un supermercado, usá la categoría Alimentos y la subcategoría que corresponda al nombre del comercio
- Si no reconocés el comercio exacto, elegí la subcategoría más apropiada
- Si no podés determinar el importe, retorná null en ese campo`

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
