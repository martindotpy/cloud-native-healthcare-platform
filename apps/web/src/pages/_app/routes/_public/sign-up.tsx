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

      <SignUpForm />
    </>
  )
}
