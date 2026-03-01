import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

// Tables
export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  role: text(),
  banned: boolean().default(false),
  banReason: text(),
  banExpires: timestamp(),
  lastName: text().notNull(),
})

export const accountTable = pgTable(
  "account",
  {
    id: uuid().primaryKey().defaultRandom(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
)

export const verificationTable = pgTable(
  "verification",
  {
    id: uuid().primaryKey().defaultRandom(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
)

export const jwksTable = pgTable("jwks", {
  id: uuid().primaryKey().defaultRandom(),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: timestamp().notNull(),
  expiresAt: timestamp(),
})

export const userRelations = relations(userTable, ({ many }) => ({
  accounts: many(accountTable),
}))

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}))
