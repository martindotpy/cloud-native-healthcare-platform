import {
  appointmentTable,
  doctorFacilityTable,
  doctorSpecialtyTable,
  doctorTable,
  facilityTable,
  specialtyTable,
} from "@healthcare/database/appointment/schema/resources-schema"
import {
  clinicalEpisodeTable,
  healthRecordTable,
  prescriptionTable,
} from "@healthcare/database/ehr/schema/health-record-schema"
import { patientTable } from "@healthcare/database/ehr/schema/patient-schema"
import { db } from "@healthcare/database/index"
import {
  insuranceProviderTable,
  invoiceTable,
} from "@healthcare/database/insurance/schema/insurance-schema"

const facilityNames = [
  "CMCH - San Martin de Porres",
  "CMCH - Lince",
  "CMCH - Los Olivos",
  "CMCH - Comas",
  "CMCH - Independencia",
  "CMCH - Telemedicina Lima Norte",
]

const specialtyNames = [
  "Medicina Interna",
  "Cardiologia",
  "Neurologia",
  "Traumatologia",
  "Pediatria",
  "Ginecologia",
  "Dermatologia",
  "Psiquiatria",
  "Neumologia",
  "Otorrinolaringologia",
  "Oftalmologia",
  "Endocrinologia",
  "Urologia",
  "Nefrologia",
  "Oncologia",
  "Reumatologia",
]

const firstNamePool = [
  "Ana",
  "Jose",
  "Luis",
  "Maria",
  "Carmen",
  "Jorge",
  "Rosa",
  "Diego",
  "Lucia",
  "Paolo",
  "Valeria",
  "Miguel",
  "Andrea",
  "Fernando",
  "Claudia",
  "Ricardo",
  "Patricia",
  "Alonso",
  "Gabriela",
  "Sergio",
  "Camila",
  "Sebastian",
  "Daniel",
  "Javier",
  "Renato",
  "Ariana",
  "Ximena",
  "Rocio",
  "Daniela",
  "Milagros",
  "Juan",
  "Elena",
  "Pilar",
  "Carolina",
  "Bruno",
  "Fabian",
  "Mariana",
  "Silvia",
  "Liliana",
  "Raul",
  "Nicolas",
  "Hector",
  "Aldo",
  "Sofia",
  "Fiorella",
  "Noelia",
  "Tomas",
  "Victor",
]

const middleNamePool = [
  "Del Carmen",
  "De Los Angeles",
  "Cristina",
  "Alejandra",
  "Isabel",
  "Eduardo",
  "Antonio",
  "Enrique",
  "Martin",
  "Gabriel",
  "Victoria",
  "Soledad",
  "Beatriz",
  "Teresa",
]

const lastNamePool = [
  "Perez",
  "Sanchez",
  "Garcia",
  "Rodriguez",
  "Fernandez",
  "Torres",
  "Diaz",
  "Vasquez",
  "Ramos",
  "Flores",
  "Castillo",
  "Mendoza",
  "Silva",
  "Aguilar",
  "Cruz",
  "Guerrero",
  "Lopez",
  "Morales",
  "Paredes",
  "Navarro",
  "Quispe",
  "Rojas",
  "Salazar",
  "Campos",
  "Huaman",
  "Vega",
  "Espinoza",
  "Palacios",
  "Ortega",
  "Cabrera",
  "Araujo",
  "Reyes",
  "Peña",
  "Valdivia",
]

const diagnosisPool = [
  "Hipertension arterial controlada",
  "Infeccion respiratoria aguda",
  "Dolor lumbar mecanico",
  "Migraña episodica",
  "Gastritis cronica",
  "Diabetes mellitus tipo 2",
  "Dermatitis atopica",
  "Rinitis alergica",
  "Ansiedad generalizada",
  "Asma bronquial",
]

const treatmentPool = [
  "Control clinico en 14 dias y ajuste terapeutico segun evolucion.",
  "Indicaciones de reposo, hidratacion y reevaluacion en caso de alarma.",
  "Manejo farmacologico inicial y fisioterapia ambulatoria.",
  "Seguimiento por teleconsulta y monitorizacion de signos en domicilio.",
  "Plan nutricional, actividad fisica y control metabolico en 30 dias.",
]

