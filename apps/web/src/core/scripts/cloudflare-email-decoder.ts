/**
 * Reloads the scripts that decodes the emails in the page.
 */

import { $ } from "@healthcare/web/core/lib/dom-selector"

/**
 * Track the number of page transitions using Astro view transitions.
 * For an unknown reason, the cloudflare script throws an exception on the second page load, stating that a script tag has no parent node.
 * Therefore, we need to manage the execution times to prevent this issue.
 */
let count = 0

document.addEventListener("astro:after-swap", () => {
  // Mange count of page transitions
  count++

  if (count < 2) return

  // Find the script tag that loads the cloudflare email decoder
  const script = $<HTMLScriptElement>("script[src$='email-decode.min.js']")

  if (!script) return

  // Create a new script tag to reload the script
  const newScript = document.createElement("script")

  Array.from(script.attributes).forEach((attr) => {
    newScript.setAttribute(attr.name, attr.value)
  })

  document.head.appendChild(newScript)
})
