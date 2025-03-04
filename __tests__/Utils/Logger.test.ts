import { Core } from '../../src/Utils/GitHubAction/Core.js'
import { Logger } from '../../src/Utils/Logger.js'
import { jest } from '@jest/globals'

const mockedCore = new Core() as jest.Mocked<Core>

describe('Logger', () => {
  let logger: Logger

  beforeEach(() => {
    jest.clearAllMocks()
    mockedCore.info = jest.fn() as jest.MockedFunction<
      typeof Core.prototype.info
    >
    logger = new Logger(mockedCore)
  })

  it('should log logging out from repository', () => {
    const repository = 'test-repo'
    logger.logLoggingOutFromRepository(repository)
    expect(mockedCore.info).toHaveBeenCalledWith(
      'Logging out from test-repo repository.'
    )
  })

  it('should log skipping login to repository', () => {
    const repository = 'test-repo'
    logger.logSkipLoginToRepository(repository)
    expect(mockedCore.info).toHaveBeenCalledWith(
      'Skipping login to test-repo repository.'
    )
  })

  it('should log the number of tags found in the repository', () => {
    const tagCount = 10
    const repository = 'test-repo'
    logger.logTagsFound(tagCount, repository)
    expect(mockedCore.info).toHaveBeenCalledWith(
      '10 tags were found in the test-repo repository.'
    )
  })

  it('should log the number of tags matched in the repository', () => {
    const tagCount = 5
    const repository = 'test-repo'
    logger.logTagsMatched(tagCount, repository)
    expect(mockedCore.info).toHaveBeenCalledWith(
      '5 tags match the tags filter in the test-repo repository.'
    )
  })

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

    expectedMessages.forEach((msg, index) => {
      expect(mockedCore.info).toHaveBeenNthCalledWith(index + 1, msg)
    })
  })
})
