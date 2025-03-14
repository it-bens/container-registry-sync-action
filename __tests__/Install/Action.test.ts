import { It, Mock, Times } from 'moq.ts'
import { Action } from '../../src/Install/Action.js'
import { CoreInterface } from '../../src/Utils/GitHubAction/CoreInterface.js'
import { DownloaderInterface } from '../../src/Utils/DownloaderInterface.js'
import { ExecInterface } from '../../src/Utils/GitHubAction/ExecInterface.js'
import { IoInterface } from '../../src/Utils/GitHubAction/IoInterface.js'
import { LoggerInterface } from '../../src/Utils/LoggerInterface.js'
import { RegCtlBinary } from '../../src/Install/RegCtlBinary.js'
import { RegCtlBinaryBuilderInterface } from '../../src/Install/Service/RegCtlBinaryBuilderInterface.js'
import { RegCtlVersion } from '../../src/Install/RegCtlVersion.js'
import { RegCtlVersionBuilderInterface } from '../../src/Install/Service/RegCtlVersionBuilderInterface.js'
import { Summary } from '../../src/Summary/Summary.js'
import _ from 'lodash'
import { setupMockedCoreInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'
import { setupMockedDownloaderInterface } from '../../__fixtures__/Utils/setupMockedDownloaderInterface.js'
import { setupMockedExecInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedExecInterface.js'
import { setupMockedIoInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedIoInterface.js'
import { setupMockedLoggerInterface } from '../../__fixtures__/Utils/setupMockedLoggerInterface.js'
import { setupMockedRegCtlBinaryBuilderInterface } from '../../__fixtures__/Install/Service/setupMockedRegCtlBinaryBuilderInterface.js'
import { setupMockedRegCtlVersionBuilderInterface } from '../../__fixtures__/Install/Service/setupMockedRegCtlVersionBuilderInterface.js'
import { setupMockedSummary } from '../../__fixtures__/Summary/setupMockedSummary.js'

describe('Install/Action', () => {
  const mockedExecOutputOfRegCtlVersion = {
    stderr: '',
    exitCode: 0,
    stdout:
      'VCSTag:     v0.8.2\n' +
      'VCSRef:     e7e5436b4e93a897084aceca6b118b8002b20122\n' +
      'VCSCommit:  e7e5436b4e93a897084aceca6b118b8002b20122\n' +
      'VCSState:   clean\n' +
      'VCSDate:    2025-02-14T14:58:53Z\n' +
      'Platform:   linux/amd64\n' +
      'GoVer:      go1.23.6\n' +
      'GoCompiler: gc'
  }
  const mockedRegCtlVersion: RegCtlVersion = {
    vcsTag: 'v0.8.2',
    vcsRef: 'e7e5436b4e93a897084aceca6b118b8002b20122',
    vcsCommit: 'e7e5436b4e93a897084aceca6b118b8002b20122',
    vcsState: 'clean',
    vcsDate: '2025-02-14T14:58:53Z',
    platform: 'linux/amd64',
    goVersion: 'go1.23.6',
    goCompiler: 'gc'
  }

  let mockedCore: Mock<CoreInterface>
  let mockedExec: Mock<ExecInterface>
  let mockedIo: Mock<IoInterface>
  let mockedDownloader: Mock<DownloaderInterface>
  let mockedLogger: Mock<LoggerInterface>
  let mockedRegCtlBinaryBuilder: Mock<RegCtlBinaryBuilderInterface>
  let mockedRegCtlVersionBuilder: Mock<RegCtlVersionBuilderInterface>
  let mockedSummary: Mock<Summary>
  let action: Action

  beforeEach(() => {
    mockedCore = setupMockedCoreInterface()
    mockedExec = setupMockedExecInterface()
    mockedIo = setupMockedIoInterface()
    mockedDownloader = setupMockedDownloaderInterface()
    mockedLogger = setupMockedLoggerInterface()
    mockedRegCtlBinaryBuilder = setupMockedRegCtlBinaryBuilderInterface()
    mockedRegCtlVersionBuilder = setupMockedRegCtlVersionBuilderInterface()
    mockedSummary = setupMockedSummary()

    mockedExec
      .setup((exec) => exec.exec(It.IsAny(), It.IsAny()))
      .returnsAsync(1)
    mockedExec
      .setup((exec) => exec.getExecOutput(It.IsAny(), It.IsAny()))
      .returnsAsync(mockedExecOutputOfRegCtlVersion)
    mockedRegCtlBinaryBuilder
      .setup((regCtlBinaryBuilder) => regCtlBinaryBuilder.build(It.IsAny()))
      .returns(new RegCtlBinary('/path/to/install', 'latest', 'linux', 'x64'))
    mockedRegCtlVersionBuilder
      .setup((regCtlVersionBuilder) =>
        regCtlVersionBuilder.buildFromExecOutput()
      )
      .returnsAsync(mockedRegCtlVersion)

    action = new Action(
      mockedRegCtlBinaryBuilder.object(),
      mockedIo.object(),
      mockedDownloader.object(),
      mockedExec.object(),
      mockedCore.object(),
      mockedRegCtlVersionBuilder.object(),
      mockedLogger.object(),
      mockedSummary.object()
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
    mockedRegCtlVersionBuilder.verify((regCtlVersionBuilder) =>
      regCtlVersionBuilder.buildFromExecOutput()
    )
    mockedSummary.verify((summary) =>
      summary.setInstalledRegCtlVersion('v0.8.2')
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
