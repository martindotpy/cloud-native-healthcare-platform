/**
 * Get element from dom by selector string.
 * @example
 * 	const elementClass = $('.my-class')
 * 	const elementId = $('#my-id')
 * @param selector - CSS selector string
 * @param context - Document or HTMLElement to scope the search
 * @returns HTMLElement
 */
export function $<K extends keyof HTMLElementTagNameMap>(
  selectors: K
): HTMLElementTagNameMap[K] | null
export function $<K extends keyof SVGElementTagNameMap>(
  selectors: K
): SVGElementTagNameMap[K] | null
export function $<K extends keyof MathMLElementTagNameMap>(
  selectors: K
): MathMLElementTagNameMap[K] | null
/** @deprecated */
export function $<K extends keyof HTMLElementDeprecatedTagNameMap>(
  selectors: K
): HTMLElementDeprecatedTagNameMap[K] | null
export function $<E extends Element = Element>(selectors: string): E | null
export function $<E extends HTMLElement>(
  selectors: string,
  context: Document | HTMLElement = document
) {
  const element = context.querySelector<E>(selectors)

  return element
}

/**
 * Get elements from dom by selector string.
 * @example
 * 	const elements = $$('.my-class')
 * @param selector - CSS selector string
 * @param context - Document or HTMLElement to scope the search
 * @returns NodeList
 */
export function $$<K extends keyof HTMLElementTagNameMap>(
  selectors: K
): NodeListOf<HTMLElementTagNameMap[K]>
export function $$<K extends keyof SVGElementTagNameMap>(
  selectors: K
): NodeListOf<SVGElementTagNameMap[K]>
export function $$<K extends keyof MathMLElementTagNameMap>(
  selectors: K
): NodeListOf<MathMLElementTagNameMap[K]>
/** @deprecated */
export function $$<K extends keyof HTMLElementDeprecatedTagNameMap>(
  selectors: K
): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>
export function $$<E extends Element = Element>(
  selectors: string
): NodeListOf<E>
export function $$<E extends Element = Element>(
  selectors: string
): NodeListOf<E>
export function $$<E extends HTMLElement>(
  selectors: string,
  context: Document | HTMLElement = document
) {
  const elements = context.querySelectorAll<E>(selectors)

  return elements
}
