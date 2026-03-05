import { db } from "@healthcare/database"
import { serverLog } from "@healthcare/shared/log/server-logger"
import { migrate } from "drizzle-orm/bun-sql/migrator"

interface InitializeDatabaseOptions {
  runSeed?: boolean
}

// Initializer
export async function initializeDatabase(
  migrationsFolder: string,
  options: InitializeDatabaseOptions = {}
) {
  serverLog.info("Running database migrations...")

  await migrate(db, { migrationsFolder }).catch((error) => {
    serverLog.error({ err: error }, "Database migration failed:")

    throw error
  })

  serverLog.info("Database migrations completed")

  if (!options.runSeed) return

  const { seedDatabase } =
    await import("@healthcare/database/core/database-seeder")
  await seedDatabase()
}
