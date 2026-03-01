import banner from "@healthcare/web/assets/img/cayetano-heredia-banner.png"
import { LoginForm } from "@healthcare/web/login/components/organisms/login-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/login")({
  component: LoginComponent,
})

function LoginComponent() {
  return (
    <>
      <img
        {...banner}
        alt="Cayetano Heredia Banner"
        style={{ viewTransitionName: "cayetano-heredia-banner" }}
      />

      <div className="mt-6 max-w-sm space-y-2">
        <h1 className="text-center text-3xl font-bold">
          ¡Bienvenido de nuevo!
        </h1>

        <p className="text-muted-foreground text-center text-sm">
          Ingresa tus credenciales para acceder a tu cuenta.
        </p>
      </div>

      <LoginForm />
    </>
  )
}
