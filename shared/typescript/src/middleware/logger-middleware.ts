import { logger as elysiaLogger } from "@bogeychan/elysia-logger"
import type {
  Logger as ElysiaLogger,
  ElysiaLoggerOptions,
} from "@bogeychan/elysia-logger/types"
import { isDev } from "@healthcare/shared/app-context"

// Types
export type Logger = ElysiaLogger

// Configuration
const loggerConfiguration: ElysiaLoggerOptions = {
  customProps({ request: { headers } }) {
    // Ip
    const ip = headers.get("x-real-ip") || undefined

    return { ip }
  },
}

// Middleware
export const loggerMiddleware = elysiaLogger({
  level: "debug",
  customProps: loggerConfiguration.customProps,
  autoLogging: {
    ignore: isDev
      ? (ctx) =>
          ctx.request.url === "http://localhost:3000/api/auth/openapi.json"
      : (ctx) => ctx.request.url === "http://localhost:3000/_health",
  },
})
