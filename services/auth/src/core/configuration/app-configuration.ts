import z from "zod"
import packageJson from "../../../package.json"

// Package json
export const { version, name: apiName } = packageJson

// Environment
type KeyEnv = { [K in keyof Bun.Env]: unknown }

export const {
  PORT: port,
  NODE_ENV: nodeEnv,
  DATABASE_URL: databaseUrl,
  BETTER_AUTH_SECRET: betterAuthSecret,
  ADMIN_EMAIL: adminEmail,
  ADMIN_PASSWORD: adminPassword,
} = (
  z.object({
    // App
    PORT: z.coerce.number().min(1).max(65535).default(3000),

    // Environment
    NODE_ENV: z
      .enum(["development", "production", "staging", "test"])
      .default("development"),

    // Database
    DATABASE_URL: z.url(),

    // Better auth
    BETTER_AUTH_SECRET: z.string().min(1),

    // Admin user
    ADMIN_EMAIL: z.email(),
    ADMIN_PASSWORD: z.string().min(8),
  }) satisfies z.ZodType<KeyEnv>
).parse(process.env)

// Stage
export const isProd = nodeEnv === "production"
export const isStaging = nodeEnv === "staging"
export const isDev = nodeEnv === "development"
