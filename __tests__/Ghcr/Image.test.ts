import { Crane } from '../../src/Utils/Crane.js'
import { Docker } from '../../src/Utils/Docker.js'
import { DockerConcurrencyLimiter } from '../../src/Utils/DockerConcurrencyLimiter.js'
import { Image as DockerHubImage } from '../../src/DockerHub/Image.js'
import { Image } from '../../src/Ghcr/Image.js'
import { Repository } from '../../src/Ghcr/Repository.js'
import { jest } from '@jest/globals'

describe('Ghcr/Image', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create an image correctly', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const dockerHubImage = new DockerHubImage(
      repository,
      'latest',
      'amd64',
      'sha256:1234'
    )
    const image = new Image(repository, dockerHubImage)

    expect(image.repository).toBe(repository)
    expect(image.dockerHubImage).toBe(dockerHubImage)
    expect(image.name()).toBe('latest')
  })

  it('should create an image from DockerHubImage correctly', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const dockerHubImage = new DockerHubImage(
      repository,
      'latest',
      'amd64',
      'sha256:1234'
    )
    const image = Image.fromDockerHubImage(repository, dockerHubImage)

    expect(image.repository).toBe(repository)
    expect(image.dockerHubImage).toBe(dockerHubImage)
    expect(image.name()).toBe('latest')
  })

  it('should push image', async () => {
    const repository = new Repository('testOrg', 'testRepo')
    const dockerHubImage = new DockerHubImage(
      repository,
      'latest',
      'amd64',
      'sha256:1234'
    )
    const image = new Image(repository, dockerHubImage)

    const docker: Docker = new Docker(new DockerConcurrencyLimiter())
    const crane: Crane = new Crane()

    jest.spyOn(docker, 'pull').mockResolvedValue()
    jest.spyOn(docker, 'tag').mockResolvedValue()
    jest.spyOn(docker, 'push').mockResolvedValue()
    jest.spyOn(crane, 'mutate').mockResolvedValue()

    await image.push(docker, crane)

    expect(docker.pull).toHaveBeenCalledWith(
      'ghcr.io/testOrg/testRepo',
      'latest',
      'amd64',
      false
    )
    expect(docker.tag).toHaveBeenCalledWith(
      'testOrg/testRepo',
      'latest',
      'ghcr.io/testOrg/testRepo',
      'latest'
    )
    expect(docker.push).toHaveBeenCalledWith(
      'ghcr.io/testOrg/testRepo',
      'latest'
    )
    expect(crane.mutate).toHaveBeenCalledWith(
      'ghcr.io/testOrg/testRepo',
      'latest',
      {},
      { 'com.dockerhub.original-digest': 'sha256:1234' }
    )
  })
})
