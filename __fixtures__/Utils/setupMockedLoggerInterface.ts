import { It, Mock } from 'moq.ts'
import { LoggerInterface } from '../../src/Utils/LoggerInterface.js'

export function setupMockedLoggerInterface(): Mock<LoggerInterface> {
  const mockedLogger = new Mock<LoggerInterface>()

  mockedLogger
    .setup((logger) => logger.logLoggingOutFromRepository(It.IsAny()))
    .returns(undefined)
  mockedLogger
    .setup((logger) => logger.logSkipLoginToRepository(It.IsAny()))
    .returns(undefined)
  mockedLogger
    .setup((logger) => logger.logTagsFound(It.IsAny(), It.IsAny()))
    .returns(undefined)
  mockedLogger
    .setup((logger) => logger.logTagsMatched(It.IsAny(), It.IsAny()))
    .returns(undefined)
  mockedLogger
    .setup((logger) =>
      logger.logTagsToBeCopied(It.IsAny(), It.IsAny(), It.IsAny())
    )
    .returns(undefined)
  mockedLogger
    .setup((logger) => logger.logRegCtlCouldNotBeDeleted(It.IsAny()))
    .returns(undefined)
  mockedLogger
    .setup((logger) => logger.logRegCtlInstalled(It.IsAny(), It.IsAny()))
    .returns(undefined)
  mockedLogger
    .setup((logger) => logger.logRegCtlNotInstalledYet())
    .returns(undefined)

  return mockedLogger
}
