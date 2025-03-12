import { Core } from '../src/Utils/GitHubAction/Core.js'
import { Downloader } from '../src/Utils/Downloader.js'
import { Exec } from '../src/Utils/GitHubAction/Exec.js'
import { Action as InstallAction } from '../src/Install/Action.js'
import { Io } from '../src/Utils/GitHubAction/Io.js'
import { Logger } from '../src/Utils/Logger.js'
import { Action as LoginAction } from '../src/Login/Action.js'
import { RegClient } from '../src/Utils/RegClient.js'
import { RegClientConcurrencyLimiter } from '../src/Utils/RegClientConcurrencyLimiter.js'
import { RegClientCredentialsBuilder } from '../src/Login/Service/RegClientCredentialsBuilder.js'
import { RegCtlBinaryBuilder } from '../src/Install/Service/RegCtlBinaryBuilder.js'
import { TagFilter } from '../src/Utils/TagFilter.js'
import { TagSorter } from '../src/Utils/TagSorter.js'
import { jest } from '@jest/globals'

export function buildMockedActionDependencies(envHome: string): {
  regClientCredentialsBuilder: jest.Mocked<RegClientCredentialsBuilder>
  exec: jest.Mocked<Exec>
  concurrencyLimiter: jest.Mocked<RegClientConcurrencyLimiter>
  regClient: jest.Mocked<RegClient>
  core: jest.Mocked<Core>
  logger: jest.Mocked<Logger>
  installAction: jest.Mocked<InstallAction>
  loginAction: jest.Mocked<LoginAction>
  tagFilter: jest.Mocked<TagFilter>
  tagSorter: jest.Mocked<TagSorter>
} {
  const mockedRegClientCredentialsBuilder =
    new RegClientCredentialsBuilder() as jest.Mocked<RegClientCredentialsBuilder>
  const mockedExec = new Exec() as jest.Mocked<Exec>
  const mockedConcurrencyLimiter =
    new RegClientConcurrencyLimiter() as jest.Mocked<RegClientConcurrencyLimiter>
  const mockedRegClient = new RegClient(
    mockedExec,
    mockedConcurrencyLimiter
  ) as jest.Mocked<RegClient>
  const mockedCore = new Core() as jest.Mocked<Core>
  const mockedLogger = new Logger(mockedCore) as jest.Mocked<Logger>

  const mockedRegCtlBinaryBuilder = new RegCtlBinaryBuilder(
    envHome,
    mockedCore
  ) as jest.Mocked<RegCtlBinaryBuilder>
  const mockedIo = new Io() as jest.Mocked<Io>
  const mockedDownloader = new Downloader() as jest.Mocked<Downloader>
  const mockedInstallAction = new InstallAction(
    mockedRegCtlBinaryBuilder,
    mockedIo,
    mockedDownloader,
    mockedExec,
    mockedCore,
    mockedLogger
  ) as jest.Mocked<InstallAction>

  const mockedLoginAction = new LoginAction(
    mockedRegClientCredentialsBuilder,
    mockedRegClient,
    mockedLogger,
    mockedCore
  ) as jest.Mocked<LoginAction>
  const mockedTagFilter = new TagFilter() as jest.Mocked<TagFilter>
  const mockedTagSorter = new TagSorter() as jest.Mocked<TagSorter>

  mockedInstallAction.run = jest.fn() as jest.MockedFunction<
    typeof InstallAction.prototype.run
  >
  mockedInstallAction.post = jest.fn() as jest.MockedFunction<
    typeof InstallAction.prototype.post
  >
  mockedLoginAction.run = jest.fn() as jest.MockedFunction<
    typeof LoginAction.prototype.run
  >
  mockedLoginAction.post = jest.fn() as jest.MockedFunction<
    typeof LoginAction.prototype.post
  >
  mockedRegClient.listTagsInRepository = jest.fn() as jest.MockedFunction<
    typeof RegClient.prototype.listTagsInRepository
  >
  mockedLogger.logTagsFound = jest.fn() as jest.MockedFunction<
    typeof Logger.prototype.logTagsFound
  >
  mockedTagFilter.filter = jest.fn() as jest.MockedFunction<
    typeof TagFilter.prototype.filter
  >
  mockedTagSorter.sortTags = jest.fn() as jest.MockedFunction<
    typeof TagSorter.prototype.sortTags
  >
  mockedLogger.logTagsMatched = jest.fn() as jest.MockedFunction<
    typeof Logger.prototype.logTagsMatched
  >
  mockedLogger.logTagsToBeCopied = jest.fn() as jest.MockedFunction<
    typeof Logger.prototype.logTagsToBeCopied
  >
  mockedRegClient.copyImageFromSourceToTarget =
    jest.fn() as jest.MockedFunction<
      typeof RegClient.prototype.copyImageFromSourceToTarget
    >
  mockedCore.getInput = jest.fn() as jest.MockedFunction<
    typeof Core.prototype.getInput
  >
  mockedCore.setFailed = jest.fn() as jest.MockedFunction<
    typeof Core.prototype.setFailed
  >
  mockedIo.mkdirP = jest.fn() as jest.MockedFunction<typeof Io.prototype.mkdirP>
  mockedDownloader.downloadFile = jest.fn() as jest.MockedFunction<
    typeof Downloader.prototype.downloadFile
  >
  mockedRegCtlBinaryBuilder.build = jest.fn() as jest.MockedFunction<
    typeof RegCtlBinaryBuilder.prototype.build
  >
  mockedLogger.logRegCtlNotInstalledYet = jest.fn() as jest.MockedFunction<
    typeof Logger.prototype.logRegCtlNotInstalledYet
  >
  mockedLogger.logRegCtlInstalled = jest.fn() as jest.MockedFunction<
    typeof Logger.prototype.logRegCtlInstalled
  >
  mockedLogger.logRegCtlCouldNotBeDeleted = jest.fn() as jest.MockedFunction<
    typeof Logger.prototype.logRegCtlCouldNotBeDeleted
  >
  mockedCore.addPath = jest.fn() as jest.MockedFunction<
    typeof Core.prototype.addPath
  >

  return {
    regClientCredentialsBuilder: mockedRegClientCredentialsBuilder,
    exec: mockedExec,
    concurrencyLimiter: mockedConcurrencyLimiter,
    regClient: mockedRegClient,
    core: mockedCore,
    logger: mockedLogger,
    installAction: mockedInstallAction,
    loginAction: mockedLoginAction,
    tagFilter: mockedTagFilter,
    tagSorter: mockedTagSorter
  }
}
