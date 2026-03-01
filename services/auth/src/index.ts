import { authController } from "@healthcare/auth/auth/controller/auth-controller"
import { port } from "@healthcare/auth/core/configuration/app-configuration"
import { miscellaneousController } from "@healthcare/auth/core/controller/miscellaneous-controller"
import { initializeApp } from "@healthcare/auth/core/initializer"
import { openapiMiddleware } from "@healthcare/auth/core/middleware/openapi-middleware"
import { loggerMiddleware } from "@healthcare/shared/middleware/logger-middleware"
import Elysia from "elysia"

// Api
export const api = new Elysia({ aot: true, precompile: true })
  .use(loggerMiddleware)
  .use(openapiMiddleware)
  .use(miscellaneousController)
  .use(authController)

await initializeApp()

api.listen(port, () => {
  console.log(
    `🚀 Auth service listening on port ${port}. http://localhost:${port}`
  )
})
