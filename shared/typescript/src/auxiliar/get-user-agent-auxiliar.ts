// Types
type UserAgent = "unknown" | (string & {})

// Auxiliar
/**
 * Get user agent from request.
 *
 * @param request - The request object.
 * @returns The user agent string or "unknown" if not available.
 */
export function getUserAgent({ headers }: Request): UserAgent {
  return headers.get("user-agent") || "unknown"
}
