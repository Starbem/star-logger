import { Logger } from 'winston'
import { LoggerOptions } from './src'

export declare function getLogger(
  application: string,
  mongoUri: string,
  options: LoggerOptions
): Logger
