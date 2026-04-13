# CLAUDE.md — Pluto

Tracker de gastos personales por tarjeta de crédito. Organiza gastos en categorías y subcategorías, muestra analytics de consumo y permite gestionar múltiples tarjetas.

## Stack
- **Framework:** Next.js 16, React 19, TypeScript
- **DB/ORM:** Prisma + PostgreSQL
- **Auth:** Custom (bcrypt)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Gráficas:** Recharts (analytics dashboard)
- **Validación:** Zod
- **IA:** Google Gemini (análisis de facturas)

## Estructura
```
src/app/
├── (dashboard)/
│   ├── cards/          ← gestión tarjetas de crédito
│   ├── categories/     ← categorías de gastos
│   ├── subcategories/  ← subcategorías
│   ├── expenses/       ← registro de gastos
│   ├── analytics/      ← dashboard con gráficas
│   └── settings/       ← configuración
└── api/
    ├── credit-cards/
    ├── categories/
    └── subcategories/
```

## Comandos
```bash
npm run dev        # desarrollo (turbopack)
npm run build      # build
npm run db:push    # prisma db push
npm run seed       # seed de datos de prueba (tsx scripts/seed-all.ts)
```

## Variables de entorno requeridas (.env)
```
DATABASE_URL=
GEMINI_API_KEY=   # Google AI Studio: https://aistudio.google.com/apikey
```

## 📋 Gestión de tareas — Notion
Las tareas están en Notion. **Consultá Notion antes de arrancar** para saber qué está pendiente y en qué orden de prioridad.

- **Página del proyecto:** https://www.notion.so/31cdf198326781d3a010d52e66c2baac
- **Kanban de tareas:** https://www.notion.so/0c140c38256541ab94c22fe3db41c539

**Flujo de trabajo:**
1. Antes de empezar una tarea → cambiá el Estado a **"En progreso"**
2. Al terminar → cambiá el Estado a **"Listo"**
3. Si surge algo nuevo → agregá la tarea en Notion antes de implementar

Los estados del Kanban son: `Por hacer` → `En progreso` → `Listo`
