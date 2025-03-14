import { It, Mock, Times } from 'moq.ts'
import { Action } from '../src/Action.js'
import { CoreInterface } from '../src/Utils/GitHubAction/CoreInterface.js'
import { Inputs } from '../src/Inputs.js'
import { Action as InstallAction } from '../src/Install/Action.js'
import { LoggerInterface } from '../src/Utils/LoggerInterface.js'
import { Action as LoginAction } from '../src/Login/Action.js'
import { PrinterInterface } from '../src/Summary/Service/PrinterInterface.js'
import { RegClientInterface } from '../src/Utils/RegClientInterface.js'
import { Summary } from '../src/Summary/Summary.js'
import { TagFilterInterface } from '../src/Utils/TagFilterInterface.js'
import { TagSorterInterface } from '../src/Utils/TagSorterInterface.js'
import _ from 'lodash'
import { setupMockedCoreInterface } from '../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'
import { setupMockedLoggerInterface } from '../__fixtures__/Utils/setupMockedLoggerInterface.js'
import { setupMockedPrinterInterface } from '../__fixtures__/Summary/Service/setupMockedPrinterInterface.js'
import { setupMockedRegClientInterface } from '../__fixtures__/Utils/setupMockedRegClientInterface.js'
import { setupMockedSummary } from '../__fixtures__/Summary/setupMockedSummary.js'
import { setupMockedTagFilterInterface } from '../__fixtures__/Utils/setupMockedTagFilterInterface.js'
import { setupMockedTagSorterInterface } from '../__fixtures__/Utils/setupMockedTagSorterInterface.js'

