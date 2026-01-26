import loggerSingleton, { LogLevel } from './logger'

const performanceLogger = loggerSingleton.getTaggedLogger('performance')

class PerformanceMeasurements {
  setReferencePoint(name: string) {
    return performance.mark(name)
  }

  printMeasurement(
    referencePointName: string,
    description: string,
    logLevel: LogLevel = 'trace',
  ) {
    performanceLogger[logLevel](
      `${description}: ${performance.measure('', referencePointName).duration.toFixed(0)}ms`,
    )
  }
}

const performanceMeasurementsSingleton = new PerformanceMeasurements()

export default performanceMeasurementsSingleton
