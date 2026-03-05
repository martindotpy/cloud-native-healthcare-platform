import {
  getApiPatientCountOptions,
  getApiPatientCountQueryKey,
  getApiPatientOptions,
  getApiPatientQueryKey,
  postApiPatientMutation,
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

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = (error.response as { data?: unknown }).data

    if (typeof data === "string" && data.trim().length > 0) {
      return data
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      return data.detail
    }
  }

  return fallback
}

export const Route = createFileRoute("/_private/clientes")({
  component: ClientsPage,
})

function ClientsPage() {
  const queryClient = useQueryClient()
  const [nationalId, setNationalId] = useState("")
  const [phone, setPhone] = useState("")

  const patientsQuery = useQuery(
    getApiPatientOptions({
      query: { page: 0, size: 500, sort: ["nationalId"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const patientCountQuery = useQuery(
    getApiPatientCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const createPatientMutation = useMutation({
    ...postApiPatientMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getApiPatientQueryKey() })
      await queryClient.invalidateQueries({
        queryKey: getApiPatientCountQueryKey(),
      })
      setNationalId("")
      setPhone("")
      toast.success("Cliente registrado")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "No se pudo registrar el cliente"))
    },
  })

  const handleCreatePatient = async () => {
    const trimmedNationalId = nationalId.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedNationalId || !trimmedPhone) {
      toast.error("Completa DNI y telefono")
      return
    }

    if (!/^\d{8}$/.test(trimmedNationalId)) {
      toast.error("El DNI debe tener 8 digitos numericos")
      return
    }

    if (!/^\d{9}$/.test(trimmedPhone)) {
      toast.error("El telefono debe tener 9 digitos numericos")
      return
    }

    await createPatientMutation.mutateAsync({
      body: {
        id: crypto.randomUUID(),
        nationalId: trimmedNationalId,
        phone: trimmedPhone,
      },
    })
  }

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
          Gestion de Clientes
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Clientes</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Registro de pacientes para agendamiento, historia clinica y
          facturacion.
        </p>
        <p className="mt-4 text-sm font-semibold">
          Total registrados: {patientCountQuery.data ?? 0}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Nuevo Cliente</h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="patient-national-id">DNI</FieldLabel>
              <Input
                id="patient-national-id"
                value={nationalId}
                onChange={(event) => setNationalId(event.target.value)}
                placeholder="70000000"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="patient-phone">Telefono</FieldLabel>
              <Input
                id="patient-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="987654321"
              />
            </Field>
            <Button
              onClick={handleCreatePatient}
              disabled={createPatientMutation.isPending}
            >
              {createPatientMutation.isPending
                ? "Guardando..."
                : "Registrar cliente"}
            </Button>
          </FieldGroup>
        </div>

        <div className="bg-card overflow-hidden rounded-2xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">DNI</th>
                  <th className="px-4 py-3 text-left">Telefono</th>
                  <th className="px-4 py-3 text-left">ID</th>
                </tr>
              </thead>
              <tbody>
                {patientsQuery.isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center">
                      Cargando clientes...
                    </td>
                  </tr>
                ) : (patientsQuery.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center">
                      No hay clientes registrados.
                    </td>
                  </tr>
                ) : (
                  (patientsQuery.data ?? []).map((patient) => (
                    <tr key={patient.id} className="border-t">
                      <td className="px-4 py-3 font-medium">
                        {patient.nationalId}
                      </td>
                      <td className="px-4 py-3">{patient.phone}</td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">
                        {patient.id}
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