const medicationPool = [
  "Paracetamol 500mg",
  "Ibuprofeno 400mg",
  "Losartan 50mg",
  "Metformina 850mg",
  "Amoxicilina 500mg",
  "Omeprazol 20mg",
  "Loratadina 10mg",
  "Salbutamol inhalador",
]

const buildDoctorName = (rng: () => number) => {
  const firstName = pickOne(rng, firstNamePool)
  const includeMiddleName = rng() > 0.68
  const middleName = includeMiddleName ? ` ${pickOne(rng, middleNamePool)}` : ""

  const firstLastName = pickOne(rng, lastNamePool)
  const secondLastName = pickOne(
    rng,
    lastNamePool.filter((lastName) => lastName !== firstLastName)
  )

  return {
    firstName: `${firstName}${middleName}`,
    lastName: `${firstLastName} ${secondLastName}`,
  }
}

const instructionPool = [
  "Tomar cada 8 horas despues de alimentos por 5 dias.",
  "Tomar una vez al dia por las noches durante 30 dias.",
  "Aplicar segun indicacion medica y control de sintomas.",
  "No suspender tratamiento sin autorizacion medica.",
]

const insuranceProviders = [
  {
    name: "Pacifico Salud",
    coverageDetails:
      "Cobertura ambulatoria y hospitalaria para red preferente.",
  },
  {
    name: "Rimac EPS",
    coverageDetails: "Cobertura en consulta externa, emergencia y farmacia.",
  },
  {
    name: "Mapfre",
    coverageDetails: "Cobertura parcial con copago variable por especialidad.",
  },
  {
    name: "La Positiva",
    coverageDetails: "Cobertura anual con deducible por atencion.",
  },
  {
    name: "Particular",
    coverageDetails: "Atencion sin aseguradora con pago directo.",
  },
]

const paymentMethods = ["cash", "card", "transfer", "insurance"]

const statusPending = "pending" as const
const statusCompleted = "completed" as const
const statusCanceled = "canceled" as const

const makeUuid = (id: number) =>
  `00000000-0000-4000-8000-${id.toString().padStart(12, "0")}`

const createRng = (seed: number) => {
  let t = seed

  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)

    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const randomInt = (rng: () => number, min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min

const pickOne = <T>(rng: () => number, array: readonly T[]) =>
  array[randomInt(rng, 0, array.length - 1)] as T

const pickUnique = <T>(
  rng: () => number,
  array: readonly T[],
  count: number
) => {
  const pool = [...array]
  const result: T[] = []

  while (pool.length > 0 && result.length < count) {
    const index = randomInt(rng, 0, pool.length - 1)
    const [value] = pool.splice(index, 1)
    if (value !== undefined) result.push(value)
  }

  return result
}

const chunkArray = <T>(items: readonly T[], size: number) => {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size) as T[])
  }
  return chunks
}

async function insertInChunks<TTable, TValue>(
  table: TTable,
  values: readonly TValue[],
  chunkSize = 200
) {
  for (const chunk of chunkArray(values, chunkSize)) {
    if (chunk.length === 0) continue

    await db
      .insert(table as never)
      .values(chunk as never)
      .onConflictDoNothing()
  }
}

