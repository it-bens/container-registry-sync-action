import { It, Mock } from 'moq.ts'
import { ExecInterface } from '../../src/Utils/GitHubAction/ExecInterface.js'
import { RegClient } from '../../src/Utils/RegClient.js'
import { RegClientConcurrencyLimiter } from '../../src/Utils/RegClient/RegClientConcurrencyLimiter.js'
import { RegClientConcurrencyLimiterInterface } from '../../src/Utils/RegClient/RegClientConcurrencyLimiterInterface.js'
import _ from 'lodash'
import { setupMockedExecInterface } from '../../__fixtures__/Utils/GitHubAction/setupMockedExecInterface.js'
import { setupRegClientConcurrencyLimiterInterface } from '../../__fixtures__/Utils/RegClient/setupRegClientConcurrencyLimiterInterface.js'

describe('RegClient', () => {
  let mockedExec: Mock<ExecInterface>
  let mockedConcurrencyLimiter: Mock<RegClientConcurrencyLimiterInterface>
  let regClient: RegClient

  beforeEach(() => {
    mockedExec = setupMockedExecInterface()
    mockedExec
      .setup((exec) => exec.exec(It.IsAny(), It.IsAny(), It.IsAny()))
      .returnsAsync(1)

    mockedConcurrencyLimiter = setupRegClientConcurrencyLimiterInterface()

    regClient = new RegClient(
      mockedExec.object(),
      mockedConcurrencyLimiter.object()
    )
  })

  it('should list tags in repository', async () => {
    const repository = 'test-repo'
    const tags = 'v1.0.0\nv1.1.0\nlatest'

    mockedExec
      .setup((exec) =>
        exec.getExecOutput(
          'regctl',
          It.Is((value) => _.isEqual(['tag', 'ls', repository], value)),
          It.Is((value) => _.isEqual({ silent: true }, value))
        )
      )
      .returnsAsync({ stdout: tags, stderr: '', exitCode: 0 })

    const result = await regClient.listTagsInRepository(repository)
    expect(result).toEqual(['v1.0.0', 'v1.1.0', 'latest'])

    mockedExec.verify((exec) =>
      exec.getExecOutput(
        'regctl',
        It.Is((value) => _.isEqual(['tag', 'ls', repository], value)),
        It.Is((value) => _.isEqual({ silent: true }, value))
      )
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should log into registry with provided credentials', async () => {
    const credentials = {
      registry: 'test-registry',
      username: 'test-username',
      password: 'test-password'
    }

    await regClient.logIntoRegistry(credentials)

    mockedExec.verify((exec) =>
      exec.exec(
        'regctl',
        It.Is((value) =>
          _.isEqual(
            [
              'registry',
              'login',
              'test-registry',
              '-u',
              'test-username',
              '--pass-stdin'
            ],
            value
          )
        ),
        It.Is((value) =>
          _.isEqual({ input: Buffer.from('test-password') }, value)
        )
      )
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should logout from registry with provided credentials', async () => {
    const credentials = {
      registry: 'test-registry',
      username: 'test-username',
      password: 'test-password'
    }

    await regClient.logoutFromRegistry(credentials)

    mockedExec.verify((exec) =>
      exec.exec(
        'regctl',
        It.Is((value) =>
          _.isEqual(['registry', 'logout', 'test-registry'], value)
        )
      )
    )
  })

  // eslint-disable-next-line jest/expect-expect
  it('should copy image from source to target', async () => {
    const sourceRepository = 'source-repo'
    const sourceTag = 'v1.0.0'
    const targetRepository = 'target-repo'
    const targetTag = 'v1.0.0'

    mockedExec
      .setup((exec) =>
        exec.exec(
          'regctl',
          It.Is((value) =>
            _.isEqual(
              ['image', 'copy', 'source-repo:v1.0.0', 'target-repo:v1.0.0'],
              value
            )
          ),
          It.Is((value) => _.isEqual({ ignoreReturnCode: true }, value))
        )
      )
      .returnsAsync(0)

    regClient = new RegClient(
      mockedExec.object(),
      new RegClientConcurrencyLimiter()
    )

    await regClient.copyImageFromSourceToTarget(
      sourceRepository,
      sourceTag,
      targetRepository,
      targetTag
    )

    mockedExec.verify((exec) =>
      exec.exec(
        'regctl',
        It.Is((value) =>
          _.isEqual(
            ['image', 'copy', 'source-repo:v1.0.0', 'target-repo:v1.0.0'],
            value
          )
        ),
        It.Is((value) => _.isEqual({ ignoreReturnCode: true }, value))
      )
    )
  })

  it('should throw an error if exec fails with a non-zero return code', async () => {
    const sourceRepository = 'source-repo'
    const sourceTag = 'v1.0.0'
    const targetRepository = 'target-repo'
    const targetTag = 'v1.0.0'

    mockedExec
      .setup((exec) =>
        exec.exec(
          'regctl',
          It.Is((value) =>
            _.isEqual(
              ['image', 'copy', 'source-repo:v1.0.0', 'target-repo:v1.0.0'],
              value
            )
          ),
          It.Is((value) => _.isEqual({ ignoreReturnCode: true }, value))
        )
      )
      .returnsAsync(1)

    await expect(
      regClient.copyImageFromSourceToTarget(
        sourceRepository,
        sourceTag,
        targetRepository,
        targetTag
      )
    ).rejects.toThrow(
      `Failed to copy image from ${sourceRepository}:${sourceTag} to ${targetRepository}:${targetTag}`
    )
  })
})
