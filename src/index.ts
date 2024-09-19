import { Logger, createLogger, format, transports } from 'winston'
import 'winston-mongodb'
import {
  MongoDBTransportInstance,
  MongoDBConnectionOptions,
} from 'winston-mongodb'

export interface LoggerOptions {
  level?: string
  collection?: string
  mongoOptions?: MongoDBConnectionOptions
}

let logger: Logger

export function getLogger(
  application: string,
  mongoUri: string,
  options: LoggerOptions = {}
): Logger {
  if (!logger) {
    logger = createLogger({
      level: options.level || 'info',
      format: format.combine(
        format.label({ label: application }),
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      transports: [
        new transports.Console(),
        new (transports as any).MongoDB({
          db: mongoUri,
          options: {
            useUnifiedTopology: true,
            ...options.mongoOptions,
          },
          collection: options.collection || 'logs',
          level: options.level || 'info',
          label: application,
          metaKey: 'meta',
        }) as MongoDBTransportInstance,
      ],
    })
  }

  return logger
}
