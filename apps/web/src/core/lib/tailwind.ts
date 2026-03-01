import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using `clsx` and resolves Tailwind CSS class conflicts using `tailwind-merge`.
 *
 * @param inputs List of class names or conditional expressions.
 * @returns A single merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

/**
 * Combines template strings and values for Tailwind CSS classes.
 * Helps with prettier class name sorting.
 */
export const tw = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values)
