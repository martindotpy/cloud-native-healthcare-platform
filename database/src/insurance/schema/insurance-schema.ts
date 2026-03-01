import { appointmentTable } from "@healthcare/database/appointment/schema/resources-schema"
import {
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Tables
export const insuranceProviderTable = pgTable("insurance_provider", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull(),
  coverageDetails: text(),
})

export const invoiceTable = pgTable("invoice", {
  id: uuid().primaryKey().defaultRandom(),
  appointmentId: uuid()
    .references(() => appointmentTable.id)
    .notNull()
    .unique(),
  insuranceProviderId: uuid().references(() => insuranceProviderTable.id),
  totalAmount: decimal({ precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar({ length: 50 }).notNull(),
  issuedAt: timestamp().defaultNow(),
})
