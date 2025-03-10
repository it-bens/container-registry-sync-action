import { Core } from '../src/Utils/GitHubAction/Core.js'
import { Exec } from '../src/Utils/GitHubAction/Exec.js'
import { Logger } from '../src/Utils/Logger.js'
import { Action as LoginAction } from '../src/Login/Action.js'
import { RegClient } from '../src/Utils/RegClient.js'
import { RegClientConcurrencyLimiter } from '../src/Utils/RegClientConcurrencyLimiter.js'
import { RegClientCredentialsBuilder } from '../src/Login/Service/RegClientCredentialsBuilder.js'
import { TagFilter } from '../src/Utils/TagFilter.js'
import { TagSorter } from '../src/Utils/TagSorter.js'
import { jest } from '@jest/globals'

export function buildMockedActionDependencies(): {
  regClientCredentialsBuilder: jest.Mocked<RegClientCredentialsBuilder>
  exec: jest.Mocked<Exec>
  concurrencyLimiter: jest.Mocked<RegClientConcurrencyLimiter>
  regClient: jest.Mocked<RegClient>
  core: jest.Mocked<Core>
  logger: jest.Mocked<Logger>
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
  const mockedLoginAction = new LoginAction(
    mockedRegClientCredentialsBuilder,
    mockedRegClient,
    mockedLogger,
    mockedCore
  ) as jest.Mocked<LoginAction>
  const mockedTagFilter = new TagFilter() as jest.Mocked<TagFilter>
  const mockedTagSorter = new TagSorter() as jest.Mocked<TagSorter>

  mockedLoginAction.run = jest.fn() as jest.MockedFunction<
    typeof LoginAction.prototype.run
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

  return {
    regClientCredentialsBuilder: mockedRegClientCredentialsBuilder,
    exec: mockedExec,
    concurrencyLimiter: mockedConcurrencyLimiter,
    regClient: mockedRegClient,
    core: mockedCore,
    logger: mockedLogger,
    loginAction: mockedLoginAction,
    tagFilter: mockedTagFilter,
    tagSorter: mockedTagSorter
  }
}
