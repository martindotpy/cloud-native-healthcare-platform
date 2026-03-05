import {
  getApiAppointmentCountOptions,
  getApiAppointmentOptions,
  getApiClinicalEpisodeCountOptions,
  getApiDoctorCountOptions,
  getApiDoctorOptions,
  getApiFacilityCountOptions,
  getApiHealthRecordCountOptions,
  getApiInsuranceInvoiceCountOptions,
  getApiInsuranceProviderCountOptions,
  getApiPatientCountOptions,
  getApiPrescriptionCountOptions,
  getApiSpecialtyCountOptions,
} from "@healthcare/shared/api/client/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_private/")({
  component: HomeComponent,
})

function HomeComponent() {
  const appointmentsQuery = useQuery(
    getApiAppointmentOptions({
      query: { page: 0, size: 12, sort: ["-scheduledDate"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const doctorsQuery = useQuery(
    getApiDoctorOptions({
      query: { page: 0, size: 120, sort: ["lastName"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const appointmentCountQuery = useQuery(
    getApiAppointmentCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const doctorCountQuery = useQuery(
    getApiDoctorCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const specialtyCountQuery = useQuery(
    getApiSpecialtyCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const facilityCountQuery = useQuery(
    getApiFacilityCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const patientCountQuery = useQuery(
    getApiPatientCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const insuranceProviderCountQuery = useQuery(
    getApiInsuranceProviderCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )
  const insuranceInvoiceCountQuery = useQuery(
    getApiInsuranceInvoiceCountOptions({
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

  const appointments = appointmentsQuery.data ?? []
  const doctors = doctorsQuery.data ?? []
  const doctorWithSpecialty = doctors.filter(
    (doctor) => (doctor.specialties?.length ?? 0) > 0
  ).length
  const doctorWithFacility = doctors.filter(
    (doctor) => (doctor.facilities?.length ?? 0) > 0
  ).length

  const coverageSpecialty =
    doctors.length === 0
      ? 0
      : Math.round((doctorWithSpecialty / doctors.length) * 100)
  const coverageFacility =
    doctors.length === 0
      ? 0
      : Math.round((doctorWithFacility / doctors.length) * 100)

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
          Panel Operativo
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Inicio Clinico
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Vista consolidada de citas, recursos medicos y cobertura de
          especialidades/sedes.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Citas" value={appointmentCountQuery.data ?? 0} />
        <MetricCard label="Pacientes" value={patientCountQuery.data ?? 0} />
        <MetricCard label="Doctores" value={doctorCountQuery.data ?? 0} />
        <MetricCard
          label="Especialidades"
          value={specialtyCountQuery.data ?? 0}
        />
        <MetricCard label="Sedes" value={facilityCountQuery.data ?? 0} />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Aseguradoras"
          value={insuranceProviderCountQuery.data ?? 0}
        />
        <MetricCard
          label="Facturas"
          value={insuranceInvoiceCountQuery.data ?? 0}
        />
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

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">
            Cobertura de Doctores
          </h2>
          <div className="mt-4 space-y-3">
            <CoverageRow
              label="Con especialidades"
              value={`${doctorWithSpecialty}/${doctors.length}`}
              percent={coverageSpecialty}
            />
            <CoverageRow
              label="Con sedes asignadas"
              value={`${doctorWithFacility}/${doctors.length}`}
              percent={coverageFacility}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Proximas Citas</h2>
          <div className="mt-3 space-y-2">
            {appointments.slice(0, 6).map((appointment) => (
              <div
                key={appointment.id}
                className="bg-muted/40 rounded-lg border p-3 text-sm"
              >
                <p className="font-semibold">
                  Dr. {appointment.doctor.firstName}{" "}
                  {appointment.doctor.lastName}
                </p>
                <p className="text-muted-foreground">
                  {appointment.facility.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  Paciente DNI {appointment.patient.nationalId} -{" "}
                  {new Date(appointment.scheduledDate).toLocaleString()}
                </p>
              </div>
            ))}
            {!appointments.length && (
              <p className="text-muted-foreground text-sm">
                No hay citas registradas.
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

function CoverageRow({
  label,
  value,
  percent,
}: {
  label: string
  value: string
  percent: number
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">
          {value} ({percent}%)
        </span>
      </div>
      <div className="bg-muted h-2 rounded-full">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
