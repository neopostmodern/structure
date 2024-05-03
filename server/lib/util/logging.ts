import colors from 'colors/safe'
import { performance } from 'perf_hooks'
import tracer from 'tracer'
export { default as colors } from 'colors'

export const logger = tracer.colorConsole({
  level: 'debug',
  methods: [
    'trace',
    'trace_raw',
    'debug',
    'debug_raw',
    'info',
    'warn',
    'error',
    'fatal',
  ],
  filters: {
    trace: colors.magenta,
    trace_raw: colors.magenta,
    debug: colors.white,
    debug_raw: colors.white,
    info: colors.green,
    warn: colors.yellow,
    error: [colors.red, colors.bold],
    fatal: [colors.red, colors.bold, colors.underline],
  },
  format: [
    '{{timestamp}} <{{title}}> {{file}}:{{line}} ({{method}}) {{message}}', //default format
    {
      trace_raw: '{{timestamp}} <trace> {{message}}',
      debug_raw: '{{timestamp}} <debug> {{message}}',
    },
  ],
})

const timers: { [key: string]: number } = {}
const timersHistory: { [key: string]: Array<number> } = {}
const HISTORY_LENGTH = 1000

export const timerStart = (identifier: string) => {
  if (timers[identifier]) {
    logger.warn(`Duplicate timer identifier "${identifier}"`)
  }
  timers[identifier] = performance.now()
}
export const timerEnd = (identifier: string, message?: string) => {
  if (!timers[identifier]) {
    logger.warn(`No such timer identifier "${identifier}"`)
    return
  }

  const duration = performance.now() - timers[identifier]
  const history = (timersHistory[identifier] || []).slice(0, HISTORY_LENGTH)
  history.push(duration)

  const average = history.reduce((a, b) => a + b, 0) / history.length
  logger.trace_raw(
    `⏰ ${duration.toFixed(0).padStart(4)}ms`,
    history.length > 1
      ? `(Ø ${average.toFixed(0).padStart(4)}ms)`
      : '          ',
    message || identifier,
  )

  delete timers[identifier]
  timersHistory[identifier] = history
}
