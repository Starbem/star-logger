# Star Logger - Logging Module with Winston and MongoDB

Welcome to **My Logger**, a Node.js module written in TypeScript that simplifies implementing logging in your microservices. It utilizes [Winston](https://github.com/winstonjs/winston) for log management and [MongoDB](https://www.mongodb.com/) as the storage destination.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration Options](#configuration-options)
- [Examples](#examples)
- [Capturing Uncaught Exceptions](#capturing-uncaught-exceptions)
- [Customization](#customization)
- [Testing](#testing)
- [Contribution](#contribution)
- [License](#license)

## Installation

You can install the module via NPM:

```bash
$ yarn add star-logger
```

## Usage

Import the module and initialize the logger by passing the MongoDB URI and optionally the desired configurations:

```ts
import { getLogger } from 'my-logger'

const logger = getLogger('mongodb://localhost:27017/my-database', {
  level: 'info',
  collection: 'logs',
})

// Using the logger
logger.info('Server started successfully')
logger.warn('High memory usage detected')
logger.error('Failed to connect to the database')
```

## Configuration Options

The getLogger function accepts two parameters:

    1.	mongoUri: string - The MongoDB connection URI.
    2.	options: LoggerOptions (optional) - An object with configuration options.

## LoggerOptions

| Property       | Type                       | Default  | Description                                               |
| -------------- | -------------------------- | -------- | --------------------------------------------------------- |
| `level`        | `string`                   | `'info'` | Minimum severity level of logs to be recorded.            |
| `collection`   | `string`                   | `'logs'` | Name of the MongoDB collection where logs will be stored. |
| `mongoOptions` | `MongoDBConnectionOptions` | `{}`     | Additional options for the MongoDB connection.            |

## Examples

### Basic Configuration

```ts
import { getLogger } from 'my-logger'

const logger = getLogger('mongodb://localhost:27017/my-database')

// Using the logger
logger.info('Server initialized')
logger.warn('Potential issue detected')
logger.error('An error occurred')
```

## Advanced Configuration

```ts
import { getLogger } from 'my-logger'

const logger = getLogger('mongodb://localhost:27017/my-database', {
  level: 'debug',
  collection: 'my-logs',
  mongoOptions: {
    authSource: 'admin',
    ssl: true,
  },
})

// Using the logger
logger.debug('Variable X has value:', x)
```

## Capturing Uncaught Exceptions

To capture uncaught exceptions and ensure they are logged:

```ts
import { getLogger } from 'my-logger'
import { transports } from 'winston'

const logger = getLogger('mongodb://localhost:27017/my-database')

// Configure to capture exceptions
logger.exceptions.handle(
  new transports.Console(),
  new transports.MongoDB({
    db: 'mongodb://localhost:27017/my-database',
    collection: 'exceptions',
  })
)

// Application code
process.on('unhandledRejection', (reason) => {
  throw reason
})
```

## Customization

You can customize the log format or add new transports as needed.

### Customizing the Format

```ts
import { getLogger } from 'my-logger'
import { format } from 'winston'

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`
})

const logger = getLogger('mongodb://localhost:27017/my-database', {
  level: 'info',
})

logger.format = format.combine(format.timestamp(), customFormat)

// Using the logger
logger.info('Message with custom format')
```

## Adding New Transports

```ts
import { getLogger } from 'my-logger'
import { transports } from 'winston'

const logger = getLogger('mongodb://localhost:27017/my-database')

// Adding a new file transport
logger.add(new transports.File({ filename: 'combined.log' }))

// Using the logger
logger.info('This log will be saved in MongoDB and the file')
```

## Testing

The module includes unit tests written with Jest to ensure reliability.

### Running Tests

First, install the development dependencies:

```bash
$ yarn
```

Then, run the tests:

```bash
$ yarn test
```

## Note on Tests

Ensure that all resources are properly closed after tests to prevent Jest from hanging. This includes:

    •	Closing Winston logger transports
    •	Closing MongoDB connections
    •	Stopping the in-memory MongoDB server used in tests

## Contribution

Contributions are welcome! Feel free to open issues or pull requests on the project’s repository.

Steps to Contribute

    1.	Fork the project.
    2.	Create a new branch with your feature or fix: git checkout -b my-feature.
    3.	Commit your changes: git commit -m 'Add new feature'.
    4.	Push to the branch: git push origin my-feature.
    5.	Open a pull request on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
