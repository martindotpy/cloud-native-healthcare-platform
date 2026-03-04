import { isDev } from "@healthcare/auth/core/configuration/app-configuration"
import { db, schema } from "@healthcare/database"
import { LoginRequest } from "@healthcare/shared/auth/login/request/login-request"
import { SignUpRequest } from "@healthcare/shared/auth/sign-up/request/sign-up-request"
import { serverLog } from "@healthcare/shared/log/server-logger"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, jwt, openAPI } from "better-auth/plugins"
import { redis } from "bun"
import { validator } from "validation-better-auth"

// Logger
const authLogger = serverLog.child({ module: "auth" })

// Auth configuration
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, debugLogs: true }),
  logger: {
    log(level, message, ...args) {
      authLogger[level](message, ...args)
    },
    ...(isDev ? { level: "debug" } : {}),
  },
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 60,
  },
  user: {
    additionalFields: {
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  plugins: [
    admin(),
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "ES256",
        },
      },
    }),
    validator([
      {
        path: "/sign-in/email",
        schema: LoginRequest,
      },
      {
        path: "/sign-up/email",
        schema: SignUpRequest,
      },
    ]),
    openAPI(),
  ],
  telemetry: {
    enabled: false,
  },
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key)
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, "EX", ttl)
      else await redis.set(key, value)
    },
    delete: async (key) => {
      await redis.del(key)
    },
  },
  advanced: {
    cookiePrefix: "healthcare",
    database: {
      generateId: () => Bun.randomUUIDv7(),
    },
  },
  experimental: { joins: true },
})

// Types
export type Auth = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user
export type AuthSession = typeof auth.$Infer.Session.session
export type AuthErrorCode = keyof typeof auth.$ERROR_CODES
