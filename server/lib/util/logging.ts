import { performance } from 'perf_hooks'
import tracer from 'tracer'
import colors from 'colors/safe'
export { default as colors } from 'colors'

export const logger = tracer.colorConsole({
    methods: ['trace', 'trace_raw', 'debug', 'debug_raw', 'info', 'warn', 'error', 'fatal'],
    filters: {
        trace: colors.magenta,
        trace_raw: colors.magenta,
        debug: colors.white,
        debug_raw: colors.white,
        info: colors.green,
        warn: colors.yellow,
        error: [colors.red, colors.bold],
        fatal: [colors.red, colors.bold, colors.underline]
      },
      format: [
        '{{timestamp}} <{{title}}> {{file}}:{{line}} ({{method}}) {{message}}', //default format
        {
            trace_raw: '{{timestamp}} <trace> {{message}}',
            debug_raw: '{{timestamp}} <debug> {{message}}',
        }
      ],
})

const timers: { [key: string]: number } = {};
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
    logger.trace_raw(`⏰ ${(performance.now() - timers[identifier]).toFixed(0).padStart(5)}ms`, message || identifier)
    delete timers[identifier]
}
