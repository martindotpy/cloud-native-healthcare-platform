import { LoginRequest } from "@healthcare/shared/login/request/login-request"
import {
  authClient,
  isAuthError,
} from "@healthcare/web/auth/client/auth-client"
import { ControlledInput } from "@healthcare/web/core/components/form/controlled/controlled-input"
import { Button } from "@healthcare/web/core/components/ui/button"
import { Link } from "@healthcare/web/core/components/ui/link"
import { Separator } from "@healthcare/web/core/components/ui/separator"
import { Route } from "@healthcare/web/pages/_app/routes/_public/route"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

// Component
export function LoginForm() {
  // Query params
  const { redirect } = Route.useSearch()

  // Navigate
  const navigate = useNavigate()

  // Form
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(LoginRequest),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          navigate({ to: redirect || "/" })
          toast.success("¡Inicio de sesión exitoso! Bienvenido de nuevo.")
        },
        onError: ({ error }) => {
          if (!isAuthError(error)) {
            toast.error(
              "Error al iniciar sesión. Inténtalo de nuevo más tarde."
            )
            return
          }

          switch (error.code) {
            case "INVALID_EMAIL_OR_PASSWORD":
              toast.error("Correo electrónico o contraseña incorrectos.")
              break

            default:
              toast.error(
                "Error al iniciar sesión. Inténtalo de nuevo más tarde."
              )
              break
          }
        },
      }
    )
  })

  return (
    <form onSubmit={onSubmit} className="mt-8 w-full max-w-sm space-y-3">
      <ControlledInput
        control={control}
        name="email"
        label="Correo electrónico"
      />

      <ControlledInput
        control={control}
        name="password"
        label="Contraseña"
        inputProps={{
          type: "password",
        }}
      />

      <Button
        className="mt-2 w-full"
        disabled={formState.isSubmitting}
        type="submit"
      >
        {formState.isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <div className="mt-2 flex items-center justify-center">
        <div className="flex-1">
          <Separator />
        </div>

        <span className="text-muted-foreground mx-2 text-sm">
          ¿No tienes una cuenta?
        </span>

        <div className="flex-1">
          <Separator />
        </div>
      </div>

      <Link
        to="/register"
        variant="secondary"
        className="mt-2 w-full"
        style={{ viewTransitionName: "register-button" }}
      >
        Regístrate
      </Link>
    </form>
  )
}
