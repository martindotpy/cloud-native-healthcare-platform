import { appointmentTable } from "@healthcare/database/appointment/schema/resources-schema"
import { patientTable } from "@healthcare/database/ehr/schema/patient-schema"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Enums
export const healthRecordStatus = ["active", "inactive"] as const

// Tables
export const healthRecordTable = pgTable("health_record", {
  id: uuid().primaryKey().defaultRandom(),
  patientId: uuid()
    .references(() => patientTable.id)
    .notNull()
    .unique(),
  status: varchar({ length: 20, enum: healthRecordStatus }).default("active"),
  createdAt: timestamp().defaultNow(),
})

export const clinicalEpisodeTable = pgTable("clinical_episode", {
  id: uuid().primaryKey().defaultRandom(),
  healthRecordId: uuid()
    .references(() => healthRecordTable.id)
    .notNull(),
  appointmentId: uuid()
    .notNull()
    .unique()
    .references(() => appointmentTable.id),
  diagnosis: text().notNull(),
  treatmentPlan: text(),
  recordedAt: timestamp().defaultNow(),
})

export const prescriptionTable = pgTable("prescription", {
  id: uuid().primaryKey().defaultRandom(),
  clinicalEpisodeId: uuid()
    .references(() => clinicalEpisodeTable.id)
    .notNull(),
  medicationDetails: text().notNull(),
  instructions: text().notNull(),
  issuedAt: timestamp().defaultNow(),
})

// Relations
export const healthRecordRelations = relations(
  healthRecordTable,
  ({ one, many }) => ({
    patient: one(patientTable, {
      fields: [healthRecordTable.patientId],
      references: [patientTable.id],
    }),
    episodes: many(clinicalEpisodeTable),
  })
)
