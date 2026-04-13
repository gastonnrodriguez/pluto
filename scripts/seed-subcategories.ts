import { prisma } from "@/lib/prisma"

export async function seedSubcategories() {
  const categories = await prisma.category.findMany({
    where: { householdId: null },
  })

  const byName = (name: string) =>
    categories.find((c) => c.name === name)?.id

  const subcategories = [
    // Ingresos
    { name: "Sueldo Ani",               categoryId: byName("Ingresos") },
    { name: "Sueldo Gaston",            categoryId: byName("Ingresos") },
    { name: "Tickets Alimentacion",     categoryId: byName("Ingresos") },
    { name: "Aguinaldo Ani",            categoryId: byName("Ingresos") },
    { name: "Aguinaldo Gaston",         categoryId: byName("Ingresos") },
    { name: "Salario Vacacional Gaston",categoryId: byName("Ingresos") },
    { name: "Bono Ani",                 categoryId: byName("Ingresos") },
    { name: "Quebranto Ani",            categoryId: byName("Ingresos") },

    // Alimentos
    { name: "Dioma",          categoryId: byName("Alimentos") },
    { name: "Rodi",           categoryId: byName("Alimentos") },
    { name: "Tienda Inglesa", categoryId: byName("Alimentos") },
    { name: "Disco",          categoryId: byName("Alimentos") },
    { name: "Devoto",         categoryId: byName("Alimentos") },
    { name: "Puesto Verduras",categoryId: byName("Alimentos") },
    { name: "Panaderia",      categoryId: byName("Alimentos") },
    { name: "Carniceria",     categoryId: byName("Alimentos") },
    { name: "Feria",          categoryId: byName("Alimentos") },
    { name: "Ta-Ta",          categoryId: byName("Alimentos") },
    { name: "MultiAhorro",    categoryId: byName("Alimentos") },
    { name: "MacroMercado",   categoryId: byName("Alimentos") },
    { name: "El Dorado",      categoryId: byName("Alimentos") },

    // Auto
    { name: "Nafta",    categoryId: byName("Auto") },
    { name: "Seguro",   categoryId: byName("Auto") },
    { name: "Patente",  categoryId: byName("Auto") },
    { name: "Garage",   categoryId: byName("Auto") },
    { name: "Service",  categoryId: byName("Auto") },
    { name: "Lavado",   categoryId: byName("Auto") },
    { name: "Prestamo", categoryId: byName("Auto") },

    // Transporte
    { name: "Taxi", categoryId: byName("Transporte") },
    { name: "Uber", categoryId: byName("Transporte") },
    { name: "Bus",  categoryId: byName("Transporte") },

    // BHU
    { name: "Hipoteca", categoryId: byName("BHU") },

    // Salud
    { name: "Terapia Psicologica",    categoryId: byName("Salud") },
    { name: "Terapia Fonoaudiologica",categoryId: byName("Salud") },
    { name: "Terapia Psicomotriz",    categoryId: byName("Salud") },
    { name: "Emergencia movil Mauro", categoryId: byName("Salud") },
    { name: "Emergencia movil Clarita",categoryId: byName("Salud") },
    { name: "Casmu",                  categoryId: byName("Salud") },

    // Educacion
    { name: "CENI",       categoryId: byName("Educacion") },
    { name: "Escuela 11", categoryId: byName("Educacion") },
    { name: "Utiles",     categoryId: byName("Educacion") },
    { name: "Uniformes",  categoryId: byName("Educacion") },
    { name: "Otros",      categoryId: byName("Educacion") },

    // Servicios
    { name: "UTE",               categoryId: byName("Servicios") },
    { name: "OSE",               categoryId: byName("Servicios") },
    { name: "ANTEL ADSL",        categoryId: byName("Servicios") },
    { name: "ANTEL Movil Ani",   categoryId: byName("Servicios") },
    { name: "ANTEL Movil Gaston",categoryId: byName("Servicios") },
    { name: "Caja Profesional",  categoryId: byName("Servicios") },
    { name: "Fondo Solidaridad", categoryId: byName("Servicios") },

    // Tributos
    { name: "IM Saneamiento",   categoryId: byName("Tributos") },
    { name: "IM Domiciliario",  categoryId: byName("Tributos") },
    { name: "Impuesto Primaria",categoryId: byName("Tributos") },

    // Tarjetas
    { name: "Visa Santander", categoryId: byName("Tarjetas") },
    { name: "Visa Itau",      categoryId: byName("Tarjetas") },
    { name: "Master BROU",    categoryId: byName("Tarjetas") },

    // Otros
    { name: "Ferreteria", categoryId: byName("Otros") },
    { name: "Ropa",       categoryId: byName("Otros") },
    { name: "Regalos",    categoryId: byName("Otros") },

    // Ocio
    { name: "Restaurantes", categoryId: byName("Ocio") },
    { name: "Cine",         categoryId: byName("Ocio") },
    { name: "Helados",      categoryId: byName("Ocio") },
    { name: "Pasear",       categoryId: byName("Ocio") },
    { name: "Poker",        categoryId: byName("Ocio") },
    { name: "Salidas",      categoryId: byName("Ocio") },

    // Ahorro
    { name: "Dolares", categoryId: byName("Ahorro") },
  ]
    .filter((s): s is { name: string; categoryId: number } => s.categoryId !== undefined)
    .map((s) => ({ ...s, description: "" }))

  await prisma.subcategory.createMany({ data: subcategories })

  console.log("✅ Subcategorías globales creadas.")
}
