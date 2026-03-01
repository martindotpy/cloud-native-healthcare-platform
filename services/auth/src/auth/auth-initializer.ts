import { auth } from "@healthcare/auth/auth/configuration/auth-configuration"
import {
  adminEmail,
  adminPassword,
} from "@healthcare/auth/core/configuration/app-configuration"
import { db } from "@healthcare/database"
import { userTable } from "@healthcare/database/auth/schema/auth-schema"

/**
 * Initializes the authentication system.
 */
export async function initializeAuth() {
  console.log("Initializing authentication...")

  // Generate the default admin user
  // - Verify if the user already exists
  const [userResult] = await db.select().from(userTable).limit(1)

  if (userResult) {
    console.log("User is already created")

    return
  }

  // Create the user
  try {
    const newUser = await auth.api.createUser({
      body: {
        name: "Martin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        data: {
          lastName: "Dev",
        },
      },
    })

    console.log("Created default admin user:", newUser)
  } catch (error) {
    console.error("Failed to create the default admin user:\n", error)

    throw error
  }
}
