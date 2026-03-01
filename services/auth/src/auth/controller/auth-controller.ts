import { auth } from "@healthcare/auth/auth/configuration/auth-configuration"
import Elysia from "elysia"

// Auth controller
export const authController = new Elysia().mount(auth.handler)
