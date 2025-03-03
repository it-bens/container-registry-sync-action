import { Docker } from '../../../src/Utils/Docker.js'
import { DockerConcurrencyLimiter } from '../../../src/Utils/DockerConcurrencyLimiter.js'
import { Image } from '../../../src/DockerHub/Image.js'
import { MultiImageIndex } from '../../../src/DockerHub/Index/MultiImageIndex.js'
import { Repository } from '../../../src/DockerHub/Repository.js'
import { jest } from '@jest/globals'

describe('DockerHub/MultiImageIndex', () => {
  it('should correctly initialize properties in the constructor', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const images = [
      new Image(repository, 'testName1', 'amd64', 'testDigest1'),
      new Image(repository, 'testName2', 'arm64', 'testDigest2')
    ]
    const index = new MultiImageIndex(
      repository,
      'testName',
      'testDigest',
      images
    )

    expect(index.repository).toBe(repository)
    expect(index.name).toBe('testName')
    expect(index.digest).toBe('testDigest')
    expect(index.images).toBe(images)
  })

  it('should throw an error if initialized with less than two images', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const images = [new Image(repository, 'testName1', 'amd64', 'testDigest1')]

    expect(() => {
      new MultiImageIndex(repository, 'testName', 'testDigest', images)
    }).toThrow('A multi-image index must contain at least two images')
  })

  it('should pull all images in the index', async () => {
    const repository = new Repository('testOrg', 'testRepo')
    const images = [
      new Image(repository, 'testName1', 'amd64', 'testDigest1'),
      new Image(repository, 'testName2', 'arm64', 'testDigest2')
    ]
    const index = new MultiImageIndex(
      repository,
      'testName',
      'testDigest',
      images
    )

    const mockPull = jest
      .spyOn(images[0], 'pull')
      .mockImplementation(async () => {})
    jest.spyOn(images[1], 'pull').mockImplementation(async () => {})

    const docker = new Docker(new DockerConcurrencyLimiter())
    await index.pullAllImages(docker)

    expect(mockPull).toHaveBeenCalled()

    mockPull.mockRestore()
  })
})
