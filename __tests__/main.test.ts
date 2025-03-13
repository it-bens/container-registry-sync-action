import 'reflect-metadata'
import { InjectionToken, container } from 'tsyringe'
import { It, Mock, Times } from 'moq.ts'
import { post, run } from '../src/main.js'
import { Action } from '../src/Action.js'
import { CoreInterface } from '../src/Utils/GitHubAction/CoreInterface.js'
import { Inputs } from '../src/Inputs.js'
import _ from 'lodash'
import { jest } from '@jest/globals'
import MockedObject = jest.MockedObject
import { setupMockedCoreInterface } from '../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'

describe('main', () => {
  let rawInputs: { [key: string]: string }
  let expectedInputs: Inputs
  let mockedCore: Mock<CoreInterface>
  let mockedContainer: jest.Mocked<typeof container>
  let mockedAction: Mock<Action>

  beforeEach(() => {
    rawInputs = {
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
    expectedInputs = {
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

    mockedCore = setupMockedCoreInterface()
    mockedContainer = container as jest.Mocked<typeof container>
    mockedAction = new Mock<Action>()

    mockedCore
      .setup((core) => core.getInput)
      .returns((name: string): string => {
        if (rawInputs[name] === undefined) {
          throw new Error(`Unknown input: ${name}`)
        }

        return rawInputs[name]
      })

    mockedContainer.resolve = jest.fn() as jest.MockedFunction<
      typeof container.resolve
    >
    mockedContainer.resolve.mockImplementation(
      <T = MockedObject<Action | CoreInterface>>(
        token: InjectionToken<T>
      ): T => {
        if (token === Action) {
          return mockedAction.object() as T
        }

        if (token === 'CoreInterface') {
          return mockedCore.object() as T
        }

        throw new Error(`Unknown token: ${token.toString()}`)
      }
    )

    mockedAction
      .setup((action) => action.run(It.IsAny()))
      .returnsAsync(undefined)
    mockedAction
      .setup((action) => action.post(It.IsAny()))
      .returnsAsync(undefined)
  })

  describe('run', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should run the action', async () => {
      await run()

      mockedAction.verify((action) =>
        action.run(It.Is((value) => _.isEqual(expectedInputs, value)))
      )
      mockedCore.verify((core) => core.setFailed(It.IsAny()), Times.Never())
    })

    // eslint-disable-next-line jest/expect-expect
    it('should handle errors during run', async () => {
      const error = new Error('Test error')
      mockedAction.setup((action) => action.run(It.IsAny())).throws(error)

      await run()

      mockedCore.verify((core) => core.setFailed(error.message))
    })

    // eslint-disable-next-line jest/expect-expect
    it('should handle invalid regClientConcurrency input (not a number)', async () => {
      mockedCore
        .setup((core) => core.getInput)
        .returns((name: string): string => {
          if (name === 'regClientConcurrency') {
            return 'invalid'
          }
          return rawInputs[name]
        })

      await run()

      mockedCore.verify((core) =>
        core.setFailed(
          'regClientConcurrency must be a positive integer greater than 0'
        )
      )
    })

    // eslint-disable-next-line jest/expect-expect
    it('should handle invalid regClientConcurrency input (<= 0)', async () => {
      mockedCore
        .setup((core) => core.getInput)
        .returns((name: string): string => {
          if (name === 'regClientConcurrency') {
            return '0'
          }
          return rawInputs[name]
        })

      await run()

      mockedCore.verify((core) =>
        core.setFailed(
          'regClientConcurrency must be a positive integer greater than 0'
        )
      )
    })
  })

  describe('post', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should post the action', async () => {
      await post()

      mockedAction.verify((action) =>
        action.post(It.Is((value) => _.isEqual(expectedInputs, value)))
      )
      mockedCore.verify((core) => core.setFailed(It.IsAny()), Times.Never())
    })

    // eslint-disable-next-line jest/expect-expect
    it('should handle errors during post', async () => {
      const error = new Error('Test error')
      mockedAction.setup((action) => action.post(It.IsAny())).throws(error)

      await post()

      mockedCore.verify((core) => core.setFailed(error.message))
    })
  })
})
