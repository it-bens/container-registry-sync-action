import { DockerHubApiIndex } from '../../../src/DockerHub/Remote/DockerHubApiIndex.js'
import { Image } from '../../../src/DockerHub/Image.js'
import { ImageBuilder } from '../../../src/DockerHub/Service/ImageBuilder.js'
import { IndexBuilder } from '../../../src/DockerHub/Service/IndexBuilder.js'
import { Repository } from '../../../src/DockerHub/Repository.js'
import { jest } from '@jest/globals'

describe('DockerHub/Service/IndexBuilder', () => {
  it('should build a multi image index from DockerHub API response', () => {
    const imageBuilder = new ImageBuilder()
    const indexBuilder = new IndexBuilder(imageBuilder)
    const repository = new Repository('testOrg', 'testRepo')
    const apiResponse: DockerHubApiIndex = {
      name: 'testIndex',
      digest: 'testDigest',
      images: [
        { architecture: 'amd64', digest: 'digest1' },
        { architecture: 'arm64', digest: 'digest2' }
      ]
    }

    jest
      .spyOn(imageBuilder, 'buildFromDockerHubApiResponse')
      .mockImplementation((imageDataset, indexName, repo) => {
        return new Image(
          repo,
          indexName,
          imageDataset.architecture,
          imageDataset.digest
        )
      })

    const index = indexBuilder.buildMultiImageIndexFromDockerHubApiResponse(
      apiResponse,
      repository
    )

    expect(index.repository).toBe(repository)
    expect(index.name).toBe('testIndex')
    expect(index.digest).toBe('testDigest')
    expect(index.images).toHaveLength(2)
    expect(index.images[0].name).toBe('testIndex')
    expect(index.images[1].name).toBe('testIndex')
  })

  it('should throw an error when building a single image index with more than one image in the API response', () => {
    const imageBuilder = new ImageBuilder()
    const indexBuilder = new IndexBuilder(imageBuilder)
    const repository = new Repository('testOrg', 'testRepo')
    const apiResponse: DockerHubApiIndex = {
      name: 'testIndex',
      digest: 'testDigest',
      images: [
        { architecture: 'amd64', digest: 'digest1' },
        { architecture: 'arm64', digest: 'digest2' }
      ]
    }

    expect(() => {
      indexBuilder.buildSingleImageIndexFromDockerHubApiResponse(
        apiResponse,
        repository
      )
    }).toThrow(
      'Cannot build a single-image index from an DockerHub API response with multiple images'
    )
  })

  it('should build a single image index from DockerHub API response', () => {
    const imageBuilder = new ImageBuilder()
    const indexBuilder = new IndexBuilder(imageBuilder)
    const repository = new Repository('testOrg', 'testRepo')
    const apiResponse: DockerHubApiIndex = {
      name: 'testIndex',
      digest: 'testDigest',
      images: [{ architecture: 'amd64', digest: 'digest1' }]
    }

    jest
      .spyOn(imageBuilder, 'buildFromDockerHubApiResponse')
      .mockImplementation((imageDataset, indexName, repo) => {
        return new Image(
          repo,
          indexName,
          imageDataset.architecture,
          imageDataset.digest
        )
      })

    const index = indexBuilder.buildSingleImageIndexFromDockerHubApiResponse(
      apiResponse,
      repository
    )

    expect(index.repository).toBe(repository)
    expect(index.name).toBe('testIndex')
    expect(index.digest).toBe('testDigest')
    expect(index.image.name).toBe('testIndex')
    expect(index.image.name).toBe('testIndex')
  })
})
