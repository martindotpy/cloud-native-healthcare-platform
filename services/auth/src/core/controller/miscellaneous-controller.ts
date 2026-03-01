import Elysia from "elysia"

// Controller
export const miscellaneousController = new Elysia({
  tags: ["Internal"],
}).get("/_health", () => {
  return "Ok" as const
})