export async function runCmchSeed() {
  const rng = createRng(20260305)

  const facilities = facilityNames.map((name, index) => ({
    id: makeUuid(10_000 + index + 1),
    name,
    address: `Av. Salud Integral ${210 + index}, Lima`,
  }))

  const specialties = specialtyNames.map((name, index) => ({
    id: makeUuid(20_000 + index + 1),
    name,
  }))

  const doctors = Array.from({ length: 64 }, (_, index) => {
    const name = buildDoctorName(rng)

    return {
      id: makeUuid(30_000 + index + 1),
      medicalLicense: `CMP${(10_000 + index).toString().padStart(6, "0")}`,
      firstName: name.firstName,
      lastName: name.lastName,
    }
  })

  const doctorSpecialties = doctors.flatMap((doctor) => {
    const total = randomInt(rng, 1, 3)
    const selectedSpecialties = pickUnique(rng, specialties, total)

    return selectedSpecialties.map((specialty) => ({
      doctorId: doctor.id,
      specialtyId: specialty.id,
    }))
  })

  const doctorFacilities = doctors.flatMap((doctor) => {
    const total = randomInt(rng, 1, 2)
    const selectedFacilities = pickUnique(rng, facilities, total)

    return selectedFacilities.map((facility) => ({
      doctorId: doctor.id,
      facilityId: facility.id,
    }))
  })

  const facilityByDoctor = new Map<string, string[]>()
  for (const row of doctorFacilities) {
    const list = facilityByDoctor.get(row.doctorId) ?? []
    list.push(row.facilityId)
    facilityByDoctor.set(row.doctorId, list)
  }

  const patients = Array.from({ length: 420 }, (_, index) => ({
    id: makeUuid(40_000 + index + 1),
    nationalId: (70_000_000 + index).toString(),
    phone: `9${(10_000_000 + index).toString().slice(0, 8)}`,
  }))

  const healthRecords = patients.map((patient, index) => ({
    id: makeUuid(50_000 + index + 1),
    patientId: patient.id,
    status: index % 12 === 0 ? "inactive" : "active",
    createdAt: new Date(Date.UTC(2024, 0, 1 + (index % 25), 8, 0, 0)),
  }))

  const appointments = Array.from({ length: 1200 }, (_, index) => {
    const patient = patients[
      index % patients.length
    ] as (typeof patients)[number]
    const doctor = pickOne(rng, doctors)
    const doctorFacilityIds = facilityByDoctor.get(doctor.id) ?? [
      facilities[0]!.id,
    ]
    const facilityId = pickOne(rng, doctorFacilityIds)

    const statusRoll = rng()
    const dayOffset =
      statusRoll < 0.55 ? randomInt(rng, 1, 120) : -randomInt(rng, 1, 180)

    const status =
      statusRoll < 0.55
        ? statusPending
        : statusRoll < 0.85
          ? statusCompleted
          : statusCanceled

    const date = new Date(
      Date.UTC(2026, 2, 5 + dayOffset, randomInt(rng, 8, 19), 0, 0)
    )

    return {
      id: makeUuid(60_000 + index + 1),
      patientId: patient.id,
      doctorId: doctor.id,
      facilityId,
      scheduledDate: date,
      status,
    }
  })

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === statusCompleted
  )

  const healthRecordByPatient = new Map(
    healthRecords.map((record) => [record.patientId, record.id])
  )

  const clinicalEpisodes = completedAppointments
    .filter(() => rng() > 0.15)
    .map((appointment, index) => {
      const healthRecordId =
        healthRecordByPatient.get(appointment.patientId) ?? healthRecords[0]!.id

      return {
        id: makeUuid(70_000 + index + 1),
        healthRecordId,
        appointmentId: appointment.id,
        diagnosis: pickOne(rng, diagnosisPool),
        treatmentPlan: pickOne(rng, treatmentPool),
        recordedAt: appointment.scheduledDate,
      }
    })

  const prescriptions = clinicalEpisodes
    .filter(() => rng() > 0.3)
    .map((episode, index) => ({
      id: makeUuid(80_000 + index + 1),
      clinicalEpisodeId: episode.id,
      medicationDetails: pickOne(rng, medicationPool),
      instructions: pickOne(rng, instructionPool),
      issuedAt: episode.recordedAt,
    }))

  const providers = insuranceProviders.map((provider, index) => ({
    id: makeUuid(90_000 + index + 1),
    ...provider,
  }))

  const invoices = appointments.map((appointment, index) => {
    const provider = rng() > 0.25 ? pickOne(rng, providers) : null
    const amount = (80 + rng() * 520).toFixed(2)

    return {
      id: makeUuid(100_000 + index + 1),
      appointmentId: appointment.id,
      insuranceProviderId: provider?.id,
      totalAmount: amount,
      paymentMethod: pickOne(rng, paymentMethods),
      issuedAt: appointment.scheduledDate,
    }
  })

  await insertInChunks(facilityTable, facilities)
  await insertInChunks(specialtyTable, specialties)
  await insertInChunks(doctorTable, doctors)
  await insertInChunks(doctorSpecialtyTable, doctorSpecialties)
  await insertInChunks(doctorFacilityTable, doctorFacilities)
  await insertInChunks(patientTable, patients)
  await insertInChunks(healthRecordTable, healthRecords)
  await insertInChunks(appointmentTable, appointments)
  await insertInChunks(clinicalEpisodeTable, clinicalEpisodes)
  await insertInChunks(prescriptionTable, prescriptions)
  await insertInChunks(insuranceProviderTable, providers)
  await insertInChunks(invoiceTable, invoices)
}
