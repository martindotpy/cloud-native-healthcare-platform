import { serverLog } from "@healthcare/shared/log/server-logger"

export async function seedDatabase() {
  serverLog.info("Running deterministic database seeds...")

  const { runCmchSeed } = await import("@healthcare/database/seeds/cmch-seed")

  await runCmchSeed().catch((error) => {
    serverLog.error({ err: error }, "Database seed failed:")

    throw error
  })

  serverLog.info("Database seeds completed")
}
