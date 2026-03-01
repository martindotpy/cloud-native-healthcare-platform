import { isDev } from "@healthcare/shared/app-context"
import path from "path"
import pino, { type Logger } from "pino"

// Types
export type Log = Logger // Alias

// Transport
const { dirname } = import.meta
const targetPath = path.join(dirname, "transport", "consola-transport.js")

// Logger
export const serverLoggerOptions: pino.LoggerOptions = {
  level: "debug",
  serializers: {
    err: pino.stdSerializers.err,
  },

  // Development configuration
  ...(isDev
    ? {
        base: undefined,
        transport: { target: targetPath },
      }
    : {}),
}

export const serverLog = pino(serverLoggerOptions)
