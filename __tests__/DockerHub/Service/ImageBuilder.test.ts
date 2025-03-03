import { DockerHubApiImage } from '../../../src/DockerHub/Remote/DockerHubApiImage.js'
import { ImageBuilder } from '../../../src/DockerHub/Service/ImageBuilder.js'
import { Repository } from '../../../src/DockerHub/Repository.js'

describe('DockerHub/Service/ImageBuilder', () => {
  it('should build an Image from DockerHub API response', () => {
    const imageBuilder = new ImageBuilder()
    const repository = new Repository('testOrg', 'testRepo')
    const apiResponse: DockerHubApiImage = {
      architecture: 'amd64',
      digest: 'testDigest'
    }

    const image = imageBuilder.buildFromDockerHubApiResponse(
      apiResponse,
      'testIndex',
      repository
    )

    expect(image.repository).toBe(repository)
    expect(image.name).toBe('testIndex')
    expect(image.architecture).toBe('amd64')
    expect(image.digest).toBe('testDigest')
  })
})
