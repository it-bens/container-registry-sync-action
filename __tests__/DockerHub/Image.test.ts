import { Docker } from '../../src/Utils/Docker.js'
import { DockerConcurrencyLimiter } from '../../src/Utils/DockerConcurrencyLimiter.js'
import { Image } from '../../src/DockerHub/Image.js'
import { Repository } from '../../src/DockerHub/Repository.js'
import { jest } from '@jest/globals'

describe('DockerHub/Image', () => {
  it('should correctly initialize properties in the constructor', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const image = new Image(repository, 'testName', 'amd64', 'testDigest')

    expect(image.repository).toBe(repository)
    expect(image.name).toBe('testName')
    expect(image.architecture).toBe('amd64')
    expect(image.digest).toBe('testDigest')
  })

  it('should invoke Docker.pull with the correct parameters', async () => {
    const repository = new Repository('testOrg', 'testRepo')
    const image = new Image(repository, 'testName', 'amd64', 'testDigest')

    const mockPull = jest
      .spyOn(Docker.prototype, 'pull')
      .mockImplementation(async () => {})

    await image.pull(new Docker(new DockerConcurrencyLimiter()))

    expect(mockPull).toHaveBeenCalledWith(
      'testOrg/testRepo',
      'testName',
      'amd64'
    )

    mockPull.mockRestore()
  })
})
