import { LoginRequest } from "@healthcare/shared/auth/login/request/login-request"
import {
  authClient,
  isAuthError,
} from "@healthcare/web/auth/client/auth-client"
import { ControlledCheckbox } from "@healthcare/web/core/components/form/controlled/controlled-checkbox"
import { ControlledInput } from "@healthcare/web/core/components/form/controlled/controlled-input"
import { ControlledPasswordInput } from "@healthcare/web/core/components/form/controlled/controlled-password-input"
import { Button } from "@healthcare/web/core/components/ui/button"
import { Link } from "@healthcare/web/core/components/ui/link"
import { Separator } from "@healthcare/web/core/components/ui/separator"
import { Route as PublicRoute } from "@healthcare/web/pages/_app/routes/_public/route"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { TbMail } from "react-icons/tb"
import { toast } from "sonner"

// Component
export function LoginForm() {
  // Query params
  const { redirect } = PublicRoute.useSearch()

  // Navigate
  const navigate = useNavigate()

  // Form
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(LoginRequest),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      fetchOptions: {
        onSuccess: ({ data }) => {
          navigate({ to: redirect || "/" })
          toast.success(`¡Bienvenido, ${data.user.name}!`)
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
      },
    })
  })

  return (
    <form onSubmit={onSubmit} className="mt-8 w-full max-w-sm space-y-3">
      <ControlledInput
        control={control}
        name="email"
        label="Correo electrónico"
        icon={TbMail}
        inputProps={{ autoComplete: "email", autoFocus: true }}
      />

      <ControlledPasswordInput
        control={control}
        name="password"
        label="Contraseña"
      />

      <ControlledCheckbox
        control={control}
        name="rememberMe"
        label="Recuérdame"
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
        to="/sign-up"
        variant="secondary"
        className="mt-2 w-full"
      >
        Regístrate
      </Link>
    </form>
  )
}
