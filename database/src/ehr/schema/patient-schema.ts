import { appointmentTable } from "@healthcare/database/appointment/schema/resources-schema"
import { healthRecordTable } from "@healthcare/database/ehr/schema/health-record-schema"
import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

// Tables
export const patientTable = pgTable("patient", {
  id: uuid().defaultRandom().primaryKey(),
  nationalId: varchar({ length: 8 }).notNull().unique(), // DNI
  phone: varchar({ length: 9 }),
})

// Relations
export const patientRelations = relations(patientTable, ({ one, many }) => ({
  healthRecord: one(healthRecordTable),
  appointments: many(appointmentTable),
}))
