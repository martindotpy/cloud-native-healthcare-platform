import {
  getApiDoctorCountOptions,
  getApiDoctorCountQueryKey,
  getApiDoctorOptions,
  getApiDoctorQueryKey,
  getApiFacilityOptions,
  getApiSpecialtyOptions,
  postApiDoctorByDoctorIdFacilityByFacilityIdMutation,
  postApiDoctorByDoctorIdSpecialtyBySpecialtyIdMutation,
  postApiDoctorMutation,
} from "@healthcare/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiDoctor } from "@healthcare/shared/api/client/types.gen"
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

export const Route = createFileRoute("/_private/doctores")({
  component: DoctorsPage,
})

function DoctorsPage() {
  const queryClient = useQueryClient()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [medicalLicense, setMedicalLicense] = useState("")
  const [selectedDoctorId, setSelectedDoctorId] = useState("")
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("")
  const [selectedFacilityId, setSelectedFacilityId] = useState("")

  const doctorsQuery = useQuery(
    getApiDoctorOptions({
      query: { page: 0, size: 200, sort: ["lastName"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const doctorCountQuery = useQuery(
    getApiDoctorCountOptions({
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const specialtiesQuery = useQuery(
    getApiSpecialtyOptions({
      query: { page: 0, size: 200, sort: ["name"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const facilitiesQuery = useQuery(
    getApiFacilityOptions({
      query: { page: 0, size: 120, sort: ["name"] },
      security: [{ type: "http", scheme: "bearer" }],
    })
  )

  const invalidateDoctors = async () => {
    await queryClient.invalidateQueries({ queryKey: getApiDoctorQueryKey() })
    await queryClient.invalidateQueries({
      queryKey: getApiDoctorCountQueryKey(),
    })
  }

  const createDoctorMutation = useMutation({
    ...postApiDoctorMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async () => {
      await invalidateDoctors()
      setFirstName("")
      setLastName("")
      setMedicalLicense("")
      toast.success("Doctor registrado")
    },
    onError: () => {
      toast.error("No se pudo registrar el doctor")
    },
  })

  const assignSpecialtyMutation = useMutation({
    ...postApiDoctorByDoctorIdSpecialtyBySpecialtyIdMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async (data) => {
      await invalidateDoctors()
      toast.success(data.message ?? "Especialidad asignada")
    },
    onError: () => {
      toast.error("No se pudo asignar la especialidad")
    },
  })

  const assignFacilityMutation = useMutation({
    ...postApiDoctorByDoctorIdFacilityByFacilityIdMutation({
      security: [{ type: "http", scheme: "bearer" }],
    }),
    onSuccess: async (data) => {
      await invalidateDoctors()
      toast.success(data.message ?? "Sede asignada")
    },
    onError: () => {
      toast.error("No se pudo asignar la sede")
    },
  })

  const doctors = doctorsQuery.data ?? []
  const doctorOptions = useMemo<SearchableSelectOption[]>(() => {
    return doctors.map((doctor) => ({
      value: doctor.id,
      label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      keywords: `${doctor.firstName} ${doctor.lastName} ${doctor.medicalLicense}`,
    }))
  }, [doctors])

  const specialtyOptions = useMemo<SearchableSelectOption[]>(() => {
    return (specialtiesQuery.data ?? []).map((specialty) => ({
      value: specialty.id,
      label: specialty.name,
    }))
  }, [specialtiesQuery.data])

  const facilityOptions = useMemo<SearchableSelectOption[]>(() => {
    return (facilitiesQuery.data ?? []).map((facility) => ({
      value: facility.id,
      label: facility.name,
      keywords: facility.address,
    }))
  }, [facilitiesQuery.data])

  const handleCreateDoctor = async () => {
    if (!firstName || !lastName || !medicalLicense) {
      toast.error("Completa nombre, apellido y CMP")
      return
    }

    await createDoctorMutation.mutateAsync({
      body: {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        medicalLicense,
      },
    })
  }

  const handleAssignSpecialty = async () => {
    if (!selectedDoctorId || !selectedSpecialtyId) {
      toast.error("Selecciona doctor y especialidad")
      return
    }

    await assignSpecialtyMutation.mutateAsync({
      path: {
        doctorId: selectedDoctorId,
        specialtyId: selectedSpecialtyId,
      },
    })
  }

  const handleAssignFacility = async () => {
    if (!selectedDoctorId || !selectedFacilityId) {
      toast.error("Selecciona doctor y sede")
      return
    }

    await assignFacilityMutation.mutateAsync({
      path: {
        doctorId: selectedDoctorId,
        facilityId: selectedFacilityId,
      },
    })
  }

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase">
          Gestion Clinica
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Doctores</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Alta de medicos y asignacion de especialidades y sedes para habilitar
          agenda.
        </p>
        <p className="mt-4 text-sm font-semibold">
          Total registrados: {doctorCountQuery.data ?? 0}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bg-card rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Registrar Doctor</h2>
          <FieldGroup className="mt-3 gap-3">
            <Field>
              <FieldLabel htmlFor="doctor-first-name">Nombre</FieldLabel>
              <Input
                id="doctor-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="doctor-last-name">Apellido</FieldLabel>
              <Input
                id="doctor-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="doctor-license">CMP</FieldLabel>
              <Input
                id="doctor-license"
                value={medicalLicense}
                onChange={(event) => setMedicalLicense(event.target.value)}
              />
            </Field>
            <Button
              onClick={handleCreateDoctor}
              disabled={createDoctorMutation.isPending}
            >
              {createDoctorMutation.isPending
                ? "Guardando..."
                : "Registrar doctor"}
            </Button>
          </FieldGroup>
        </div>

        <div className="bg-card space-y-4 rounded-2xl border p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase">Asignaciones</h2>
          <Field>
            <FieldLabel htmlFor="assign-doctor">Doctor</FieldLabel>
            <SearchableSelect
              id="assign-doctor"
              value={selectedDoctorId}
              onValueChange={setSelectedDoctorId}
              options={doctorOptions}
              placeholder="Selecciona un doctor"
              searchPlaceholder="Buscar doctor..."
              emptyMessage="No hay doctores coincidentes"
              className="w-full"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="assign-specialty">Especialidad</FieldLabel>
            <div className="flex gap-2">
              <SearchableSelect
                id="assign-specialty"
                value={selectedSpecialtyId}
                onValueChange={setSelectedSpecialtyId}
                options={specialtyOptions}
                placeholder="Selecciona especialidad"
                searchPlaceholder="Buscar especialidad..."
                emptyMessage="No hay especialidades coincidentes"
                className="w-full"
              />
              <Button
                variant="outline"
                onClick={handleAssignSpecialty}
                disabled={assignSpecialtyMutation.isPending}
              >
                Asignar
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="assign-facility">Sede</FieldLabel>
            <div className="flex gap-2">
              <SearchableSelect
                id="assign-facility"
                value={selectedFacilityId}
                onValueChange={setSelectedFacilityId}
                options={facilityOptions}
                placeholder="Selecciona sede"
                searchPlaceholder="Buscar sede..."
                emptyMessage="No hay sedes coincidentes"
                className="w-full"
              />
              <Button
                variant="outline"
                onClick={handleAssignFacility}
                disabled={assignFacilityMutation.isPending}
              >
                Asignar
              </Button>
            </div>
          </Field>
        </div>
      </section>

      <section className="bg-card overflow-hidden rounded-2xl border shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-220 text-sm">
            <thead className="bg-muted/60 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Doctor</th>
                <th className="px-4 py-3 text-left">CMP</th>
                <th className="px-4 py-3 text-left">Especialidades</th>
                <th className="px-4 py-3 text-left">Sedes</th>
              </tr>
            </thead>
            <tbody>
              {doctorsQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-8 text-center" colSpan={4}>
                    Cargando doctores...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center" colSpan={4}>
                    No hay doctores registrados.
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <DoctorRow key={doctor.id} doctor={doctor} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function DoctorRow({ doctor }: { doctor: OpenapiDoctor }) {
  const specialties =
    doctor.specialties?.map((item) => item.name).join(", ") ||
    "Sin especialidades"
  const facilities =
    doctor.facilities?.map((item) => item.name).join(", ") || "Sin sedes"

  return (
    <tr className="border-t">
      <td className="px-4 py-3 font-medium">
        Dr. {doctor.firstName} {doctor.lastName}
      </td>
      <td className="px-4 py-3">{doctor.medicalLicense}</td>
      <td className="px-4 py-3">{specialties}</td>
      <td className="px-4 py-3">{facilities}</td>
    </tr>
  )
}
