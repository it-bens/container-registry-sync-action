import { Client } from '../../../src/Ghcr/Service/Client.js'
import { Image } from '../../../src/DockerHub/Image.js'
import { IndexFilterAgainstGhcrInformation } from '../../../src/DockerHub/Service/IndexFilterAgainstGhcrInformation.js'
import { Repository } from '../../../src/DockerHub/Repository.js'
import { SingleImageIndex } from '../../../src/DockerHub/Index/SingleImageIndex.js'
import { SingleImageIndexCollection } from '../../../src/DockerHub/Index/SingleImageIndexCollection.js'
import { jest } from '@jest/globals'

jest.mock('../../../src/Ghcr/Service/Client.js')
const mockedClient = new Client() as jest.Mocked<Client>

describe('DockerHub/Service/IndexFilterAgainstGhcrInformation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setupIndices = () => {
    const repository = new Repository('testOrg', 'testRepo')
    const index1 = new SingleImageIndex(
      repository,
      'index1',
      'digest1',
      new Image(repository, 'image1', 'amd64', 'digest1')
    )
    const index2 = new SingleImageIndex(
      repository,
      'index2',
      'digest2',
      new Image(repository, 'image2', 'arm', 'digest2')
    )
    const indices = new SingleImageIndexCollection(repository)
    indices.add(index1)
    indices.add(index2)
    return { repository, indices }
  }

  it('should filter out indices that are up to date', async () => {
    const { indices } = setupIndices()

    mockedClient.fetchOriginalDockerHubDigest =
      jest.fn() as jest.MockedFunction<
        typeof Client.prototype.fetchOriginalDockerHubDigest
      >
    mockedClient.fetchOriginalDockerHubDigest.mockImplementation(
      (_ghcrRepository: string, indexName: string): Promise<string | null> => {
        if (indexName === 'index1') {
          return Promise.resolve('digest1')
        }
        return Promise.resolve(null)
      }
    )

    const indexFilter = new IndexFilterAgainstGhcrInformation(mockedClient)
    const filteredIndices = await indexFilter.withoutIndicesThatAreUpToDate(
      indices,
      'ghcrRepo'
    )

    expect(mockedClient.fetchOriginalDockerHubDigest).toHaveBeenCalledTimes(2)
    expect(filteredIndices.all()).toHaveLength(1)
    expect(filteredIndices.all()[0].name).toBe('index2')
  })

  it('should return all indices if none are up to date', async () => {
    const { indices } = setupIndices()

    mockedClient.fetchOriginalDockerHubDigest =
      jest.fn() as jest.MockedFunction<
        typeof Client.prototype.fetchOriginalDockerHubDigest
      >
    mockedClient.fetchOriginalDockerHubDigest.mockResolvedValue(null)

    const indexFilter = new IndexFilterAgainstGhcrInformation(mockedClient)
    const filteredIndices = await indexFilter.withoutIndicesThatAreUpToDate(
      indices,
      'ghcrRepo'
    )

    expect(mockedClient.fetchOriginalDockerHubDigest).toHaveBeenCalledTimes(2)
    expect(filteredIndices.all()).toHaveLength(2)
  })
})
