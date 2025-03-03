import { Docker } from '../../../src/Utils/Docker.js'
import { DockerConcurrencyLimiter } from '../../../src/Utils/DockerConcurrencyLimiter.js'
import { Image } from '../../../src/DockerHub/Image.js'
import { Repository } from '../../../src/DockerHub/Repository.js'
import { SingleImageIndex } from '../../../src/DockerHub/Index/SingleImageIndex.js'
import { SingleImageIndexCollection } from '../../../src/DockerHub/Index/SingleImageIndexCollection.js'
import { jest } from '@jest/globals'

describe('DockerHub/SingleImageIndexCollection', () => {
  it('should correctly initialize the repository property in the constructor', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new SingleImageIndexCollection(repository)

    expect(indexCollection.repository).toBe(repository)
  })

  it('should add an index to the collection', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new SingleImageIndexCollection(repository)
    const image = new Image(repository, 'testName', 'amd64', 'testDigest')
    const index = new SingleImageIndex(
      repository,
      'testName',
      'testDigest',
      image
    )

    indexCollection.add(index)

    expect(indexCollection.all()).toContain(index)
  })

  it('should return all indices in the collection', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new SingleImageIndexCollection(repository)
    const image1 = new Image(
      repository,
      'testName-amd64',
      'amd64',
      'testDigest1'
    )
    const image2 = new Image(repository, 'testName-arm', 'arm', 'testDigest2')
    const index1 = new SingleImageIndex(
      repository,
      'testName1',
      'testDigest1',
      image1
    )
    const index2 = new SingleImageIndex(
      repository,
      'testName2',
      'testDigest2',
      image2
    )

    indexCollection.add(index1)
    indexCollection.add(index2)

    expect(indexCollection.all()).toEqual([index1, index2])
  })

  it('should pull all images in the collection', async () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new SingleImageIndexCollection(repository)
    const image = new Image(repository, 'testName', 'amd64', 'testDigest')
    const index = new SingleImageIndex(
      repository,
      'testName',
      'testDigest',
      image
    )
    indexCollection.add(index)

    const mockPullAllImages = jest
      .spyOn(index, 'pullImage')
      .mockImplementation(async () => {})

    const docker = new Docker(new DockerConcurrencyLimiter())
    await indexCollection.pullAllImages(docker)

    expect(mockPullAllImages).toHaveBeenCalled()

    mockPullAllImages.mockRestore()
  })
})
