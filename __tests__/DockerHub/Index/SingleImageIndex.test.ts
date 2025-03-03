import { Docker } from '../../../src/Utils/Docker.js'
import { DockerConcurrencyLimiter } from '../../../src/Utils/DockerConcurrencyLimiter.js'
import { Image } from '../../../src/DockerHub/Image.js'
import { Repository } from '../../../src/DockerHub/Repository.js'
import { SingleImageIndex } from '../../../src/DockerHub/Index/SingleImageIndex.js'
import { jest } from '@jest/globals'

describe('DockerHub/SingleImageIndex', () => {
  it('should correctly initialize properties in the constructor', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const image = new Image(repository, 'testName1', 'amd64', 'testDigest1')
    const index = new SingleImageIndex(
      repository,
      'testName',
      'testDigest',
      image
    )

    expect(index.repository).toBe(repository)
    expect(index.name).toBe('testName')
    expect(index.digest).toBe('testDigest')
    expect(index.image).toBe(image)
  })

  it('should pull the image in the index', async () => {
    const repository = new Repository('testOrg', 'testRepo')
    const image = new Image(repository, 'testName1', 'amd64', 'testDigest1')
    const index = new SingleImageIndex(
      repository,
      'testName',
      'testDigest',
      image
    )

    const mockPull = jest
      .spyOn(image, 'pull')
      .mockImplementation(async () => {})

    const docker = new Docker(new DockerConcurrencyLimiter())
    await index.pullImage(docker)

    expect(mockPull).toHaveBeenCalled()

    mockPull.mockRestore()
  })
})
