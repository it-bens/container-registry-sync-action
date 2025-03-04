import { Exec } from '../../src/Utils/GitHubAction/Exec.js'
import { RegClient } from '../../src/Utils/RegClient.js'
import { RegClientConcurrencyLimiter } from '../../src/Utils/RegClientConcurrencyLimiter.js'
import { jest } from '@jest/globals'

jest.mock('../../src/Utils/GitHubAction/Exec.js')
const mockedExec = new Exec() as jest.Mocked<Exec>

describe('RegClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list tags in repository', async () => {
    const repository = 'test-repo'
    const tags = 'v1.0.0\nv1.1.0\nlatest'

    mockedExec.getExecOutput = jest.fn() as jest.MockedFunction<
      typeof Exec.prototype.getExecOutput
    >
    mockedExec.getExecOutput.mockResolvedValue({
      stdout: tags,
      stderr: '',
      exitCode: 0
    })

    const regClient = new RegClient(
      mockedExec,
      new RegClientConcurrencyLimiter()
    )

    const result = await regClient.listTagsInRepository(repository)
    expect(result).toEqual(['v1.0.0', 'v1.1.0', 'latest'])
    expect(mockedExec.getExecOutput).toHaveBeenCalledWith('regctl', [
      'tag',
      'ls',
      repository
    ])
  })

  it('should log into registry with provided credentials', async () => {
    const credentials = {
      registry: 'test-registry',
      username: 'test-username',
      password: 'test-password'
    }

    mockedExec.exec = jest.fn() as jest.MockedFunction<
      typeof Exec.prototype.exec
    >

    const regClient = new RegClient(
      mockedExec,
      new RegClientConcurrencyLimiter()
    )

    await regClient.logIntoRegistry(credentials)

    expect(mockedExec.exec).toHaveBeenCalledWith(
      'regctl',
      [
        'registry',
        'login',
        'test-registry',
        '-u',
        'test-username',
        '--pass-stdin'
      ],
      {
        input: Buffer.from('test-password')
      }
    )
  })

  it('should logout from registry with provided credentials', async () => {
    const credentials = {
      registry: 'test-registry',
      username: 'test-username',
      password: 'test-password'
    }

    mockedExec.exec = jest.fn() as jest.MockedFunction<
      typeof Exec.prototype.exec
    >

    const regClient = new RegClient(
      mockedExec,
      new RegClientConcurrencyLimiter()
    )

    await regClient.logoutFromRegistry(credentials)

    expect(mockedExec.exec).toHaveBeenCalledWith('regctl', [
      'registry',
      'logout',
      'test-registry'
    ])
  })

  it('should copy image from source to target', async () => {
    const sourceRepository = 'source-repo'
    const sourceTag = 'v1.0.0'
    const targetRepository = 'target-repo'
    const targetTag = 'v1.0.0'

    mockedExec.exec = jest.fn() as jest.MockedFunction<
      typeof Exec.prototype.exec
    >

    const regClient = new RegClient(
      mockedExec,
      new RegClientConcurrencyLimiter()
    )

    await regClient.copyImageFromSourceToTarget(
      sourceRepository,
      sourceTag,
      targetRepository,
      targetTag
    )
    expect(mockedExec.exec).toHaveBeenCalledWith('regctl', [
      'image',
      'copy',
      `${sourceRepository}:${sourceTag}`,
      `${targetRepository}:${targetTag}`
    ])
  })
})
