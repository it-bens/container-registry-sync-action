import { Core } from '../../src/Utils/GitHubAction/Core.js'
import { Logger } from '../../src/Utils/Logger.js'
import { jest } from '@jest/globals'

jest.mock('../../src/Utils/GitHubAction/Core.js')
const mockedCore = new Core() as jest.Mocked<Core>

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should log info messages', () => {
    mockedCore.info = jest.fn() as jest.MockedFunction<
      typeof Core.prototype.info
    >

    const logger = new Logger(mockedCore)

    const message = 'This is an info message'
    logger.info(message)
    expect(mockedCore.info).toHaveBeenCalledWith(message)
  })
})
