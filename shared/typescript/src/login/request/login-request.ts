import z from "zod"

// Schemas
export const LoginRequest = z.object({
  email: z.email("Ingresa un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rememberMe: z.boolean().default(true),
})
export type LoginRequest = z.infer<typeof LoginRequest>
