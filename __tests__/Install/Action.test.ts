import { Action } from '../../src/Install/Action.js'
import { Core } from '../../src/Utils/GitHubAction/Core.js'
import { Downloader } from '../../src/Utils/Downloader.js'
import { Exec } from '../../src/Utils/GitHubAction/Exec.js'
import { Io } from '../../src/Utils/GitHubAction/Io.js'
import { Logger } from '../../src/Utils/Logger.js'
import { RegCtlBinaryBuilder } from '../../src/Install/Service/RegCtlBinaryBuilder.js'
import { jest } from '@jest/globals'

const mockedCore = new Core() as jest.Mocked<Core>
const mockedExec = new Exec() as jest.Mocked<Exec>
const mockedIo = new Io() as jest.Mocked<Io>
const mockedDownloader = new Downloader() as jest.Mocked<Downloader>
const mockedLogger = new Logger(mockedCore) as jest.Mocked<Logger>
const mockedRegCtlBinaryBuilder = new RegCtlBinaryBuilder(
  'ENV_HOME',
  mockedCore
) as jest.Mocked<RegCtlBinaryBuilder>

describe('Install/Action', () => {
  let action: Action

  beforeEach(() => {
    jest.clearAllMocks()

    mockedCore.addPath = jest.fn() as jest.MockedFunction<
      typeof Core.prototype.addPath
    >
    mockedExec.exec = jest.fn() as jest.MockedFunction<
      typeof Exec.prototype.exec
    >
    mockedIo.mkdirP = jest.fn() as jest.MockedFunction<
      typeof Io.prototype.mkdirP
    >
    mockedDownloader.downloadFile = jest.fn() as jest.MockedFunction<
      typeof Downloader.prototype.downloadFile
    >
    mockedLogger.logRegCtlInstalled = jest.fn() as jest.MockedFunction<
      typeof Logger.prototype.logRegCtlInstalled
    >
    mockedLogger.logRegCtlNotInstalledYet = jest.fn() as jest.MockedFunction<
      typeof Logger.prototype.logRegCtlNotInstalledYet
    >
    mockedLogger.logRegCtlCouldNotBeDeleted = jest.fn() as jest.MockedFunction<
      typeof Logger.prototype.logRegCtlCouldNotBeDeleted
    >

    mockedRegCtlBinaryBuilder.build = jest.fn().mockReturnValue({
      installationDirectory: '/path/to/install',
      version: 'latest',
      buildDownloadUrl: jest
        .fn()
        .mockReturnValue('https://example.com/download'),
      getInstallationPath: jest.fn().mockReturnValue('/path/to/install/regctl')
    }) as jest.MockedFunction<typeof RegCtlBinaryBuilder.prototype.build>

    action = new Action(
      mockedRegCtlBinaryBuilder,
      mockedIo,
      mockedDownloader,
      mockedExec,
      mockedCore,
      mockedLogger
    )
  })

  it('should run the action and install regctl', async () => {
    await action.run()

    expect(mockedIo.mkdirP).toHaveBeenCalledWith('/path/to/install')
    expect(mockedExec.exec).toHaveBeenCalledWith('rm', [
      '/path/to/install/regctl'
    ])
    expect(mockedDownloader.downloadFile).toHaveBeenCalledWith(
      'https://example.com/download',
      '/path/to/install/regctl'
    )
    expect(mockedExec.exec).toHaveBeenCalledWith('chmod', [
      '+x',
      '/path/to/install/regctl'
    ])
    expect(mockedLogger.logRegCtlInstalled).toHaveBeenCalledWith(
      '/path/to/install/regctl',
      'latest'
    )
    expect(mockedCore.addPath).toHaveBeenCalledWith('/path/to/install')
    expect(mockedExec.exec).toHaveBeenCalledWith('regctl', ['version'])
  })

  it('should handle errors during regctl removal in run method', async () => {
    mockedExec.exec.mockRejectedValueOnce(new Error('File not found'))

    await action.run()

    expect(mockedLogger.logRegCtlNotInstalledYet).toHaveBeenCalled()
  })

  it('should delete regctl in post method', async () => {
    await action.post()

    expect(mockedExec.exec).toHaveBeenCalledWith('rm', [
      '/path/to/install/regctl'
    ])
  })

  it('should handle errors during regctl deletion in post method', async () => {
    mockedExec.exec.mockRejectedValueOnce(new Error('File not found'))

    await action.post()

    expect(mockedLogger.logRegCtlCouldNotBeDeleted).toHaveBeenCalledWith(
      '/path/to/install/regctl'
    )
  })
})
