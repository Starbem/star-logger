import { getLogger } from '../src/index'
import { Logger } from 'winston'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

describe('Logger Module', () => {
  let mongoServer: MongoMemoryServer
  let mongoUri: string
  let logger: Logger
  let client: MongoClient

  beforeAll(async () => {
    // Start an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create()
    mongoUri = mongoServer.getUri()

    // Connect to the in-memory MongoDB
    client = new MongoClient(mongoUri)
    await client.connect()

    // Initialize the logger with the in-memory MongoDB
    logger = getLogger('test', mongoUri, {
      level: 'info',
      collection: 'test-logs',
    })
  })

  afterAll(async () => {
    // Close the MongoDB connection and stop the in-memory server
    if (client) {
      await client.close()
    }
    if (mongoServer) {
      await mongoServer.stop()
    }
  })

  test('Should create a logger instance', () => {
    expect(logger).toBeDefined()
  })

  test('Should log an info message to MongoDB', async () => {
    logger.info('Test info message')

    // Wait a bit to ensure the log is saved
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verify that the log was saved in MongoDB
    const db = client.db()
    const collection = db.collection('test-logs')

    const logs = await collection.find({ level: 'info' }).toArray()
    expect(logs.length).toBeGreaterThan(0)
    expect(logs[0].message).toBe('Test info message')
  })

  test('Should log an error message to MongoDB', async () => {
    logger.error('Test error message')

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verify that the error log was saved in MongoDB
    const db = client.db()
    const collection = db.collection('test-logs')

    const logs = await collection
      .find({ level: 'error', message: 'Test error message' })
      .toArray()
    expect(logs.length).toBeGreaterThan(0)
  })
})
