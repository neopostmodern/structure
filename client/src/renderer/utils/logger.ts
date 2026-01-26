import type { ConsolaInstance } from 'consola'
import { consola } from 'consola/browser'
import { LogLevels } from 'consola/core'

type LoggingParameters = [
  string,
  ...(undefined | null | string | boolean | Object)[],
]
export type LogLevel = 'trace' | 'debug' // todo: complete
export enum LogLevelNumber {
  SILENT = LogLevels.silent,
  ERROR = LogLevels.error,
  DEBUG = LogLevels.debug,
  TRACE = LogLevels.trace,
}

// this class acts as a library-agnostic wrapper with a (hopefully) stable interface
class Logger {
  logger: ConsolaInstance
  constructor(consolaInstance: ConsolaInstance) {
    this.logger = consolaInstance
  }
  trace(...args: LoggingParameters) {
    this.logger.trace(...args)
  }
  log(...args: LoggingParameters) {
    this.logger.info(...args)
  }
  info(...args: LoggingParameters) {
    this.logger.info(...args)
  }
  warn(...args: LoggingParameters) {
    this.logger.warn(...args)
  }
  error(...args: LoggingParameters) {
    this.logger.error(...args)
  }
  debug(...args: LoggingParameters) {
    this.logger.debug(...args)
  }
  setLevel(level: number) {
    this.logger.level = level
  }
  getTaggedLogger(tag: string) {
    return new Logger(this.logger.withTag(tag))
  }
}

const loggerSingleton = new Logger(consola)

export default loggerSingleton
