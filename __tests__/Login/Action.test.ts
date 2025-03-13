import { It, Mock, Times } from 'moq.ts'
import { Action } from '../../src/Login/Action.js'
import { CoreInterface } from '../../src/Utils/GitHubAction/CoreInterface.js'
import { Inputs } from '../../src/Inputs.js'
import { LoggerInterface } from '../../src/Utils/LoggerInterface.js'
import { RegClientCredentialsBuilder } from '../../src/Login/Service/RegClientCredentialsBuilder.js'
import { RegClientCredentialsBuilderInterface } from '../../src/Login/Service/RegClientCredentialsBuilderInterface.js'
import { RegClientInterface } from '../../src/Utils/RegClientInterface.js'
import _ from 'lodash'
import { setupMockedCoreInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'
import { setupMockedLoggerInterface } from '../../__fixtures__/Utils/setupMockedLoggerInterface.js'
import { setupMockedRegClientCredentialsBuilderInterface } from '../../__fixtures__/Login/Service/setupMockedRegClientCredentialsBuilderInterface.js'
import { setupMockedRegClientInterface } from '../../__fixtures__/Utils/setupMockedRegClientInterface.js'

describe('Login/Action', () => {
  let mockedRegClientCredentialsBuilder: Mock<RegClientCredentialsBuilderInterface>
  let mockedRegClient: Mock<RegClientInterface>
  let mockedCore: Mock<CoreInterface>
  let mockedLogger: Mock<LoggerInterface>
  let action: Action

  beforeEach(() => {
    mockedRegClientCredentialsBuilder =
      setupMockedRegClientCredentialsBuilderInterface()
    mockedRegClient = setupMockedRegClientInterface()
    mockedCore = setupMockedCoreInterface()
    mockedLogger = setupMockedLoggerInterface()

    action = new Action(
      mockedRegClientCredentialsBuilder.object(),
      mockedRegClient.object(),
      mockedLogger.object(),
      mockedCore.object()
    )
  })

  // eslint-disable-next-line jest/expect-expect
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
    mockedRegClientCredentialsBuilder
      .setup((builder) => builder.build(It.IsAny()))
      .returns(credentials)

    await action.run(inputs)

    mockedLogger.verify(
      (logger) => logger.logSkipLoginToRepository('source'),
      Times.Once()
    )
    mockedRegClient.verify(
      (regClient) => regClient.logIntoRegistry(It.IsAny()),
      Times.Once()
    )
  })

  // eslint-disable-next-line jest/expect-expect
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
    mockedRegClientCredentialsBuilder
      .setup((builder) => builder.build(It.IsAny()))
      .returns(credentials)

    await action.run(inputs)

    mockedCore.verify(
      (core) =>
        core.setFailed(
          'Source repository credentials (username and/or password) are missing.'
        ),
      Times.Once()
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log into source repository if credentials are provided', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: false,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder
      .setup((builder) => builder.build(It.IsAny()))
      .returns(credentials)

    await action.run(inputs)

    mockedRegClient.verify(
      (regClient) =>
        regClient.logIntoRegistry(
          It.Is((value) => _.isEqual(credentials.source, value))
        ),
      Times.Once()
    )
    mockedRegClient.verify(
      (regClient) =>
        regClient.logIntoRegistry(
          It.Is((value) => _.isEqual(credentials.target, value))
        ),
      Times.Never()
    )
  })

  // eslint-disable-next-line jest/expect-expect
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
    mockedRegClientCredentialsBuilder
      .setup((builder) => builder.build(It.IsAny()))
      .returns(credentials)

    await action.run(inputs)

    mockedLogger.verify(
      (logger) => logger.logSkipLoginToRepository('target'),
      Times.Once()
    )
    mockedRegClient.verify(
      (regClient) => regClient.logIntoRegistry(It.IsAny()),
      Times.Once()
    )
  })

  // eslint-disable-next-line jest/expect-expect
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
    mockedRegClientCredentialsBuilder
      .setup((builder) => builder.build(It.IsAny()))
      .returns(credentials)

    await action.run(inputs)

    mockedCore.verify(
      (core) =>
        core.setFailed(
          'Target repository credentials (username and/or password) are missing.'
        ),
      Times.Once()
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log into target repository if credentials are provided', async () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: false,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const credentials = new RegClientCredentialsBuilder().build(inputs)
    mockedRegClientCredentialsBuilder
      .setup((builder) => builder.build(It.IsAny()))
      .returns(credentials)

    await action.run(inputs)

    mockedRegClient.verify(
      (regClient) =>
        regClient.logIntoRegistry(
          It.Is((value) => _.isEqual(credentials.source, value))
        ),
      Times.Never()
    )
    mockedRegClient.verify(
      (regClient) =>
        regClient.logIntoRegistry(
          It.Is((value) => _.isEqual(credentials.target, value))
        ),
      Times.Once()
    )
  })

  // eslint-disable-next-line jest/expect-expect
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
    mockedRegClientCredentialsBuilder
      .setup((builder) => builder.build(It.IsAny()))
      .returns(credentials)

    await action.post(inputs)

    mockedLogger.verify(
      (logger) => logger.logLoggingOutFromRepository('source'),
      Times.Once()
    )
    mockedLogger.verify(
      (logger) => logger.logLoggingOutFromRepository('target'),
      Times.Once()
    )
    mockedRegClient.verify(
      (regClient) => regClient.logoutFromRegistry(credentials.source),
      Times.Once()
    )
    mockedRegClient.verify(
      (regClient) => regClient.logoutFromRegistry(credentials.target),
      Times.Once()
    )
  })
})
