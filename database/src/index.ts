import * as appointmentSchema from "@healthcare/database/appointment/schema/resources-schema"
import * as authSchema from "@healthcare/database/auth/schema/auth-schema"
import * as ehrSchema from "@healthcare/database/ehr/schema/health-record-schema"
import * as patientSchema from "@healthcare/database/ehr/schema/patient-schema"
import * as insuranceSchema from "@healthcare/database/insurance/schema/insurance-schema"
import { serverLog } from "@healthcare/shared/log/server-logger"
import { SQL } from "bun"
import { drizzle } from "drizzle-orm/bun-sql"

// Database client
const client = new SQL()

// All schemas
const allSchemas = {
  ...authSchema,
  ...appointmentSchema,
  ...ehrSchema,
  ...patientSchema,
  ...insuranceSchema,
}

// Schema
type Schemas = typeof allSchemas
type StripTableSuffix<S extends string> = S extends `${infer R}Table` ? R : S

type DatabaseSchema = {
  [K in keyof Schemas as StripTableSuffix<K>]: Schemas[K]
}

// Helper to strip "Table" suffix at runtime
const stripTableSuffix = (schemas: Record<string, unknown>) => {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(schemas)) {
    const newKey = key.endsWith("Table") ? key.slice(0, -5) : key
    result[newKey] = value
  }
  return result
}

export const schema = stripTableSuffix(allSchemas) as DatabaseSchema

// Database
export const db = drizzle({
  client,
  schema,
  logger: {
    logQuery(query, params) {
      serverLog.debug({ query, params })
    },
  },
  casing: "snake_case",
})
