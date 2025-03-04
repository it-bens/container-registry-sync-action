import { Action } from '../../src/Login/Action.js'
import { Core } from '../../src/Utils/GitHubAction/Core.js'
import { Exec } from '../../src/Utils/GitHubAction/Exec.js'
import { Inputs } from '../../src/Inputs.js'
import { Logger } from '../../src/Utils/Logger.js'
import { RegClient } from '../../src/Utils/RegClient.js'
import { RegClientConcurrencyLimiter } from '../../src/Utils/RegClientConcurrencyLimiter.js'
import { RegClientCredentialsBuilder } from '../../src/Login/Service/RegClientCredentialsBuilder.js'
import { jest } from '@jest/globals'

const mockedCore = new Core() as jest.Mocked<Core>
const mockedExec = new Exec() as jest.Mocked<Exec>
const mockedLogger = new Logger(mockedCore) as jest.Mocked<Logger>
const mockedRegClientCredentialsBuilder =
  new RegClientCredentialsBuilder() as jest.Mocked<RegClientCredentialsBuilder>
const mockedRegClient = new RegClient(
  mockedExec,
  new RegClientConcurrencyLimiter()
) as jest.Mocked<RegClient>

describe('Login/Action', () => {
  let action: Action

  beforeEach(() => {
    jest.clearAllMocks()

    mockedRegClientCredentialsBuilder.build = jest.fn() as jest.MockedFunction<
      typeof RegClientCredentialsBuilder.prototype.build
    >
    mockedLogger.info = jest.fn() as jest.MockedFunction<
      typeof Logger.prototype.info
    >

    mockedRegClient.logIntoRegistry = jest.fn() as jest.MockedFunction<
      typeof RegClient.prototype.logIntoRegistry
    >
    mockedRegClient.logoutFromRegistry = jest.fn() as jest.MockedFunction<
      typeof RegClient.prototype.logoutFromRegistry
    >

    action = new Action(
      mockedRegClientCredentialsBuilder,
      mockedRegClient,
      mockedLogger
    )
  })

  it('should skip login to source repository if loginToSourceRepository is false', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: false,
      sourceRepositoryUsername: '',
      sourceRepositoryPassword: '',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder.build.mockReturnValue(credentials)

    await action.run(inputs)

    expect(mockedLogger.info).toHaveBeenCalledTimes(1)
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Skipping login to source repository.'
    )
    expect(mockedRegClient.logIntoRegistry).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if source repository credentials are missing', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: '',
      sourceRepositoryPassword: '',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder.build.mockReturnValue(credentials)

    await expect(action.run(inputs)).rejects.toThrow(
      'Source repository credentials (username and/or password) are missing.'
    )
  })

  it('should log into source repository if credentials are provided', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder.build.mockReturnValue(credentials)

    await action.run(inputs)

    expect(mockedRegClient.logIntoRegistry).toHaveBeenCalledWith(
      credentials.source
    )
  })

  it('should skip login to target repository if loginToTargetRepository is false', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: false,
      targetRepositoryUsername: '',
      targetRepositoryPassword: '',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder.build.mockReturnValue(credentials)

    await action.run(inputs)

    expect(mockedLogger.info).toHaveBeenCalledTimes(1)
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Skipping login to target repository.'
    )
    expect(mockedRegClient.logIntoRegistry).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if target repository credentials are missing', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: '',
      targetRepositoryPassword: '',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder.build.mockReturnValue(credentials)

    await expect(action.run(inputs)).rejects.toThrow(
      'Target repository credentials (username and/or password) are missing.'
    )
  })

  it('should log into target repository if credentials are provided', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder.build.mockReturnValue(credentials)

    await action.run(inputs)

    expect(mockedRegClient.logIntoRegistry).toHaveBeenCalledWith(
      credentials.target
    )
  })

  it('should log out from source and target repositories if loginToSourceRepository and loginToTargetRepository are true', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder.build.mockReturnValue(credentials)

    await action.post(inputs)

    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Logging out from source repository.'
    )
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Logging out from target repository.'
    )
    expect(mockedRegClient.logoutFromRegistry).toHaveBeenCalledWith(
      credentials.source
    )
    expect(mockedRegClient.logoutFromRegistry).toHaveBeenCalledWith(
      credentials.target
    )
  })
})
