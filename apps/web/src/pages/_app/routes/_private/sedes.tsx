import {
  getApiFacilityCountOptions,
  getApiFacilityCountQueryKey,
  getApiFacilityOptions,
  getApiFacilityQueryKey,
  postApiFacilityMutation,
} from "@healthcare/shared/api/client/@tanstack/react-query.gen"
import { Button } from "@healthcare/web/core/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import { Input } from "@healthcare/web/core/components/ui/input"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/_private/sedes")({
  component: FacilitiesPage,
})

function FacilitiesPage() {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const facilitiesQuery = useQuery(
    getApiFacilityOptions({
      query: { page: 0, size: 300, sort: ["name"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const facilityCountQuery = useQuery(
    getApiFacilityCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const createMutation = useMutation({
    ...postApiFacilityMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getApiFacilityQueryKey(),
      })
      await queryClient.invalidateQueries({
        queryKey: getApiFacilityCountQueryKey(),
      })
      setName("")
      setAddress("")
      toast.success("Sede registrada")
    },
    onError: () => {
      toast.error("No se pudo registrar la sede")
    },
  })

  const handleCreate = async () => {
    if (!name.trim() || !address.trim()) {
      toast.error("Completa nombre y direccion")
      return
    }

    await createMutation.mutateAsync({
      body: {
        id: crypto.randomUUID(),
        name: name.trim(),
        address: address.trim(),
      },
    })
  }

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
          Red Asistencial
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Sedes</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Gestiona las sedes donde los especialistas atienden presencialmente.
        </p>
        <p className="mt-4 text-sm font-semibold">
          Total registradas: {facilityCountQuery.data ?? 0}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Nueva Sede</h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="facility-name">Nombre</FieldLabel>
              <Input
                id="facility-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Sede San Borja"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="facility-address">Direccion</FieldLabel>
              <Input
                id="facility-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Av. Principal 123"
              />
            </Field>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Guardando..." : "Registrar sede"}
            </Button>
          </FieldGroup>
        </div>

        <div className="bg-card overflow-hidden rounded-2xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Sede</th>
                  <th className="px-4 py-3 text-left">Direccion</th>
                </tr>
              </thead>
              <tbody>
                {facilitiesQuery.isLoading ? (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={2}>
                      Cargando sedes...
                    </td>
                  </tr>
                ) : (facilitiesQuery.data ?? []).length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={2}>
                      No hay sedes registradas.
                    </td>
                  </tr>
                ) : (
                  (facilitiesQuery.data ?? []).map((facility) => (
                    <tr key={facility.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{facility.name}</td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">
                        {facility.address}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
