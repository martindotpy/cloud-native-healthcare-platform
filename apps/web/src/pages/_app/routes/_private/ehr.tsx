import {
  getApiAppointmentOptions,
  getApiClinicalEpisodeCountOptions,
  getApiClinicalEpisodeCountQueryKey,
  getApiClinicalEpisodeOptions,
  getApiClinicalEpisodeQueryKey,
  getApiHealthRecordCountOptions,
  getApiHealthRecordCountQueryKey,
  getApiHealthRecordOptions,
  getApiHealthRecordQueryKey,
  getApiPatientOptions,
  getApiPrescriptionCountOptions,
  getApiPrescriptionCountQueryKey,
  getApiPrescriptionOptions,
  getApiPrescriptionQueryKey,
  postApiClinicalEpisodeRegisterMutation,
  postApiHealthRecordMutation,
  postApiPrescriptionRegisterMutation,
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

export const Route = createFileRoute("/_private/ehr")({
  component: EhrPage,
})

function EhrPage() {
  const queryClient = useQueryClient()

  const [patientId, setPatientId] = useState("")
  const [healthRecordId, setHealthRecordId] = useState("")
  const [appointmentId, setAppointmentId] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [treatmentPlan, setTreatmentPlan] = useState("")
  const [clinicalEpisodeId, setClinicalEpisodeId] = useState("")
  const [medicationDetails, setMedicationDetails] = useState("")
  const [instructions, setInstructions] = useState("")

  const patientsQuery = useQuery(
    getApiPatientOptions({
      query: { page: 0, size: 500, sort: ["nationalId"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const appointmentsQuery = useQuery(
    getApiAppointmentOptions({
      query: { page: 0, size: 500, sort: ["-scheduledDate"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const healthRecordsQuery = useQuery(
    getApiHealthRecordOptions({
      query: { page: 0, size: 500, sort: ["-createdAt"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const clinicalEpisodesQuery = useQuery(
    getApiClinicalEpisodeOptions({
      query: { page: 0, size: 500, sort: ["-recordedAt"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const prescriptionsQuery = useQuery(
    getApiPrescriptionOptions({
      query: { page: 0, size: 500, sort: ["-issuedAt"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const healthRecordCountQuery = useQuery(
    getApiHealthRecordCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const clinicalEpisodeCountQuery = useQuery(
    getApiClinicalEpisodeCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const prescriptionCountQuery = useQuery(
    getApiPrescriptionCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const createHealthRecordMutation = useMutation({
    ...postApiHealthRecordMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getApiHealthRecordQueryKey(),
      })
      await queryClient.invalidateQueries({
        queryKey: getApiHealthRecordCountQueryKey(),
      })
      setPatientId("")
      toast.success("Historia clinica registrada")
    },
    onError: () => {
      toast.error("No se pudo registrar la historia clinica")
    },
  })

  const createClinicalEpisodeMutation = useMutation({
    ...postApiClinicalEpisodeRegisterMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getApiClinicalEpisodeQueryKey(),
      })
      await queryClient.invalidateQueries({
        queryKey: getApiClinicalEpisodeCountQueryKey(),
      })
      setClinicalEpisodeId(data.clinicalEpisodeId ?? "")
      setDiagnosis("")
      setTreatmentPlan("")
      toast.success(data.message ?? "Episodio clinico registrado")
    },
    onError: () => {
      toast.error("No se pudo registrar el episodio clinico")
    },
  })

  const createPrescriptionMutation = useMutation({
    ...postApiPrescriptionRegisterMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getApiPrescriptionQueryKey(),
      })
      await queryClient.invalidateQueries({
        queryKey: getApiPrescriptionCountQueryKey(),
      })
      setMedicationDetails("")
      setInstructions("")
      toast.success(data.message ?? "Receta registrada")
    },
    onError: () => {
      toast.error("No se pudo registrar la receta")
    },
  })

  const handleCreateHealthRecord = async () => {
    const selectedPatient = (patientsQuery.data ?? []).find(
      (item) => item.id === patientId
    )

    if (!selectedPatient) {
      toast.error("Selecciona un cliente")
      return
    }

    await createHealthRecordMutation.mutateAsync({
      body: {
        id: crypto.randomUUID(),
        patient: selectedPatient,
        status: "ACTIVE",
      },
    })
  }

  const handleCreateClinicalEpisode = async () => {
    if (!healthRecordId || !appointmentId || !diagnosis.trim()) {
      toast.error("Completa historia clinica, cita y diagnostico")
      return
    }

    const response = await createClinicalEpisodeMutation.mutateAsync({
      body: {
        healthRecordId,
        appointmentId,
        diagnosis: diagnosis.trim(),
        treatmentPlan: treatmentPlan.trim() || undefined,
      },
    })

    if (response.clinicalEpisodeId) {
      setClinicalEpisodeId(response.clinicalEpisodeId)
    }
  }

  const handleCreatePrescription = async () => {
    if (
      !clinicalEpisodeId ||
      !medicationDetails.trim() ||
      !instructions.trim()
    ) {
      toast.error("Completa episodio clinico, medicamento e instrucciones")
      return
    }

    await createPrescriptionMutation.mutateAsync({
      body: {
        clinicalEpisodeId,
        medicationDetails: medicationDetails.trim(),
        instructions: instructions.trim(),
      },
    })
  }

  const patientOptions = useMemo<SearchableSelectOption[]>(() => {
    return (patientsQuery.data ?? []).map((patient) => ({
      value: patient.id,
      label: `DNI ${patient.nationalId}`,
      keywords: `${patient.nationalId} ${patient.phone}`,
    }))
  }, [patientsQuery.data])

  const healthRecordOptions = useMemo<SearchableSelectOption[]>(() => {
    return (healthRecordsQuery.data ?? []).map((record) => ({
      value: record.id,
      label: `${record.id} - DNI ${record.patient.nationalId}`,
      keywords: `${record.id} ${record.patient.nationalId}`,
    }))
  }, [healthRecordsQuery.data])

  const appointmentOptions = useMemo<SearchableSelectOption[]>(() => {
    return (appointmentsQuery.data ?? []).map((appointment) => ({
      value: appointment.id,
      label: `DNI ${appointment.patient.nationalId} - ${new Date(appointment.scheduledDate).toLocaleDateString()}`,
      keywords: `${appointment.patient.nationalId} ${appointment.doctor.firstName} ${appointment.doctor.lastName} ${appointment.facility.name}`,
    }))
  }, [appointmentsQuery.data])

  const clinicalEpisodeOptions = useMemo<SearchableSelectOption[]>(() => {
    return (clinicalEpisodesQuery.data ?? []).map((episode) => ({
      value: episode.id,
      label: `${episode.id} - ${episode.diagnosis}`,
      keywords: `${episode.id} ${episode.diagnosis}`,
    }))
  }, [clinicalEpisodesQuery.data])

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
          Historia Clinica Electronica
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">EHR</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Gestion integral de historias clinicas, episodios medicos y recetas
          electronicas.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Historias Clinicas"
          value={healthRecordCountQuery.data ?? 0}
        />
        <MetricCard
          label="Episodios Clinicos"
          value={clinicalEpisodeCountQuery.data ?? 0}
        />
        <MetricCard label="Recetas" value={prescriptionCountQuery.data ?? 0} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">
            1. Crear Historia Clinica
          </h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="ehr-patient">Cliente</FieldLabel>
              <SearchableSelect
                id="ehr-patient"
                value={patientId}
                onValueChange={setPatientId}
                options={patientOptions}
                placeholder="Selecciona cliente"
                searchPlaceholder="Buscar cliente por DNI..."
                emptyMessage="No hay clientes coincidentes"
                className="w-full"
              />
            </Field>
            <Button
              onClick={handleCreateHealthRecord}
              disabled={createHealthRecordMutation.isPending}
            >
              {createHealthRecordMutation.isPending
                ? "Guardando..."
                : "Crear historia"}
            </Button>
          </FieldGroup>
        </div>

        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">
            2. Registrar Episodio
          </h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="ehr-health-record">
                Historia Clinica
              </FieldLabel>
              <SearchableSelect
                id="ehr-health-record"
                value={healthRecordId}
                onValueChange={setHealthRecordId}
                options={healthRecordOptions}
                placeholder="Selecciona historia"
                searchPlaceholder="Buscar historia por ID o DNI..."
                emptyMessage="No hay historias coincidentes"
                className="w-full"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ehr-appointment">Cita</FieldLabel>
              <SearchableSelect
                id="ehr-appointment"
                value={appointmentId}
                onValueChange={setAppointmentId}
                options={appointmentOptions}
                placeholder="Selecciona cita"
                searchPlaceholder="Buscar cita por DNI o doctor..."
                emptyMessage="No hay citas coincidentes"
                className="w-full"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ehr-diagnosis">Diagnostico</FieldLabel>
              <Input
                id="ehr-diagnosis"
                value={diagnosis}
                onChange={(event) => setDiagnosis(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ehr-treatment">
                Plan de tratamiento
              </FieldLabel>
              <Input
                id="ehr-treatment"
                value={treatmentPlan}
                onChange={(event) => setTreatmentPlan(event.target.value)}
              />
            </Field>
            <Button
              onClick={handleCreateClinicalEpisode}
              disabled={createClinicalEpisodeMutation.isPending}
            >
              {createClinicalEpisodeMutation.isPending
                ? "Guardando..."
                : "Registrar episodio"}
            </Button>
          </FieldGroup>
        </div>

        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">3. Emitir Receta</h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="ehr-episode">Episodio Clinico</FieldLabel>
              <SearchableSelect
                id="ehr-episode"
                value={clinicalEpisodeId}
                onValueChange={setClinicalEpisodeId}
                options={clinicalEpisodeOptions}
                placeholder="Selecciona episodio"
                searchPlaceholder="Buscar episodio por ID o diagnostico..."
                emptyMessage="No hay episodios coincidentes"
                className="w-full"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ehr-medication">Medicamento</FieldLabel>
              <Input
                id="ehr-medication"
                value={medicationDetails}
                onChange={(event) => setMedicationDetails(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ehr-instructions">Instrucciones</FieldLabel>
              <Input
                id="ehr-instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </Field>
            <Button
              onClick={handleCreatePrescription}
              disabled={createPrescriptionMutation.isPending}
            >
              {createPrescriptionMutation.isPending
                ? "Guardando..."
                : "Emitir receta"}
            </Button>
          </FieldGroup>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">
            Ultimos Episodios Clinicos
          </h2>
          <div className="mt-3 space-y-2">
            {(clinicalEpisodesQuery.data ?? []).slice(0, 8).map((episode) => (
              <div
                key={episode.id}
                className="bg-muted/40 rounded-lg border p-3 text-sm"
              >
                <p className="font-semibold">{episode.diagnosis}</p>
                <p className="text-muted-foreground">
                  Cita:{" "}
                  {new Date(episode.appointment.scheduledDate).toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  DNI: {episode.healthRecord.patient.nationalId}
                </p>
              </div>
            ))}
            {(clinicalEpisodesQuery.data ?? []).length === 0 && (
              <p className="text-muted-foreground text-sm">
                No hay episodios registrados.
              </p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Ultimas Recetas</h2>
          <div className="mt-3 space-y-2">
            {(prescriptionsQuery.data ?? []).slice(0, 8).map((prescription) => (
              <div
                key={prescription.id}
                className="bg-muted/40 rounded-lg border p-3 text-sm"
              >
                <p className="font-semibold">
                  {prescription.medicationDetails}
                </p>
                <p className="text-muted-foreground">
                  Instrucciones: {prescription.instructions}
                </p>
                <p className="text-muted-foreground">
                  Diagnostico: {prescription.clinicalEpisode.diagnosis}
                </p>
              </div>
            ))}
            {(prescriptionsQuery.data ?? []).length === 0 && (
              <p className="text-muted-foreground text-sm">
                No hay recetas registradas.
              </p>
            )}
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
