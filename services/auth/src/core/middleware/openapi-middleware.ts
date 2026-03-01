import openapi, { fromTypes } from "@elysiajs/openapi"
import { declarationToJSONSchema } from "@elysiajs/openapi/gen"
import type { AdditionalReference } from "@elysiajs/openapi/types"
import { auth } from "@healthcare/auth/auth/configuration/auth-configuration"
import {
  isDev,
  version,
} from "@healthcare/auth/core/configuration/app-configuration"
import { serverLog } from "@healthcare/shared/log/server-logger"

// Pre-compile typescript types
let precompiledTypes: AdditionalReference | undefined

if (!isDev) {
  try {
    const distFile = Bun.file("./dist/index.d.ts")
    precompiledTypes = declarationToJSONSchema(await distFile.text())

    serverLog.info("Pre-compiled types loaded")
  } catch (err) {
    serverLog.error({ err }, "Failed to load pre-compiled types")
  }
}

const authOpenAPISchema = await auth.api.generateOpenAPISchema()
authOpenAPISchema.paths = Object.fromEntries(
  Object.entries(authOpenAPISchema.paths).map(([path, value]) => [
    `/api/auth${path}`,
    value,
  ])
)
const references = {
  ...(precompiledTypes ?? fromTypes()),
}

// Middleware
export const openapiMiddleware = openapi({
  references,
  provider: null,
  exclude: {
    tags: ["Internal"],
  },
  specPath: "/api/auth/openapi.json",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  documentation: {
    ...authOpenAPISchema,
    info: {
      title: "Healthcare Auth",
      version,
      description:
        "API documentation for the Auth Service of the Healthcare Platform. This service handles user authentication and authorization.",
    },
    servers: [
      {
        url:
          authOpenAPISchema.servers?.[0]?.url?.replace("/api/auth", "") ??
          "http://localhost:4321",
      },
    ],
  },
})
