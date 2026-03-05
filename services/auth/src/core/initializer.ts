import { initializeAuth } from "@healthcare/auth/auth/auth-initializer"
import { initializeDatabase } from "@healthcare/database/core/database-initializer"
import path from "node:path"

// Migration path
const cwd = process.cwd()
const migrationsFolder = path.join(cwd, "..", "..", "database", "migration")

/**
 * Initializes the application.
 */
export async function initializeApp() {
  await initializeDatabase(migrationsFolder, {
    runSeed: process.env.DATABASE_SEED_ENABLED !== "false",
  })
  await initializeAuth()
}
