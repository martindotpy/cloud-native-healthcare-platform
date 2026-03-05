import {
  getApiAppointmentOptions,
  getApiInsuranceInvoiceCountOptions,
  getApiInsuranceInvoiceCountQueryKey,
  getApiInsuranceInvoiceOptions,
  getApiInsuranceInvoiceQueryKey,
  getApiInsuranceInvoiceSummaryByInvoiceIdOptions,
  getApiInsuranceProviderCountOptions,
  getApiInsuranceProviderCountQueryKey,
  getApiInsuranceProviderOptions,
  getApiInsuranceProviderQueryKey,
  postApiInsuranceInvoiceMutation,
  postApiInsuranceProviderMutation,
} from "@healthcare/shared/api/client/@tanstack/react-query.gen"
import { Button } from "@healthcare/web/core/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import { Input } from "@healthcare/web/core/components/ui/input"
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@healthcare/web/core/components/ui/searchable-select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/_private/aseguradoras")({
  component: InsurancePage,
})

function InsurancePage() {
  const queryClient = useQueryClient()

  const [providerName, setProviderName] = useState("")
  const [coverageDetails, setCoverageDetails] = useState("")
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("")
  const [selectedProviderId, setSelectedProviderId] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [summaryInvoiceId, setSummaryInvoiceId] = useState("")

  const providersQuery = useQuery(
    getApiInsuranceProviderOptions({
      query: { page: 0, size: 200, sort: ["name"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const providerCountQuery = useQuery(
    getApiInsuranceProviderCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const invoicesQuery = useQuery(
    getApiInsuranceInvoiceOptions({
      query: { page: 0, size: 200, sort: ["-issuedAt"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const invoiceCountQuery = useQuery(
    getApiInsuranceInvoiceCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const appointmentsQuery = useQuery(
    getApiAppointmentOptions({
      query: { page: 0, size: 400, sort: ["-scheduledDate"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const summaryQuery = useQuery({
    ...getApiInsuranceInvoiceSummaryByInvoiceIdOptions({
      path: {
        invoiceId: summaryInvoiceId || "00000000-0000-0000-0000-000000000000",
      },
      security: [{ type: "http", scheme: "bearer" }],
    }),
    enabled: Boolean(summaryInvoiceId),
    retry: false,
  })

  const createProviderMutation = useMutation({
    ...postApiInsuranceProviderMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getApiInsuranceProviderQueryKey(),
      })
      await queryClient.invalidateQueries({
        queryKey: getApiInsuranceProviderCountQueryKey(),
      })
      setProviderName("")
      setCoverageDetails("")
      toast.success("Aseguradora registrada")
    },
    onError: () => {
      toast.error("No se pudo registrar la aseguradora")
    },
  })

  const createInvoiceMutation = useMutation({
    ...postApiInsuranceInvoiceMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getApiInsuranceInvoiceQueryKey(),
      })
      await queryClient.invalidateQueries({
        queryKey: getApiInsuranceInvoiceCountQueryKey(),
      })
      setSelectedAppointmentId("")
      setSelectedProviderId("")
      setTotalAmount("")
      setPaymentMethod("")
      toast.success("Factura registrada")
    },
    onError: () => {
      toast.error("No se pudo registrar la factura")
    },
  })

  const handleCreateProvider = async () => {
    if (!providerName.trim()) {
      toast.error("Ingresa el nombre de la aseguradora")
      return
    }

    await createProviderMutation.mutateAsync({
      body: {
        id: crypto.randomUUID(),
        name: providerName.trim(),
        coverageDetails: coverageDetails.trim() || undefined,
      },
    })
  }

  const handleCreateInvoice = async () => {
    const appointment = (appointmentsQuery.data ?? []).find(
      (item) => item.id === selectedAppointmentId
    )

    if (!appointment || !totalAmount || !paymentMethod.trim()) {
      toast.error("Completa cita, total y metodo de pago")
      return
    }

    const provider = (providersQuery.data ?? []).find(
      (item) => item.id === selectedProviderId
    )

    await createInvoiceMutation.mutateAsync({
      body: {
        id: crypto.randomUUID(),
        appointment,
        insuranceProvider: provider,
        totalAmount: Number(totalAmount),
        paymentMethod: paymentMethod.trim(),
      },
    })
  }

  const appointmentOptions = useMemo<SearchableSelectOption[]>(() => {
    return (appointmentsQuery.data ?? []).map((appointment) => ({
      value: appointment.id,
      label: `DNI ${appointment.patient.nationalId} - Dr. ${appointment.doctor.lastName}`,
      keywords: `${appointment.patient.nationalId} ${appointment.doctor.firstName} ${appointment.doctor.lastName} ${appointment.facility.name}`,
    }))
  }, [appointmentsQuery.data])

  const providerOptions = useMemo<SearchableSelectOption[]>(() => {
    return [
      { value: "", label: "Sin aseguradora" },
      ...((providersQuery.data ?? []).map((provider) => ({
        value: provider.id,
        label: provider.name,
        keywords: provider.coverageDetails,
      })) as SearchableSelectOption[]),
    ]
  }, [providersQuery.data])

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border p-6 shadow-xs">
        <h1 className="text-3xl font-black tracking-tight">Aseguradoras</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Gestion de convenios y facturas del dominio de seguros.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Aseguradoras" value={providerCountQuery.data ?? 0} />
        <MetricCard label="Facturas" value={invoiceCountQuery.data ?? 0} />
        <MetricCard
          label="Citas Disponibles"
          value={(appointmentsQuery.data ?? []).length}
        />
        <MetricCard
          label="Resumen Consultado"
          value={summaryQuery.data?.found ? 1 : 0}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Nueva Aseguradora</h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="provider-name">Nombre</FieldLabel>
              <Input
                id="provider-name"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="provider-coverage">Cobertura</FieldLabel>
              <Input
                id="provider-coverage"
                value={coverageDetails}
                onChange={(e) => setCoverageDetails(e.target.value)}
              />
            </Field>
            <Button
              onClick={handleCreateProvider}
              disabled={createProviderMutation.isPending}
            >
              {createProviderMutation.isPending
                ? "Guardando..."
                : "Registrar aseguradora"}
            </Button>
          </FieldGroup>
        </div>

        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Nueva Factura</h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="invoice-appointment">Cita</FieldLabel>
              <SearchableSelect
                id="invoice-appointment"
                value={selectedAppointmentId}
                onValueChange={setSelectedAppointmentId}
                options={appointmentOptions}
                placeholder="Selecciona cita"
                searchPlaceholder="Buscar por DNI o doctor..."
                emptyMessage="No hay citas coincidentes"
                className="w-full"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="invoice-provider">Aseguradora</FieldLabel>
              <SearchableSelect
                id="invoice-provider"
                value={selectedProviderId}
                onValueChange={setSelectedProviderId}
                options={providerOptions}
                placeholder="Sin aseguradora"
                searchPlaceholder="Buscar aseguradora..."
                emptyMessage="No hay aseguradoras coincidentes"
                className="w-full"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="invoice-total">Total</FieldLabel>
              <Input
                id="invoice-total"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="invoice-payment">Metodo de pago</FieldLabel>
              <Input
                id="invoice-payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Field>
            <Button
              onClick={handleCreateInvoice}
              disabled={createInvoiceMutation.isPending}
            >
              {createInvoiceMutation.isPending
                ? "Guardando..."
                : "Registrar factura"}
            </Button>
          </FieldGroup>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">
            Resumen de Factura
          </h2>
          <Input
            value={summaryInvoiceId}
            onChange={(e) => setSummaryInvoiceId(e.target.value)}
            placeholder="UUID de factura"
          />
          {summaryInvoiceId && summaryQuery.data && (
            <div className="bg-muted/50 mt-3 rounded-lg border p-3 text-sm">
              <p className="font-semibold">{summaryQuery.data.message}</p>
              <p className="text-muted-foreground">
                Total: {summaryQuery.data.totalAmount ?? 0}
              </p>
              <p className="text-muted-foreground">
                Pago: {summaryQuery.data.paymentMethod ?? "-"}
              </p>
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Ultimas Facturas</h2>
          <div className="mt-3 space-y-2">
            {(invoicesQuery.data ?? []).slice(0, 8).map((invoice) => (
              <div
                key={invoice.id}
                className="bg-muted/40 rounded-lg border p-3 text-sm"
              >
                <p className="font-semibold">{invoice.paymentMethod}</p>
                <p className="text-muted-foreground">
                  Total: {invoice.totalAmount}
                </p>
                <p className="text-muted-foreground">
                  Aseguradora:{" "}
                  {invoice.insuranceProvider?.name ?? "Sin aseguradora"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl border p-4 shadow-xs">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}
