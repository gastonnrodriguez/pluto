"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/expenses": "Gastos",
  "/expenses/new": "Nuevo Gasto",
  "/categories": "Categorías",
  "/categories/new": "Nueva Categoría",
  "/subcategories": "Subcategorías",
  "/subcategories/new": "Nueva Subcategoría",
  "/cards": "Tarjetas",
  "/cards/new": "Nueva Tarjeta",
  "/reports": "Reportes",
  "/settings": "Configuración",
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  // Para rutas anidadas como /expenses/new
  if (segments.length > 1) {
    const parentPath = `/${segments[0]}`
    const currentPath = pathname

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-sm">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={parentPath} className="text-sm">
              {routeNames[parentPath] || segments[0]}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">
              {routeNames[currentPath] || segments[segments.length - 1]}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname === "/" ? (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-sm">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">
                {routeNames[pathname] || segments[segments.length - 1]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
