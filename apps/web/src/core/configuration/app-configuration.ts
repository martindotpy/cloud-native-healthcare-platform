import z from "zod"

// Environment
type KeyEnv = { [K in keyof ImportMetaEnv]?: unknown }

export const {
  DEV: isDev,
  PROD: isProd,
  SITE: site,
  SSR: isSsr,
} = (
  z.object({
    BASE_URL: z.string(),
    DEV: z.coerce.boolean(),
    PROD: z.coerce.boolean(),
    SITE: z.string(),
    SSR: z.coerce.boolean(),
    MODE: z.enum(["development", "production", "test"]).default("development"),
  }) satisfies z.ZodType<KeyEnv>
).parse(import.meta.env)

// Url
export const siteUrl = new URL(site)
