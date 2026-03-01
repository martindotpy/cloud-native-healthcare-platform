import banner from "@healthcare/web/assets/img/cayetano-heredia-banner.png"
import { RegisterForm } from "@healthcare/web/register/components/organisms/register-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/register")({
  component: RegisterComponent,
})

function RegisterComponent() {
  return (
    <>
      <img
        {...banner}
        alt="Cayetano Heredia Banner"
        style={{ viewTransitionName: "cayetano-heredia-banner" }}
      />

      <RegisterForm />
    </>
  )
}
