import { seedUser } from "./seed-user"
import { seedHousehold } from "./seed-household"
import { seedCategories } from "./seed-categories"

async function main() {
  const user = await seedUser()
  if (!user) {
    console.error("❌ No se pudo crear el usuario.")
    return
  }

  await seedHousehold(user.id)
  await seedCategories()
}

main().finally(() => process.exit())
