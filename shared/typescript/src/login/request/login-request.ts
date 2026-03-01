import z from "zod"

// Schemas
export const LoginRequest = z.object({
  email: z.email("Ingresa un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})
export type LoginRequest = z.infer<typeof LoginRequest>
