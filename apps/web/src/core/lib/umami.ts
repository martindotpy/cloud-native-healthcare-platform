import { log } from "@healthcare/shared/log/client-logger"

// Logger
const _log = log.withTag("umami")

// Check for Umami presence with a fixed number of attempts
const maxAttempts = 5
const intervalMs = 600 // 5 * 600ms = 3000ms total window
const hasUmami = await new Promise((resolve) => {
  let attempts = 0

  const check = () => {
    attempts += 1
    _log.trace(`Checking for Umami script (attempt ${attempts}/${maxAttempts})`)

    if (typeof globalThis.umami === "object" && globalThis.umami !== null) {
      _log.trace("Umami script found")
      resolve(true)
      return
    }

    if (attempts >= maxAttempts) {
      _log.warn("Umami script not found after maximum attempts")
      resolve(false)
      return
    }

    setTimeout(check, intervalMs)
  }

  check()
})

/**
 * Represents the successful case where Umami is available
 * and the main function can be executed.
 */
type WithData<T> = {
  ok: true
  data: T
  fallback: undefined
}

/**
 * Represents the fallback case where Umami is not available
 * and a fallback value is returned instead.
 */
type WithFallback<F> = {
  data: undefined
  fallback: F
}

/**
 * Executes a function only if Umami is available.
 * If Umami is not available, it optionally executes a fallback function.
 *
 * The return type is a discriminated union, which allows TypeScript
 * to correctly infer the relationship between `data` and `fallback`.
 */
export function withUmami<TReturn>(
  fn: () => TReturn
): WithData<TReturn> | WithFallback<undefined>

export function withUmami<TReturn, TFallback>(
  fn: () => TReturn,
  fallback: () => TFallback
): WithData<TReturn> | WithFallback<TFallback>

export function withUmami<TReturn, TFallback>(
  fn: () => TReturn,
  fallback?: () => TFallback
) {
  if (!hasUmami) {
    return {
      ok: false,
      data: undefined,
      fallback: fallback ? fallback() : undefined,
    }
  }

  return {
    ok: true,
    data: fn(),
    fallback: undefined,
  }
}
