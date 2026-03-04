import banner from "@healthcare/web/assets/img/cayetano-heredia-banner.png"
import { SignUpForm } from "@healthcare/web/sign-up/components/organisms/sign-up-form"
import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_public/sign-up")({
  component: SignUpComponent,
})

function SignUpComponent() {
  return (
    <>
      <img
        {...banner}
        alt="Cayetano Heredia Banner"
        style={{ viewTransitionName: "cayetano-heredia-banner" }}
      />

      <div className="mt-6 max-w-sm space-y-2">
        <h1 className="text-center text-3xl font-bold">
          ¡Únete a nuestra clínica!
        </h1>

        <p className="text-muted-foreground text-center text-sm">
          Crea tu cuenta para acceder a tus citas, historial médico y más.
        </p>
      </div>

      <SignUpForm />
    </>
  )
}
