import {
  deleteApiAppointmentByIdMutation,
  getApiAppointmentCountOptions,
  getApiAppointmentCountQueryKey,
  getApiAppointmentOptions,
  getApiAppointmentQueryKey,
  getApiDoctorOptions,
  getApiFacilityOptions,
  getApiPatientOptions,
  postApiAppointmentMutation,
  putApiAppointmentByIdMutation,
} from "@healthcare/shared/api/client/@tanstack/react-query.gen"
import { client } from "@healthcare/shared/api/client/client.gen"
import type {
  OpenapiAppointment,
  OpenapiAppointmentStatus,
  OpenapiAppointmentValidationResponse,
  OpenapiDoctor,
  OpenapiFacility,
  OpenapiPatient,
} from "@healthcare/shared/api/client/types.gen"
import { ConfirmDialog } from "@healthcare/web/core/components/molecules/confirm-dialog"
import { Button } from "@healthcare/web/core/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@healthcare/web/core/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import { Input } from "@healthcare/web/core/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@healthcare/web/core/components/ui/native-select"
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@healthcare/web/core/components/ui/searchable-select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { TbCalendar, TbClockHour4, TbPencil, TbTrash } from "react-icons/tb"
import { toast } from "sonner"

export const Route = createFileRoute("/_private/citas")({
  component: RouteComponent,
})

type AppointmentStatusFilter = OpenapiAppointmentStatus | "ALL"

interface AppointmentFormState {
  patientId: string
  doctorId: string
  facilityId: string
  scheduledAt: string
  status: OpenapiAppointmentStatus
}

interface AppointmentInsuranceSummaryResponse {
  found: boolean
  message: string
  invoiceId: string | null
  appointmentId: string | null
  insuranceProviderId: string | null
  insuranceProviderName: string | null
  totalAmount: number | null
  paymentMethod: string | null
  issuedAt: string | null
}

type AgendaValidationStatus =
  | "idle"
  | "validating"
  | "valid"
  | "invalid"
  | "error"

interface AgendaValidationState {
  status: AgendaValidationStatus
  message: string
}

const defaultAppointmentForm: AppointmentFormState = {
  patientId: "",
  doctorId: "",
  facilityId: "",
  scheduledAt: "",
  status: "pending",
}

