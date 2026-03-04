import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_private/citas")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Acá encontrarás tus citas</div>
}
