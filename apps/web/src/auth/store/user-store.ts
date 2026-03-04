import type { Auth } from "@healthcare/auth/auth/configuration/auth-configuration"
import { atom } from "nanostores"

// Store
export const $auth = atom<Auth | null>(null)
