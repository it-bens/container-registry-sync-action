import { Docker } from '../../../src/Utils/Docker.js'
import { DockerConcurrencyLimiter } from '../../../src/Utils/DockerConcurrencyLimiter.js'
import { Image } from '../../../src/DockerHub/Image.js'
import { MultiImageIndex } from '../../../src/DockerHub/Index/MultiImageIndex.js'
import { MultiImageIndexCollection } from '../../../src/DockerHub/Index/MultiImageIndexCollection.js'
import { Repository } from '../../../src/DockerHub/Repository.js'
import { jest } from '@jest/globals'

describe('DockerHub/MultiImageIndexCollection', () => {
  it('should correctly initialize the repository property in the constructor', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new MultiImageIndexCollection(repository)

    expect(indexCollection.repository).toBe(repository)
  })

  it('should add an index to the collection', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new MultiImageIndexCollection(repository)
    const index = new MultiImageIndex(repository, 'testName', 'testDigest', [
      new Image(repository, 'testName1', 'amd64', 'testDigest1'),
      new Image(repository, 'testName2', 'arm64', 'testDigest2')
    ])

    indexCollection.add(index)

    expect(indexCollection.all()).toContain(index)
  })

  it('should return all indices in the collection', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new MultiImageIndexCollection(repository)
    const index1 = new MultiImageIndex(repository, 'testName1', 'testDigest1', [
      new Image(repository, 'testName1', 'amd64', 'testDigest1'),
      new Image(repository, 'testName2', 'arm64', 'testDigest2')
    ])
    const index2 = new MultiImageIndex(repository, 'testName2', 'testDigest2', [
      new Image(repository, 'testName1', 'amd64', 'testDigest1'),
      new Image(repository, 'testName2', 'arm64', 'testDigest2')
    ])

    indexCollection.add(index1)
    indexCollection.add(index2)

    expect(indexCollection.all()).toEqual([index1, index2])
  })

  it('should pull all images in the collection', async () => {
    const repository = new Repository('testOrg', 'testRepo')
    const indexCollection = new MultiImageIndexCollection(repository)
    const index = new MultiImageIndex(repository, 'testName', 'testDigest', [
      new Image(repository, 'testName1', 'amd64', 'testDigest1'),
      new Image(repository, 'testName2', 'arm64', 'testDigest2')
    ])
    indexCollection.add(index)

    const mockPullAllImages = jest
      .spyOn(index, 'pullAllImages')
      .mockImplementation(async () => {})

    const docker = new Docker(new DockerConcurrencyLimiter())
    await indexCollection.pullAllImages(docker)

    expect(mockPullAllImages).toHaveBeenCalled()

    mockPullAllImages.mockRestore()
  })
})
