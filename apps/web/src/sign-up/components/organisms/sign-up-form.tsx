import { SignUpRequest } from "@healthcare/shared/auth/sign-up/request/sign-up-request"
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
export function SignUpForm() {
  // Query params
  const { redirect } = PublicRoute.useSearch()

  // Navigate
  const navigate = useNavigate()

  // Form
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(SignUpRequest),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastName: "",
      rememberMe: true,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    await authClient.signUp.email({
      ...data,
      fetchOptions: {
        onSuccess: ({ data }) => {
          navigate({ to: redirect || "/" })
          toast.success(`¡Bienvenido, ${data.user.name}!`)
        },
        onError: ({ error }) => {
          if (!isAuthError(error)) {
            toast.error("Error al registrarse. Inténtalo de nuevo más tarde.")
            return
          }

          switch (error.code) {
            case "EMAIL_ALREADY_EXISTS":
              toast.error("El correo electrónico ya está en uso.")
              break

            default:
              toast.error("Error al registrarse. Inténtalo de nuevo más tarde.")
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

      <ControlledInput
        control={control}
        name="name"
        label="Nombre"
        inputProps={{ autoComplete: "given-name" }}
      />

      <ControlledInput
        control={control}
        name="lastName"
        label="Apellido"
        inputProps={{ autoComplete: "family-name" }}
      />

      <ControlledPasswordInput
        control={control}
        name="password"
        label="Contraseña"
        inputProps={{ autoComplete: "new-password" }}
      />

      <ControlledPasswordInput
        control={control}
        name="confirmPassword"
        label="Confirmar contraseña"
        inputProps={{ autoComplete: "new-password" }}
      />

      <ControlledCheckbox
        control={control}
        name="rememberMe"
        label="Recuérdame"
      />

      <Button
        type="submit"
        variant="secondary"
        className="mt-2 w-full"
        disabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? "Registrando..." : "Regístrate"}
      </Button>

      <div className="mt-2 flex items-center justify-center">
        <div className="flex-1">
          <Separator />
        </div>

        <span className="text-muted-foreground mx-2 text-sm">
          ¿Ya tienes una cuenta?
        </span>

        <div className="flex-1">
          <Separator />
        </div>
      </div>

      <Link to="/login" variant="default" className="mt-2 w-full">
        Iniciar sesión
      </Link>
    </form>
  )
}
