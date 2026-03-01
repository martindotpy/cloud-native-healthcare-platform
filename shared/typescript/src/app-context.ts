// Context
export const { NODE_ENV } = import.meta.env

export const isDev = NODE_ENV === "development"
export const isProd = NODE_ENV === "production"
