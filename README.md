# 💸 Pluto Finance Tracker

Una aplicación moderna para el control de gastos personales y familiares. Permite llevar un registro colaborativo de finanzas, organizar ingresos y egresos por categorías, y próximamente analizar tus hábitos de gasto con inteligencia artificial.

---

## 🚀 Stack Tecnológico

- **Next.js 15** (App Router)
- **PostgreSQL 17** (Neon DB)
- **Prisma ORM**
- **Shadcn UI + TailwindCSS**
- **Auth.js** (NextAuth para autenticación) — _en desarrollo_
- **IA para análisis de gastos** — _próximamente_

---

## ✨ Características

- 🏠 Households colaborativos (agrupaciones de usuarios para compartir finanzas)
- 📂 Categorías globales y personalizadas
- 💳 Registro de tarjetas, monedas y transacciones
- 📊 Base sólida para dashboards y reportes
- 🧠 Visión a futuro:
  - Subida de estados de cuenta (PDF, CSV) con extracción automática de transacciones
  - Clasificación de gastos mediante IA
  - Detección de patrones de gasto
  - Módulo de ahorros y metas
  - Planes gratuitos y pagos

---

## ⚙️ Instalación

```bash
git clone https://github.com/tuusuario/personal-finance-tracker.git
cd personal-finance-tracker
cp .env.example .env
npm install
npm run db:push
npm run seed
npm run dev
-