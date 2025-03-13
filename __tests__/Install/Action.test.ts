import { It, Mock, Times } from 'moq.ts'
import { Action } from '../../src/Install/Action.js'
import { CoreInterface } from '../../src/Utils/GitHubAction/CoreInterface.js'
import { DownloaderInterface } from '../../src/Utils/DownloaderInterface.js'
import { ExecInterface } from '../../src/Utils/GitHubAction/ExecInterface.js'
import { IoInterface } from '../../src/Utils/GitHubAction/IoInterface.js'
import { LoggerInterface } from '../../src/Utils/LoggerInterface.js'
import { RegCtlBinary } from '../../src/Install/RegCtlBinary.js'
import { RegCtlBinaryBuilderInterface } from '../../src/Install/Service/RegCtlBinaryBuilderInterface.js'
import _ from 'lodash'
import { setupMockedCoreInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'
import { setupMockedDownloaderInterface } from '../../__fixtures__/Utils/setupMockedDownloaderInterface.js'
import { setupMockedExecInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedExecInterface.js'
import { setupMockedIoInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedIoInterface.js'
import { setupMockedLoggerInterface } from '../../__fixtures__/Utils/setupMockedLoggerInterface.js'
import { setupRegCtlBinaryBuilderInterface } from '../../__fixtures__/Install/Service/setupRegCtlBinaryBuilderInterface.js'

describe('Install/Action', () => {
  let mockedCore: Mock<CoreInterface>
  let mockedExec: Mock<ExecInterface>
  let mockedIo: Mock<IoInterface>
  let mockedDownloader: Mock<DownloaderInterface>
  let mockedLogger: Mock<LoggerInterface>
  let mockedRegCtlBinaryBuilder: Mock<RegCtlBinaryBuilderInterface>
  let action: Action

  beforeEach(() => {
    mockedCore = setupMockedCoreInterface()
    mockedExec = setupMockedExecInterface()
    mockedIo = setupMockedIoInterface()
    mockedDownloader = setupMockedDownloaderInterface()
    mockedLogger = setupMockedLoggerInterface()
    mockedRegCtlBinaryBuilder = setupRegCtlBinaryBuilderInterface()

    mockedExec
      .setup((exec) => exec.exec(It.IsAny(), It.IsAny()))
      .returnsAsync(1)
    mockedRegCtlBinaryBuilder
      .setup((regCtlBinaryBuilder) => regCtlBinaryBuilder.build(It.IsAny()))
      .returns(new RegCtlBinary('/path/to/install', 'latest', 'linux', 'x64'))

    action = new Action(
      mockedRegCtlBinaryBuilder.object(),
      mockedIo.object(),
      mockedDownloader.object(),
      mockedExec.object(),
      mockedCore.object(),
      mockedLogger.object()
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should run the action and install regctl', async () => {
    await action.run()

    mockedIo.verify((io) => io.mkdirP('/path/to/install'), Times.Once())
    mockedExec.verify((exec) =>
      exec.exec(
        'rm',
        It.Is((value) => _.isEqual(['/path/to/install/regctl'], value))
      )
    )
    mockedDownloader.verify((downloader) =>
      downloader.downloadFile(
        'https://github.com/regclient/regclient/releases/latest/download/regctl-linux-amd64',
        '/path/to/install/regctl'
      )
    )
    mockedExec.verify((exec) =>
      exec.exec(
        'chmod',
        It.Is((value) => _.isEqual(['+x', '/path/to/install/regctl'], value))
      )
    )
    mockedLogger.verify((logger) =>
      logger.logRegCtlInstalled('/path/to/install/regctl', 'latest')
    )
    mockedCore.verify((core) => core.addPath('/path/to/install'))
    mockedExec.verify((exec) =>
      exec.exec(
        'regctl',
        It.Is((value) => _.isEqual(['version'], value))
      )
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should handle errors during regctl removal in run method', async () => {
    mockedExec
      .setup((exec) =>
        exec.exec(
          'rm',
          It.Is((value) => _.isEqual(['/path/to/install/regctl'], value))
        )
      )
      .throws(new Error('File not found'))

    await action.run()

    mockedLogger.verify((logger) => logger.logRegCtlNotInstalledYet())
  })

  // eslint-disable-next-line jest/expect-expect
  it('should delete regctl in post method', async () => {
    await action.post()

    mockedExec.verify((exec) =>
      exec.exec(
        'rm',
        It.Is((value) => _.isEqual(['/path/to/install/regctl'], value))
      )
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should handle errors during regctl deletion in post method', async () => {
    mockedExec
      .setup((exec) =>
        exec.exec(
          'rm',
          It.Is((value) => _.isEqual(['/path/to/install/regctl'], value))
        )
      )
      .throws(new Error('File not found'))

    await action.post()

    mockedLogger.verify((logger) =>
      logger.logRegCtlCouldNotBeDeleted('/path/to/install/regctl')
    )
  })
})