const toInputDateTime = (value?: string) => {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  const hours = `${date.getHours()}`.padStart(2, "0")
  const minutes = `${date.getMinutes()}`.padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const fromInputDateTime = (value: string) => {
  const normalized = value.length === 16 ? `${value}:00` : value
  return normalized
}

const getDoctorSpecialtiesLabel = (doctor: OpenapiDoctor) => {
  const specialties = doctor.specialties ?? []
  if (specialties.length === 0) return "Sin especialidades"

  return specialties.map((specialty) => specialty.name).join(", ")
}

const buildAppointmentBody = (
  form: AppointmentFormState,
  patients: OpenapiPatient[],
  doctors: OpenapiDoctor[],
  facilities: OpenapiFacility[],
  id?: string
) => {
  const patient = patients.find((item) => item.id === form.patientId)
  const doctor = doctors.find((item) => item.id === form.doctorId)
  const facility = facilities.find((item) => item.id === form.facilityId)

  if (!patient || !doctor || !facility) {
    return null
  }

  return {
    id: id ?? crypto.randomUUID(),
    patient,
    doctor,
    facility,
    scheduledDate: fromInputDateTime(form.scheduledAt),
    status: form.status,
  } satisfies OpenapiAppointment
}

const buildAgendaValidationPayload = (
  form: AppointmentFormState,
  appointmentId?: string
) => {
  if (!form.doctorId || !form.facilityId || !form.scheduledAt) {
    return null
  }

  return {
    doctorId: form.doctorId,
    facilityId: form.facilityId,
    scheduledDate: fromInputDateTime(form.scheduledAt),
    appointmentId,
  }
}

const statusStyles: Record<OpenapiAppointmentStatus, string> = {
  pending: "bg-secondary text-secondary-foreground border border-border",
  completed: "bg-primary/15 text-primary border border-primary/30",
  canceled: "bg-destructive/10 text-destructive border border-destructive/30",
}

const statusLabels: Record<OpenapiAppointmentStatus, string> = {
  pending: "Pendiente",
  completed: "Completada",
  canceled: "Cancelada",
}

const statusDotStyles: Record<OpenapiAppointmentStatus, string> = {
  pending: "bg-secondary-foreground/70",
  completed: "bg-primary",
  canceled: "bg-destructive",
}

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

function RouteComponent() {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(25)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const [statusFilter, setStatusFilter] =
    useState<AppointmentStatusFilter>("ALL")
  const [doctorFilter, setDoctorFilter] = useState<string>("ALL")
  const [facilityFilter, setFacilityFilter] = useState<string>("ALL")
  const [dniFilter, setDniFilter] = useState("")

  const [selectedAppointment, setSelectedAppointment] =
    useState<OpenapiAppointment | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] =
    useState<OpenapiAppointment | null>(null)
  const [form, setForm] = useState<AppointmentFormState>(defaultAppointmentForm)

  const [appointmentToDelete, setAppointmentToDelete] =
    useState<OpenapiAppointment | null>(null)

  const appointmentsQuery = useQuery(
    getApiAppointmentOptions({
      query: {
        page,
        size,
        sort: [sortDirection === "desc" ? "-scheduledDate" : "scheduledDate"],
      },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const countQuery = useQuery(
    getApiAppointmentCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const doctorsQuery = useQuery(
    getApiDoctorOptions({
      query: {
        page: 0,
        size: 200,
        sort: ["lastName"],
      },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const facilitiesQuery = useQuery(
    getApiFacilityOptions({
      query: {
        page: 0,
        size: 60,
        sort: ["name"],
      },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const patientsQuery = useQuery(
    getApiPatientOptions({
      query: {
        page: 0,
        size: 700,
        sort: ["nationalId"],
      },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const appointments = appointmentsQuery.data
  const doctors = doctorsQuery.data
  const facilities = facilitiesQuery.data
  const patients = patientsQuery.data
  const total = countQuery.data ?? 0
  const totalPages = Math.max(1, Math.ceil(total / size))

  const appointmentInsuranceSummaryQuery = useQuery({
    queryKey: ["appointment-insurance-summary-soap", selectedAppointment?.id],
    enabled: Boolean(selectedAppointment?.id),
    queryFn: async () => {
      const response = await client.get<
        { 200: AppointmentInsuranceSummaryResponse },
        never,
        true
      >({
        url: `/api/appointment/insurance-summary/by-appointment/${selectedAppointment!.id}`,
        throwOnError: true,
        security: [{ type: "http", scheme: "bearer" }],
      })

      return response.data
    },
  })

  const filteredAppointments = useMemo(() => {
    if (!appointments) return []

    return appointments.filter((appointment) => {
      const statusMatches =
        statusFilter === "ALL" || appointment.status === statusFilter

      const doctorMatches =
        doctorFilter === "ALL" || appointment.doctor.id === doctorFilter

      const facilityMatches =
        facilityFilter === "ALL" || appointment.facility.id === facilityFilter

      const dniMatches =
        dniFilter.trim().length === 0 ||
        appointment.patient.nationalId.includes(dniFilter.trim())

      return statusMatches && doctorMatches && facilityMatches && dniMatches
    })
  }, [appointments, statusFilter, doctorFilter, facilityFilter, dniFilter])

  const dashboard = useMemo(() => {
    if (!appointments) {
      return {
        pending: 0,
        completed: 0,
        canceled: 0,
        upcoming48h: 0,
      }
    }

    const pending = appointments.filter(
      (item) => item.status === "pending"
    ).length
    const completed = appointments.filter(
      (item) => item.status === "completed"
    ).length
    const canceled = appointments.filter(
      (item) => item.status === "canceled"
    ).length

    const upcoming48h = appointments.filter((item) => {
      const currentTime = new Date().getTime()
      const appointmentTime = new Date(item.scheduledDate).getTime()
      return (
        appointmentTime >= currentTime &&
        appointmentTime - currentTime <= 172800000
      )
    }).length

    return { pending, completed, canceled, upcoming48h }
  }, [appointments])

  const doctorFilterOptions = useMemo<SearchableSelectOption[]>(() => {
    return [
      { value: "ALL", label: "Todos" },
      ...((doctors ?? []).map((doctor) => ({
        value: doctor.id,
        label: `${doctor.lastName}, ${doctor.firstName}`,
        keywords: `${doctor.firstName} ${doctor.lastName} ${doctor.medicalLicense}`,
      })) as SearchableSelectOption[]),
    ]
  }, [doctors])

  const facilityFilterOptions = useMemo<SearchableSelectOption[]>(() => {
    return [
      { value: "ALL", label: "Todas" },
      ...((facilities ?? []).map((facility) => ({
        value: facility.id,
        label: facility.name,
        keywords: facility.address,
      })) as SearchableSelectOption[]),
    ]
  }, [facilities])

  const patientOptions = useMemo<SearchableSelectOption[]>(() => {
    return (patients ?? []).map((patient) => ({
      value: patient.id,
      label: `${patient.nationalId} - ${patient.phone}`,
      keywords: `${patient.nationalId} ${patient.phone}`,
    })) as SearchableSelectOption[]
  }, [patients])

  const doctorOptions = useMemo<SearchableSelectOption[]>(() => {
    return (doctors ?? []).map((doctor) => ({
      value: doctor.id,
      label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      keywords: `${doctor.firstName} ${doctor.lastName} ${doctor.medicalLicense} ${getDoctorSpecialtiesLabel(doctor)}`,
    })) as SearchableSelectOption[]
  }, [doctors])

  const facilityOptions = useMemo<SearchableSelectOption[]>(() => {
    return (facilities ?? []).map((facility) => ({
      value: facility.id,
      label: facility.name,
      keywords: facility.address,
    })) as SearchableSelectOption[]
  }, [facilities])

  const formFacilityOptions = useMemo<SearchableSelectOption[]>(() => {
    if (!form.doctorId) {
      return facilityOptions
    }

    const selectedDoctor = (doctors ?? []).find(
      (doctor) => doctor.id === form.doctorId
    )

    const doctorFacilities = selectedDoctor?.facilities ?? []

    return doctorFacilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
      keywords: facility.address,
    }))
  }, [doctors, facilityOptions, form.doctorId])

  const invalidateAppointments = async () => {
    await queryClient.invalidateQueries({
      queryKey: getApiAppointmentQueryKey(),
    })
    await queryClient.invalidateQueries({
      queryKey: getApiAppointmentCountQueryKey(),
    })
  }

  const createMutation = useMutation({
    ...postApiAppointmentMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await invalidateAppointments()
      setIsFormOpen(false)
      setEditingAppointment(null)
      setForm(defaultAppointmentForm)
      toast.success("Cita creada correctamente")
    },
    onError: () => {
      toast.error("No se pudo crear la cita")
    },
  })

  const updateMutation = useMutation({
    ...putApiAppointmentByIdMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await invalidateAppointments()
      setIsFormOpen(false)
      setEditingAppointment(null)
      setForm(defaultAppointmentForm)
      toast.success("Cita actualizada correctamente")
    },
    onError: () => {
      toast.error("No se pudo actualizar la cita")
    },
  })

  const deleteMutation = useMutation({
    ...deleteApiAppointmentByIdMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await invalidateAppointments()
      setAppointmentToDelete(null)
      setSelectedAppointment(null)
      toast.success("Cita eliminada")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "No se pudo eliminar la cita"))
    },
  })

  const validateAgendaByEndpoint = async (
    payload: NonNullable<ReturnType<typeof buildAgendaValidationPayload>>
  ): Promise<OpenapiAppointmentValidationResponse> => {
    const response = await client.post<
      { 200: OpenapiAppointmentValidationResponse },
      never,
      true
    >({
      url: "/api/appointment/validate",
      body: payload,
      throwOnError: true,
      security: [{ type: "http", scheme: "bearer" }],
    })

    return response.data
  }

  const agendaValidationPayload = buildAgendaValidationPayload(
    form,
    editingAppointment?.id
  )

  const agendaValidationPayloadKey = agendaValidationPayload
    ? JSON.stringify(agendaValidationPayload)
    : ""

  const agendaValidationQuery = useQuery({
    queryKey: [
      "appointment-agenda-validation",
      agendaValidationPayloadKey,
      agendaValidationPayload,
    ],
    enabled: isFormOpen && Boolean(agendaValidationPayload),
    retry: false,
    queryFn: async () => validateAgendaByEndpoint(agendaValidationPayload!),
  })

  const {
    data: agendaValidationResult,
    isPending: isAgendaValidationPending,
    isError: isAgendaValidationError,
  } = agendaValidationQuery

  const agendaValidation: AgendaValidationState = useMemo(() => {
    if (!isFormOpen || !agendaValidationPayload) {
      return {
        status: "idle",
        message: "Selecciona medico, sede y fecha para validar agenda",
      }
    }

    if (isAgendaValidationPending) {
      return {
        status: "validating",
        message: "Validando disponibilidad del medico en esa sede...",
      }
    }

    if (isAgendaValidationError) {
      return {
        status: "error",
        message: "No se pudo validar la agenda en este momento",
      }
    }

    const result = agendaValidationResult

    if (!result || !result.valid) {
      return {
        status: "invalid",
        message:
          result?.message ||
          "El medico no atiende en la sede o ya tiene conflicto de agenda",
      }
    }

    return {
      status: "valid",
      message: result.message || "Horario disponible",
    }
  }, [
    isFormOpen,
    agendaValidationPayload,
    agendaValidationResult,
    isAgendaValidationPending,
    isAgendaValidationError,
  ])

  const openCreateDialog = () => {
    setEditingAppointment(null)
    setForm(defaultAppointmentForm)
    setIsFormOpen(true)
  }

  const openEditDialog = (appointment: OpenapiAppointment) => {
    setEditingAppointment(appointment)
    setForm({
      patientId: appointment.patient.id,
      doctorId: appointment.doctor.id,
      facilityId: appointment.facility.id,
      scheduledAt: toInputDateTime(appointment.scheduledDate),
      status: appointment.status ?? "pending",
    })
    setIsFormOpen(true)
  }

  const handleSubmit = async () => {
    if (
      !form.patientId ||
      !form.doctorId ||
      !form.facilityId ||
      !form.scheduledAt
    ) {
      toast.error("Completa paciente, medico, sede y fecha")
      return
    }

    const body = buildAppointmentBody(
      form,
      patients ?? [],
      doctors ?? [],
      facilities ?? [],
      editingAppointment?.id
    )

    if (!body) {
      toast.error("No se pudo resolver el formulario de cita")
      return
    }

    if (agendaValidation.status === "validating") {
      toast.error("Espera a que termine la validacion de agenda")
      return
    }

    if (agendaValidation.status === "invalid") {
      toast.error(agendaValidation.message)
      return
    }

    if (agendaValidation.status === "error") {
      toast.error("No se pudo validar la agenda, intenta de nuevo")
      return
    }

    if (agendaValidation.status !== "valid") {
      toast.error(
        agendaValidation.message || "La cita no cumple las reglas de agenda"
      )
      return
    }

    if (editingAppointment) {
      await updateMutation.mutateAsync({
        path: { id: editingAppointment.id },
        body,
      })
      return
    }

    await createMutation.mutateAsync({ body })
  }

  const handleCancelAppointment = async (appointment: OpenapiAppointment) => {
    await updateMutation.mutateAsync({
      path: { id: appointment.id },
      body: {
        ...appointment,
        status: "canceled",
      },
    })
  }

  return (
    <div className="space-y-6">
      <section className="bg-card relative overflow-hidden rounded-2xl border p-6 shadow-xs">
        <div className="bg-primary/20 absolute -top-20 -right-12 h-56 w-56 rounded-full blur-3xl" />
        <div className="bg-accent/40 absolute -bottom-20 -left-10 h-56 w-56 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Operaciones clinicas
            </p>
            <h1 className="text-foreground mt-2 text-3xl font-black tracking-tight">
              Gestion de Citas
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              Administra agenda, reprogramaciones y trazabilidad de atenciones
              en tiempo real para todas las sedes.
            </p>
          </div>

          <Button onClick={openCreateDialog}>
            <TbCalendar className="size-4" />
            Nueva cita
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <p className="text-muted-foreground text-xs">Pendientes</p>
          <p className="text-secondary-foreground mt-1 text-2xl font-bold">
            {dashboard.pending}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <p className="text-muted-foreground text-xs">Completadas</p>
          <p className="text-primary mt-1 text-2xl font-bold">
            {dashboard.completed}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <p className="text-muted-foreground text-xs">Canceladas</p>
          <p className="text-destructive mt-1 text-2xl font-bold">
            {dashboard.canceled}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4 shadow-xs">
          <p className="text-muted-foreground text-xs">Proximas 48h</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {dashboard.upcoming48h}
          </p>
        </div>
      </section>

      <section className="bg-card rounded-2xl border p-4 shadow-xs">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <Field className="xl:col-span-1">
            <FieldLabel htmlFor="size">Tamano</FieldLabel>
            <NativeSelect
              id="size"
              value={String(size)}
              onChange={(event) => {
                setSize(Number(event.target.value))
                setPage(0)
              }}
              className="w-full"
            >
              <NativeSelectOption value="15">15</NativeSelectOption>
              <NativeSelectOption value="25">25</NativeSelectOption>
              <NativeSelectOption value="50">50</NativeSelectOption>
            </NativeSelect>
          </Field>

          <Field className="xl:col-span-1">
            <FieldLabel htmlFor="sort">Orden</FieldLabel>
            <NativeSelect
              id="sort"
              value={sortDirection}
              onChange={(event) => {
                const direction = event.target.value === "asc" ? "asc" : "desc"
                setSortDirection(direction)
              }}
              className="w-full"
            >
              <NativeSelectOption value="desc">
                Mas recientes
              </NativeSelectOption>
              <NativeSelectOption value="asc">Mas antiguas</NativeSelectOption>
            </NativeSelect>
          </Field>

          <Field className="xl:col-span-1">
            <FieldLabel htmlFor="status-filter">Estado</FieldLabel>
            <NativeSelect
              id="status-filter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as AppointmentStatusFilter)
              }}
              className="w-full"
            >
              <NativeSelectOption value="ALL">Todos</NativeSelectOption>
              <NativeSelectOption value="pending">Pendiente</NativeSelectOption>
              <NativeSelectOption value="completed">
                Completada
              </NativeSelectOption>
              <NativeSelectOption value="canceled">
                Cancelada
              </NativeSelectOption>
            </NativeSelect>
          </Field>

          <Field className="xl:col-span-1">
            <FieldLabel htmlFor="doctor-filter">Medico</FieldLabel>
            <SearchableSelect
              id="doctor-filter"
              value={doctorFilter}
              onValueChange={setDoctorFilter}
              options={doctorFilterOptions}
              placeholder="Todos"
              searchPlaceholder="Buscar medico..."
              emptyMessage="No hay medicos coincidentes"
              className="w-full"
            />
          </Field>

          <Field className="xl:col-span-1">
            <FieldLabel htmlFor="facility-filter">Sede</FieldLabel>
            <SearchableSelect
              id="facility-filter"
              value={facilityFilter}
              onValueChange={setFacilityFilter}
              options={facilityFilterOptions}
              placeholder="Todas"
              searchPlaceholder="Buscar sede..."
              emptyMessage="No hay sedes coincidentes"
              className="w-full"
            />
          </Field>

          <Field className="xl:col-span-1">
            <FieldLabel htmlFor="dni-filter">DNI paciente</FieldLabel>
            <Input
              id="dni-filter"
              value={dniFilter}
              onChange={(event) => {
                setDniFilter(event.target.value)
              }}
              placeholder="70000000"
            />
          </Field>
        </div>
      </section>

      <section className="bg-card overflow-hidden rounded-2xl border shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-sm">
            <thead className="bg-muted/60 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Medico</th>
                <th className="px-4 py-3 text-left">Sede</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsQuery.isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground px-4 py-10 text-center"
                  >
                    Cargando citas...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground px-4 py-10 text-center"
                  >
                    No hay citas para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-muted/40 border-t"
                  >
                    <td className="px-4 py-3">
                      <div className="text-foreground font-medium">
                        DNI {appointment.patient.nationalId}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Tel: {appointment.patient.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        Dr. {appointment.doctor.firstName}{" "}
                        {appointment.doctor.lastName}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {getDoctorSpecialtiesLabel(appointment.doctor)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {appointment.facility.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {appointment.facility.address}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(appointment.scheduledDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const status = appointment.status ?? "pending"

                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              statusStyles[status]
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${statusDotStyles[status]}`}
                            />
                            {statusLabels[status]}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(appointment)
                          }}
                        >
                          Ver
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            openEditDialog(appointment)
                          }}
                        >
                          <TbPencil className="size-4" />
                          Editar
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setAppointmentToDelete(appointment)
                          }}
                        >
                          <TbTrash className="size-4" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-muted/60 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            Pagina {page + 1} de {totalPages} ({total} registros)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((previous) => Math.max(0, previous - 1))}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page + 1 >= totalPages}
              onClick={() =>
                setPage((previous) => Math.min(totalPages - 1, previous + 1))
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? "Reprogramar cita" : "Nueva cita"}
            </DialogTitle>
            <DialogDescription>
              Selecciona paciente, medico, sede y fecha para guardar la cita.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-2 gap-3">
            <Field>
              <FieldLabel htmlFor="patientId">Paciente (DNI)</FieldLabel>
              <SearchableSelect
                id="patientId"
                value={form.patientId}
                onValueChange={(value) => {
                  setForm((previous) => ({
                    ...previous,
                    patientId: value,
                  }))
                }}
                options={patientOptions}
                autoSelectOnEnter
                placeholder="Selecciona un paciente"
                searchPlaceholder="Buscar por DNI o telefono..."
                emptyMessage="No hay pacientes coincidentes"
                className="w-full"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="doctorId">Medico</FieldLabel>
              <SearchableSelect
                id="doctorId"
                value={form.doctorId}
                onValueChange={(value) => {
                  const selectedDoctor = (doctors ?? []).find(
                    (doctor) => doctor.id === value
                  )
                  const availableFacilityIds = new Set(
                    (selectedDoctor?.facilities ?? []).map(
                      (facility) => facility.id
                    )
                  )

                  setForm((previous) => ({
                    ...previous,
                    doctorId: value,
                    facilityId: availableFacilityIds.has(previous.facilityId)
                      ? previous.facilityId
                      : "",
                  }))
                }}
                options={doctorOptions}
                placeholder="Selecciona un medico"
                searchPlaceholder="Buscar medico..."
                emptyMessage="No hay medicos coincidentes"
                className="w-full"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="facilityId">Sede</FieldLabel>
              <SearchableSelect
                id="facilityId"
                value={form.facilityId}
                onValueChange={(value) => {
                  setForm((previous) => ({
                    ...previous,
                    facilityId: value,
                  }))
                }}
                options={formFacilityOptions}
                placeholder={
                  form.doctorId
                    ? "Selecciona una sede disponible"
                    : "Selecciona primero un medico"
                }
                searchPlaceholder="Buscar sede..."
                emptyMessage={
                  form.doctorId
                    ? "El medico no tiene sedes disponibles"
                    : "Selecciona primero un medico"
                }
                className="w-full"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="scheduledAt">Fecha y hora</FieldLabel>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    scheduledAt: event.target.value,
                  }))
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="status">Estado</FieldLabel>
              <NativeSelect
                id="status"
                value={form.status}
                onChange={(event) => {
                  const status = event.target.value as OpenapiAppointmentStatus
                  setForm((previous) => ({ ...previous, status }))
                }}
                className="w-full"
              >
                <NativeSelectOption value="pending">
                  Pendiente
                </NativeSelectOption>
                <NativeSelectOption value="completed">
                  Completada
                </NativeSelectOption>
                <NativeSelectOption value="canceled">
                  Cancelada
                </NativeSelectOption>
              </NativeSelect>
            </Field>

            <div
              className={`rounded-md border px-3 py-2 text-xs ${
                agendaValidation.status === "valid"
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : agendaValidation.status === "invalid" ||
                      agendaValidation.status === "error"
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-border bg-muted/40 text-muted-foreground"
              }`}
            >
              {agendaValidation.message}
            </div>
          </FieldGroup>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsFormOpen(false)
                setEditingAppointment(null)
              }}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                agendaValidation.status === "validating" ||
                agendaValidation.status === "invalid"
              }
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Guardando..."
                : editingAppointment
                  ? "Guardar cambios"
                  : "Crear cita"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedAppointment)}
        onOpenChange={(open) => {
          if (!open) setSelectedAppointment(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de cita</DialogTitle>
            <DialogDescription>
              Informacion operativa para seguimiento y reprogramacion.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-3 text-sm">
              <div className="bg-muted/50 grid grid-cols-2 gap-2 rounded-lg border p-3">
                <p className="text-muted-foreground">Paciente</p>
                <p className="text-right font-medium">
                  DNI {selectedAppointment.patient.nationalId}
                </p>

                <p className="text-muted-foreground">Medico</p>
                <p className="text-right font-medium">
                  {selectedAppointment.doctor.firstName}{" "}
                  {selectedAppointment.doctor.lastName}
                </p>

                <p className="text-muted-foreground">Especialidades</p>
                <p className="text-right font-medium">
                  {getDoctorSpecialtiesLabel(selectedAppointment.doctor)}
                </p>

                <p className="text-muted-foreground">Sede</p>
                <p className="text-right font-medium">
                  {selectedAppointment.facility.name}
                </p>

                <p className="text-muted-foreground">Direccion sede</p>
                <p className="text-right font-medium">
                  {selectedAppointment.facility.address}
                </p>

                <p className="text-muted-foreground">Fecha</p>
                <p className="text-right font-medium">
                  {new Date(selectedAppointment.scheduledDate).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="mb-2 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Integracion SOAP inter-servicio: appointment -&gt; insurance
                </p>

                {appointmentInsuranceSummaryQuery.isLoading ? (
                  <p className="text-muted-foreground text-xs">
                    Consultando resumen financiero por SOAP...
                  </p>
                ) : appointmentInsuranceSummaryQuery.data ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p className="text-muted-foreground">Estado</p>
                    <p className="text-right font-medium">
                      {appointmentInsuranceSummaryQuery.data.found
                        ? "Factura encontrada"
                        : "Sin factura"}
                    </p>

                    <p className="text-muted-foreground">Detalle</p>
                    <p className="text-right font-medium">
                      {appointmentInsuranceSummaryQuery.data.message}
                    </p>

                    <p className="text-muted-foreground">Aseguradora</p>
                    <p className="text-right font-medium">
                      {appointmentInsuranceSummaryQuery.data
                        .insuranceProviderName ?? "Sin aseguradora"}
                    </p>

                    <p className="text-muted-foreground">Total</p>
                    <p className="text-right font-medium">
                      {appointmentInsuranceSummaryQuery.data.totalAmount ?? 0}
                    </p>

                    <p className="text-muted-foreground">Metodo de pago</p>
                    <p className="text-right font-medium">
                      {appointmentInsuranceSummaryQuery.data.paymentMethod ??
                        "-"}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    No se obtuvo resumen financiero.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedAppointment(null)
                    openEditDialog(selectedAppointment)
                  }}
                >
                  <TbClockHour4 className="size-4" />
                  Reprogramar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    void handleCancelAppointment(selectedAppointment)
                  }}
                  disabled={selectedAppointment.status === "canceled"}
                >
                  Marcar cancelada
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    setAppointmentToDelete(selectedAppointment)
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(appointmentToDelete)}
        onOpenChange={(open) => {
          if (!open) setAppointmentToDelete(null)
        }}
        title="Eliminar cita"
        description="Esta accion es irreversible y eliminara la cita seleccionada."
        confirmLabel="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!appointmentToDelete) return

          void deleteMutation.mutateAsync({
            path: {
              id: appointmentToDelete.id,
            },
          })
        }}
      />
    </div>
  )
}
