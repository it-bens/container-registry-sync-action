import { DownloaderHelper, RetryOptions } from 'node-downloader-helper'
import { Mock, Times } from 'moq.ts'
import { Downloader } from '../../src/Utils/Downloader.js'
import { LoggerInterface } from '../../src/Utils/LoggerInterface.js'
import { jest } from '@jest/globals'
import mock from 'mock-fs'
import { setupMockedLoggerInterface } from '../../__fixtures__/Utils/setupMockedLoggerInterface.js'

const mockedDownloaderHelper = DownloaderHelper as jest.MockedClass<
  typeof DownloaderHelper
>
mockedDownloaderHelper.prototype.start = jest.fn() as jest.MockedFunction<
  typeof DownloaderHelper.prototype.start
>
mockedDownloaderHelper.prototype.on = jest.fn() as jest.MockedFunction<
  typeof DownloaderHelper.prototype.on
>

describe('Downloader', () => {
  let mockedLogger: Mock<LoggerInterface>
  let downloader: Downloader
  const fileUrl = 'https://example.com/file'
  const destination = '/path/to/destination'
  const directory = '/path/to'
  const filename = 'destination'

  beforeEach(() => {
    mockedLogger = setupMockedLoggerInterface()

    downloader = new Downloader(mockedLogger.object())

    mock({
      '/path/to': {} // Mock the target directory
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    mock.restore()
  })

  const setupDownloadHelperMocks = () => {
    const startPromise = new Promise<boolean>((resolve) => {
      resolve(true)
    })

    mockedDownloaderHelper.prototype.start.mockReturnValue(startPromise)
  }

  it('should download the file successfully', async () => {
    setupDownloadHelperMocks()

    const downloadPromise = downloader.downloadFile(fileUrl, destination)

    expect(mockedDownloaderHelper.prototype.start).toHaveBeenCalledTimes(1)
    expect(mockedDownloaderHelper.prototype.on).toHaveBeenCalledTimes(2)
    expect(mockedDownloaderHelper.prototype.on).toHaveBeenCalledWith(
      'end',
      expect.any(Function)
    )
    expect(mockedDownloaderHelper.prototype.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    )

    const endCallback = mockedDownloaderHelper.prototype.on.mock.calls.find(
      (call) => call[0] === 'end'
    )?.[1]
    if (typeof endCallback === 'function') {
      endCallback(
        null,
        { maxRetries: 1, delay: 0 } as RetryOptions & string,
        null
      )
    }

    mockedLogger.verify(
      (logger) => logger.logRegCtlDownloaded(fileUrl, directory),
      Times.Once()
    )

    await expect(downloadPromise).resolves.toBeUndefined()
  })

  it('should handle download errors', async () => {
    setupDownloadHelperMocks()

    const downloadPromise = downloader.downloadFile(fileUrl, destination)

    expect(mockedDownloaderHelper.prototype.start).toHaveBeenCalledTimes(1)
    expect(mockedDownloaderHelper.prototype.on).toHaveBeenCalledTimes(2)
    expect(mockedDownloaderHelper.prototype.on).toHaveBeenCalledWith(
      'end',
      expect.any(Function)
    )
    expect(mockedDownloaderHelper.prototype.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    )

    const errorCallback = mockedDownloaderHelper.prototype.on.mock.calls.find(
      (call) => call[0] === 'error'
    )?.[1]
    if (typeof errorCallback === 'function') {
      const error = { message: 'Network error', status: 404 }
      errorCallback(
        error,
        { maxRetries: 1, delay: 0 } as RetryOptions & string,
        null
      )
    }

    await expect(downloadPromise).rejects.toThrow(
      `The download of ${filename} from ${fileUrl} failed: Network error (status: 404)`
    )
  })
})
