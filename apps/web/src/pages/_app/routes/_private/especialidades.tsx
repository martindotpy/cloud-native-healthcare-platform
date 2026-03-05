import {
  getApiSpecialtyCountOptions,
  getApiSpecialtyCountQueryKey,
  getApiSpecialtyOptions,
  getApiSpecialtyQueryKey,
  postApiSpecialtyMutation,
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

export const Route = createFileRoute("/_private/especialidades")({
  component: SpecialtiesPage,
})

function SpecialtiesPage() {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")

  const specialtiesQuery = useQuery(
    getApiSpecialtyOptions({
      query: { page: 0, size: 300, sort: ["name"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const specialtyCountQuery = useQuery(
    getApiSpecialtyCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const createMutation = useMutation({
    ...postApiSpecialtyMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getApiSpecialtyQueryKey(),
      })
      await queryClient.invalidateQueries({
        queryKey: getApiSpecialtyCountQueryKey(),
      })
      setName("")
      toast.success("Especialidad creada")
    },
    onError: () => {
      toast.error("No se pudo crear la especialidad")
    },
  })

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Ingresa el nombre de la especialidad")
      return
    }

    await createMutation.mutateAsync({
      body: {
        id: crypto.randomUUID(),
        name: name.trim(),
      },
    })
  }

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
          Catalogo Clinico
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Especialidades
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Administra la lista de especialidades medicas disponibles para
          agendamiento.
        </p>
        <p className="mt-4 text-sm font-semibold">
          Total registradas: {specialtyCountQuery.data ?? 0}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">
            Nueva Especialidad
          </h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="specialty-name">Nombre</FieldLabel>
              <Input
                id="specialty-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Cardiologia"
              />
            </Field>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending
                ? "Guardando..."
                : "Registrar especialidad"}
            </Button>
          </FieldGroup>
        </div>

        <div className="bg-card overflow-hidden rounded-2xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">ID</th>
                </tr>
              </thead>
              <tbody>
                {specialtiesQuery.isLoading ? (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={2}>
                      Cargando especialidades...
                    </td>
                  </tr>
                ) : (specialtiesQuery.data ?? []).length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={2}>
                      No hay especialidades registradas.
                    </td>
                  </tr>
                ) : (
                  (specialtiesQuery.data ?? []).map((specialty) => (
                    <tr key={specialty.id} className="border-t">
                      <td className="px-4 py-3 font-medium">
                        {specialty.name}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">
                        {specialty.id}
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
