import { client } from "@healthcare/shared/api/client/client.gen"
import { authClient } from "@healthcare/web/auth/client/auth-client"
import { $jwt } from "@healthcare/web/auth/store/jwt-store"
import { $auth } from "@healthcare/web/auth/store/user-store"

// Merge the default configuration with the auth configuration
client.setConfig({
  auth: () => {
    const jwt = $jwt.get()

    return jwt ?? undefined
  },
})

// Token refresh logic
interface QueuePromise {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueuePromise[] = []

const processQueue = (
  error: Parameters<QueuePromise["reject"]>[0],
  token: Parameters<QueuePromise["resolve"]>[0] = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

client.getConfig().axios?.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Doesn't refresh if there's no auth or if the error doesn't have a config
    const auth = $auth.get()

    if (!auth || !("config" in error)) return Promise.reject(error)

    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry)
      return Promise.reject(error)

    // If there's already a refresh in progress, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token

          return client.instance.request(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await authClient.refreshToken({
        userId: auth.user.id,
        providerId: "credential",
      })

      if (!data || !data.accessToken) return Promise.reject(error)

      const newAccessToken = data.accessToken
      $jwt.set(newAccessToken)

      processQueue(null, newAccessToken)

      return client.instance.request(originalRequest)
    } catch (err) {
      processQueue(err, null)

      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)