describe('Action', () => {
  let mockedInstallAction: Mock<InstallAction>
  let mockedLoginAction: Mock<LoginAction>
  let mockedCore: Mock<CoreInterface>
  let mockedRegClient: Mock<RegClientInterface>
  let mockedTagFilter: Mock<TagFilterInterface>
  let mockedTagSorter: Mock<TagSorterInterface>
  let mockedLogger: Mock<LoggerInterface>
  let mockedSummary: Mock<Summary>
  let mockedSummaryPrinter: Mock<PrinterInterface>
  let action: Action
  let inputs: Inputs

  beforeEach(() => {
    inputs = {
      sourceRepository: 'source-repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'source-username',
      sourceRepositoryPassword: 'source-password',
      targetRepository: 'target-repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'target',
      targetRepositoryPassword: 'password',
      tags: '*'
    }

    mockedInstallAction = new Mock<InstallAction>()
    mockedLoginAction = new Mock<LoginAction>()
    mockedCore = setupMockedCoreInterface()
    mockedRegClient = setupMockedRegClientInterface()
    mockedTagFilter = setupMockedTagFilterInterface()
    mockedTagSorter = setupMockedTagSorterInterface()
    mockedLogger = setupMockedLoggerInterface()
    mockedSummary = setupMockedSummary()
    mockedSummaryPrinter = setupMockedPrinterInterface()

    mockedInstallAction
      .setup((installAction) => installAction.run())
      .returnsAsync(undefined)
    mockedInstallAction
      .setup((installAction) => installAction.post())
      .returnsAsync(undefined)
    mockedLoginAction
      .setup((loginAction) => loginAction.run(It.IsAny()))
      .returnsAsync(undefined)
    mockedLoginAction
      .setup((loginAction) => loginAction.post(It.IsAny()))
      .returnsAsync(undefined)

    action = new Action(
      mockedInstallAction.object(),
      mockedLoginAction.object(),
      mockedCore.object(),
      mockedRegClient.object(),
      mockedTagFilter.object(),
      mockedTagSorter.object(),
      mockedLogger.object(),
      mockedSummary.object(),
      mockedSummaryPrinter.object()
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should run the action, log the correct messages and write the summary', async () => {
    const sourceTags = ['tag1', 'tag2', 'tag3']
    const filteredTags = ['tag1', 'tag2']

    mockedRegClient
      .setup((regClient) => regClient.listTagsInRepository(It.IsAny()))
      .returnsAsync(sourceTags)
    mockedTagFilter
      .setup((tagFilter) => tagFilter.filter(It.IsAny(), It.IsAny()))
      .returns(filteredTags)
    mockedTagSorter
      .setup((tagSorter) => tagSorter.sortTags(It.IsAny()))
      .returns(filteredTags)

    await action.run(inputs)

    mockedInstallAction.verify((installAction) => installAction.run())
    mockedLoginAction.verify((loginAction) =>
      loginAction.run(It.Is((value) => _.isEqual(inputs, value)))
    )
    mockedRegClient.verify((regClient) =>
      regClient.listTagsInRepository('source-repo')
    )
    mockedLogger.verify((logger) => logger.logTagsFound(3, 'source'))
    mockedTagFilter.verify((tagFilter) => tagFilter.filter(sourceTags, '*'))
    mockedTagSorter.verify((tagSorter) => tagSorter.sortTags(filteredTags))
    mockedLogger.verify((logger) => logger.logTagsMatched(2, 'source'))
    mockedLogger.verify((logger) =>
      logger.logTagsToBeCopied(filteredTags, 'source-repo', 'target-repo')
    )
    mockedRegClient.verify(
      (regClient) =>
        regClient.copyImageFromSourceToTarget(
          'source-repo',
          'tag1',
          'target-repo',
          'tag1'
        ),
      Times.Once()
    )
    mockedRegClient.verify(
      (regClient) =>
        regClient.copyImageFromSourceToTarget(
          'source-repo',
          'tag2',
          'target-repo',
          'tag2'
        ),
      Times.Once()
    )
    mockedSummary.verify(
      (summary) =>
        summary.addImageCopyResult(
          It.Is((value) => _.isEqual({ tag: 'tag1', success: true }, value))
        ),
      Times.Once()
    )
    mockedSummary.verify(
      (summary) =>
        summary.addImageCopyResult(
          It.Is((value) => _.isEqual({ tag: 'tag2', success: true }, value))
        ),
      Times.Once()
    )
    mockedSummaryPrinter.verify((printer) =>
      printer.printSummary(It.Is((value) => mockedSummary.object() === value))
    )
  })

  it('should run the action with a failing image copy and write the summary', async () => {
    const sourceTags = ['tag1', 'tag2']
    const filteredTags = ['tag1', 'tag2']
    const errorMessage = 'Failed to copy image from ...'

    mockedRegClient
      .setup((regClient) => regClient.listTagsInRepository(It.IsAny()))
      .returnsAsync(sourceTags)
    mockedTagFilter
      .setup((tagFilter) => tagFilter.filter(It.IsAny(), It.IsAny()))
      .returns(filteredTags)
    mockedTagSorter
      .setup((tagSorter) => tagSorter.sortTags(It.IsAny()))
      .returns(filteredTags)
    mockedRegClient
      .setup((regClient) =>
        regClient.copyImageFromSourceToTarget(
          It.IsAny(),
          'tag1',
          It.IsAny(),
          It.IsAny()
        )
      )
      .returnsAsync(undefined)
    mockedRegClient
      .setup((regClient) =>
        regClient.copyImageFromSourceToTarget(
          It.IsAny(),
          'tag2',
          It.IsAny(),
          It.IsAny()
        )
      )
      .throws(new Error(errorMessage))

    await expect(action.run(inputs)).resolves.not.toThrow()

    mockedCore.verify((core) => core.setFailed(errorMessage), Times.Once())
    mockedSummary.verify(
      (summary) =>
        summary.addImageCopyResult(
          It.Is((value) => _.isEqual({ tag: 'tag1', success: true }, value))
        ),
      Times.Once()
    )
    mockedSummary.verify(
      (summary) =>
        summary.addImageCopyResult(
          It.Is((value) => _.isEqual({ tag: 'tag2', success: false }, value))
        ),
      Times.Once()
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should call post method of loginAction', async () => {
    await action.post(inputs)

    mockedLoginAction.verify((loginAction) =>
      loginAction.post(It.Is((value) => _.isEqual(inputs, value)))
    )
    mockedInstallAction.verify((installAction) => installAction.post())
  })
})
