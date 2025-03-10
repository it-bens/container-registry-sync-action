import { Action } from '../src/Action.js'
import { Inputs } from '../src/Inputs.js'
import { Action as LoginAction } from '../src/Login/Action.js'
import { buildMockedActionDependencies } from './helper.js'
import { jest } from '@jest/globals'

const {
  regClient: mockedRegClient,
  logger: mockedLogger,
  loginAction: mockedLoginAction,
  tagFilter: mockedTagFilter,
  tagSorter: mockedTagSorter
} = buildMockedActionDependencies()

describe('Action', () => {
  let action: Action
  let inputs: Inputs

  beforeEach(() => {
    jest.clearAllMocks()

    action = new Action(
      mockedLoginAction,
      mockedRegClient,
      mockedTagFilter,
      mockedTagSorter,
      mockedLogger
    )

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
  })

  it('should run the action and log the correct messages', async () => {
    const sourceTags = ['tag1', 'tag2', 'tag3']
    const filteredTags = ['tag1', 'tag2']

    mockedRegClient.listTagsInRepository.mockResolvedValue(sourceTags)
    mockedTagFilter.filter.mockReturnValue(filteredTags)
    mockedTagSorter.sortTags.mockReturnValue(filteredTags)

    await action.run(inputs)

    expect(mockedLoginAction.run).toHaveBeenCalledWith(inputs)
    expect(mockedRegClient.listTagsInRepository).toHaveBeenCalledWith(
      'source-repo'
    )
    expect(mockedLogger.logTagsFound).toHaveBeenCalledWith(3, 'source')
    expect(mockedTagFilter.filter).toHaveBeenCalledWith(sourceTags, '*')
    expect(mockedTagSorter.sortTags).toHaveBeenCalledWith(filteredTags)
    expect(mockedLogger.logTagsMatched).toHaveBeenCalledWith(2, 'source')
    expect(mockedLogger.logTagsToBeCopied).toHaveBeenCalledWith(
      filteredTags,
      'source-repo',
      'target-repo'
    )
    expect(mockedRegClient.copyImageFromSourceToTarget).toHaveBeenCalledTimes(2)
    expect(mockedRegClient.copyImageFromSourceToTarget).toHaveBeenCalledWith(
      'source-repo',
      'tag1',
      'target-repo',
      'tag1'
    )
    expect(mockedRegClient.copyImageFromSourceToTarget).toHaveBeenCalledWith(
      'source-repo',
      'tag2',
      'target-repo',
      'tag2'
    )
  })

  it('should call post method of loginAction', async () => {
    mockedLoginAction.post = jest.fn() as jest.MockedFunction<
      typeof LoginAction.prototype.post
    >

    await action.post(inputs)
    expect(mockedLoginAction.post).toHaveBeenCalledWith(inputs)
  })
})
