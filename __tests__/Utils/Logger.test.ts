import { CoreInterface } from '../../src/Utils/GitHubAction/CoreInterface.js'
import { Logger } from '../../src/Utils/Logger.js'
import { Mock } from 'moq.ts'
import { setupMockedCoreInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'

describe('Logger', () => {
  let mockedCore: Mock<CoreInterface>
  let logger: Logger

  beforeEach(() => {
    mockedCore = setupMockedCoreInterface()

    logger = new Logger(mockedCore.object())
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log logging out from repository', () => {
    const repository = 'test-repo'

    logger.logLoggingOutFromRepository(repository)

    mockedCore.verify((core) =>
      core.info('Logging out from test-repo repository.')
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log skipping login to repository', () => {
    const repository = 'test-repo'

    logger.logSkipLoginToRepository(repository)

    mockedCore.verify((core) =>
      core.info('Skipping login to test-repo repository.')
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log the number of tags found in the repository', () => {
    const tagCount = 10
    const repository = 'test-repo'

    logger.logTagsFound(tagCount, repository)

    mockedCore.verify((core) =>
      core.info('10 tags were found in the test-repo repository.')
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log the number of tags matched in the repository', () => {
    const tagCount = 5
    const repository = 'test-repo'

    logger.logTagsMatched(tagCount, repository)

    mockedCore.verify((core) =>
      core.info('5 tags match the tags filter in the test-repo repository.')
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log tags to be copied without exceeding 1000 characters per log', () => {
    const tags = Array.from({ length: 200 }, (_, i) => `tag${i + 1}`)
    const sourceRepository = 'source-repo'
    const targetRepository = 'target-repo'

    logger.logTagsToBeCopied(tags, sourceRepository, targetRepository)

    const startingText = `The following tags will be copied from ${sourceRepository} to ${targetRepository}: `
    let message = startingText
    const expectedMessages = []

    for (const tag of tags) {
      if ((message + tag + ', ').length > 1000) {
        expectedMessages.push(message.slice(0, -2))
        message = tag + ', '
      } else {
        message += tag + ', '
      }
    }

    if (message.length > startingText.length) {
      expectedMessages.push(message.slice(0, -2))
    }

    expectedMessages.forEach((msg) => {
      mockedCore.verify((core) => core.info(msg))
    })
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log regctl could not be deleted', () => {
    const path = '/path/to/regctl'

    logger.logRegCtlCouldNotBeDeleted(path)

    mockedCore.verify((core) =>
      core.error('regctl could not be deleted from /path/to/regctl')
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log regctl downloaded', () => {
    const fileUrl = 'https://example.com/regctl'
    const directory = '/path/to/download'

    logger.logRegCtlDownloaded(fileUrl, directory)

    mockedCore.verify((core) =>
      core.info(
        'regctl was downloaded from https://example.com/regctl to /path/to/download'
      )
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log regctl installed', () => {
    const installationPath = '/path/to/install'
    const version = 'v1.0.0'

    logger.logRegCtlInstalled(installationPath, version)

    mockedCore.verify((core) =>
      core.info('regctl version v1.0.0 was installed to /path/to/install')
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log regctl not installed yet', () => {
    logger.logRegCtlNotInstalledYet()

    mockedCore.verify((core) =>
      core.info('regctl is not installed yet but it will be installed now.')
    )
  })
})
