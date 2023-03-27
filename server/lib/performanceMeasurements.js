import { PerformanceObserver } from 'perf_hooks'

const performanceMeasurements = {}
let performanceObserver
/**
 * Initialize nice logging for performance benchmarks
 *
 * To measure performance run
 * import { performance } from 'perf_hooks'
 * performance.mark('start')
 * // code to measure
 * performance.mark('end')
 * performance.measure('measurement name', 'start', 'end')
 */
export const registerPerformanceObserver = () => {
  if (performanceObserver) {
    return
  }

  performanceObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
      if (!(entry.name in performanceMeasurements)) {
        performanceMeasurements[entry.name] = []
      }
      performanceMeasurements[entry.name].push(entry.duration)

      const average =
        performanceMeasurements[entry.name].reduce((a, b) => a + b, 0) /
        performanceMeasurements[entry.name].length

      console.log(
        `[${entry.startTime.toFixed(2)}] ${entry.duration
          .toFixed(2)
          .padStart(6)}ms (Ø${
          performanceMeasurements[entry.name].length
        } ${average.toFixed(2).padStart(6)}ms) ${
          entry.name.includes('total') ? '' : '>> '
        }${entry.name}`,
      )
    })
  })

  performanceObserver.observe({ entryTypes: ['measure'], buffer: true })
}
