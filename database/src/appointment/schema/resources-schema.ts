import { patientTable } from "@healthcare/database/ehr/schema/patient-schema"
import { invoiceTable } from "@healthcare/database/insurance/schema/insurance-schema"
import { relations } from "drizzle-orm"
import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enums
export const appointmentStatus = ["pending", "completed", "canceled"] as const

// Tables
export const facilityTable = pgTable("facility", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  address: text().notNull(),
})

export const specialtyTable = pgTable("specialty", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
})

export const doctorTable = pgTable("doctor", {
  id: uuid().defaultRandom().primaryKey(),
  medicalLicense: varchar({ length: 20 }).notNull().unique(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
})

export const appointmentTable = pgTable("appointment", {
  id: uuid().defaultRandom().primaryKey(),
  patientId: uuid()
    .references(() => patientTable.id)
    .notNull(),
  doctorId: uuid()
    .references(() => doctorTable.id)
    .notNull(),
  facilityId: uuid()
    .references(() => facilityTable.id)
    .notNull(),
  scheduledDate: timestamp().notNull(),
  status: varchar({ length: 20, enum: appointmentStatus }).notNull(), // pending, completed, canceled
})

// Many-to-Many: Doctors <-> Specialties
export const doctorSpecialtyTable = pgTable(
  "doctor_specialty",
  {
    doctorId: uuid()
      .references(() => doctorTable.id)
      .notNull(),
    specialtyId: uuid()
      .references(() => specialtyTable.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.doctorId, t.specialtyId] })]
)

// Many-to-Many: Doctors <-> Facilities
export const doctorFacilityTable = pgTable(
  "doctor_facility",
  {
    doctorId: uuid()
      .references(() => doctorTable.id)
      .notNull(),
    facilityId: uuid()
      .references(() => facilityTable.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.doctorId, t.facilityId] })]
)

// Relations
export const doctorRelations = relations(doctorTable, ({ many }) => ({
  specialties: many(doctorSpecialtyTable),
  facilities: many(doctorFacilityTable),
  appointments: many(appointmentTable),
}))

export const appointmentRelations = relations(appointmentTable, ({ one }) => ({
  patient: one(patientTable, {
    fields: [appointmentTable.patientId],
    references: [patientTable.id],
  }),
  doctor: one(doctorTable, {
    fields: [appointmentTable.doctorId],
    references: [doctorTable.id],
  }),
  invoice: one(invoiceTable),
}))
