import 'reflect-metadata'
import { InjectionToken, container } from 'tsyringe'
import { post, run } from '../src/main.js'
import { Action } from '../src/Action.js'
import { Core } from '../src/Utils/GitHubAction/Core.js'
import { Inputs } from '../src/Inputs.js'
import { buildMockedActionDependencies } from './helper.js'
import { jest } from '@jest/globals'
import MockedObject = jest.MockedObject

const ENV_HOME = 'envHome'

const mockedContainer = container as jest.Mocked<typeof container>
mockedContainer.resolve = jest.fn() as jest.MockedFunction<
  typeof container.resolve
>

const {
  regClient: mockedRegClient,
  logger: mockedLogger,
  installAction: mockedInstallAction,
  loginAction: mockedLoginAction,
  tagFilter: mockedTagFilter,
  tagSorter: mockedTagSorter,
  core: mockedCore
} = buildMockedActionDependencies(ENV_HOME)
const mockedAction = new Action(
  mockedInstallAction,
  mockedLoginAction,
  mockedRegClient,
  mockedTagFilter,
  mockedTagSorter,
  mockedLogger
) as jest.Mocked<Action>

const rawInputs: { [key: string]: string } = {
  sourceRepository: 'source-repo',
  loginToSourceRepository: 'true',
  sourceRepositoryUsername: 'sourceUser',
  sourceRepositoryPassword: 'sourcePass',
  targetRepository: 'target-repo',
  loginToTargetRepository: 'true',
  targetRepositoryUsername: 'targetUser',
  targetRepositoryPassword: 'targetPass',
  tags: '*',
  regClientConcurrency: '1'
}
const expectedInputs: Inputs = {
  sourceRepository: 'source-repo',
  loginToSourceRepository: true,
  sourceRepositoryUsername: 'sourceUser',
  sourceRepositoryPassword: 'sourcePass',
  targetRepository: 'target-repo',
  loginToTargetRepository: true,
  targetRepositoryUsername: 'targetUser',
  targetRepositoryPassword: 'targetPass',
  tags: '*'
}

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedContainer.resolve.mockImplementation(
      <T = MockedObject<Action | Core>>(token: InjectionToken<T>): T => {
        if (token === Action) {
          return mockedAction as T
        }

        if (token === Core) {
          return mockedCore as T
        }

        throw new Error(`Unknown token: ${token.toString()}`)
      }
    )

    mockedCore.getInput.mockImplementation((name: string): string => {
      if (rawInputs[name] === undefined) {
        throw new Error(`Unknown input: ${name}`)
      }

      return rawInputs[name]
    })

    mockedAction.run = jest.fn() as jest.MockedFunction<
      typeof Action.prototype.run
    >
    mockedAction.post = jest.fn() as jest.MockedFunction<
      typeof Action.prototype.post
    >
  })

  describe('run', () => {
    it('should run the action', async () => {
      await run()

      expect(mockedAction.run).toHaveBeenCalledWith(expectedInputs)
      expect(mockedCore.setFailed).not.toHaveBeenCalled()
    })

    it('should handle errors during run', async () => {
      const error = new Error('Test error')
      mockedAction.run.mockRejectedValueOnce(error)

      await run()

      expect(mockedCore.setFailed).toHaveBeenCalledWith(error.message)
    })

    it('should handle invalid regClientConcurrency input (not a number)', async () => {
      mockedCore.getInput.mockImplementation((name: string): string => {
        if (name === 'regClientConcurrency') {
          return 'invalid'
        }
        return rawInputs[name]
      })

      await run()

      expect(mockedCore.setFailed).toHaveBeenCalledWith(
        'regClientConcurrency must be a positive integer greater than 0'
      )
    })

    it('should handle invalid regClientConcurrency input (<= 0)', async () => {
      mockedCore.getInput.mockImplementation((name: string): string => {
        if (name === 'regClientConcurrency') {
          return '0'
        }
        return rawInputs[name]
      })

      await run()

      expect(mockedCore.setFailed).toHaveBeenCalledWith(
        'regClientConcurrency must be a positive integer greater than 0'
      )
    })
  })

  describe('post', () => {
    it('should post the action', async () => {
      await post()

      expect(mockedAction.post).toHaveBeenCalledWith(expectedInputs)
      expect(mockedCore.setFailed).not.toHaveBeenCalled()
    })

    it('should handle errors during post', async () => {
      const error = new Error('Test error')
      mockedAction.post.mockRejectedValueOnce(error)

      await post()

      expect(mockedCore.setFailed).toHaveBeenCalledWith(error.message)
    })
  })
})
