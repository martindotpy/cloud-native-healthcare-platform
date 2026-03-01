import { consola } from "consola"
import { Writable } from "node:stream"

// Show debug logs
consola.level = 4

export default async function consolaTransport() {
  return new Writable({
    write(chunk, _encoding, callback) {
      const lines = chunk.toString().split("\n").filter(Boolean)

      for (const line of lines) {
        // Try to parse log line as JSON
        let log
        try {
          log = JSON.parse(line)
        } catch {
          consola.info(line)
          continue
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let { level, msg, err, caller, time: _time, ...meta } = log

        // Custom formatting
        if (typeof msg === "string") {
          if (err) {
            msg = "\n  " + msg
          }

          if (Object.keys(meta).length === 0) {
            meta = undefined
          } else {
            msg += "\n "
          }
        }

        const logger = consola.withTag(caller)

        // Add custom ordering of log levels
        const args = (err ? [err, msg, meta] : [msg, meta]).filter(Boolean)

        if (level >= 60) logger.fatal(...args)
        else if (level >= 50) logger.error(...args)
        else if (level >= 40) logger.warn(...args)
        else if (level >= 30) logger.info(...args)
        else logger.debug(...args)
      }

      callback()
    },
  })
}
