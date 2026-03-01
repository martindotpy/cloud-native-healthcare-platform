// Types
type IP = "unknown" | (string & {})

// Auxiliar
/**
 * Get IP address from request.
 *
 * @param request - The request object.
 * @returns The IP address string or "unknown" if not available.
 */
export function getIP({ headers }: Request): IP {
  return headers.get("x-real-ip") || "unknown"
}
