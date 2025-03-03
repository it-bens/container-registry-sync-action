import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { Client } from '../../../src/DockerHub/Service/Client.js'
import { DockerHubApiIndex } from '../../../src/DockerHub/Remote/DockerHubApiIndex.js'
import { ImageBuilder } from '../../../src/DockerHub/Service/ImageBuilder.js'
import { IndexBuilder } from '../../../src/DockerHub/Service/IndexBuilder.js'
import { jest } from '@jest/globals'

jest.mock('axios')
const mockedAxios = axios as jest.MockedFunction<typeof axios>

describe('DockerHub/Service/Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch indices correctly with one page of data', async () => {
    const imageBuilder = new ImageBuilder()
    const indexBuilder = new IndexBuilder(imageBuilder)
    const client = new Client(indexBuilder)

    interface CountResponse {
      count: number
    }
    interface PageResponse {
      results: DockerHubApiIndex[]
    }

    const mockCountResponse: AxiosResponse<CountResponse> = {
      data: {
        count: 2
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig
    }

    const mockPageResponse: AxiosResponse<PageResponse> = {
      data: {
        results: [
          {
            name: 'tag1',
            digest: 'digest1',
            images: [
              { architecture: 'amd64', digest: 'imageDigest1' },
              { architecture: 'arm64', digest: 'imageDigest2' }
            ]
          },
          {
            name: 'tag2',
            digest: 'digest2',
            images: [{ architecture: 'amd64', digest: 'imageDigest3' }]
          }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig
    }

    mockedAxios.get = jest.fn() as jest.MockedFunction<typeof axios.get>
    mockedAxios.get.mockImplementationOnce(<
      T = CountResponse | PageResponse,
      R = AxiosResponse<T, never>
    >(): Promise<R> => {
      return Promise.resolve(mockCountResponse as R)
    })
    mockedAxios.get.mockImplementationOnce(<
      T = CountResponse | PageResponse,
      R = AxiosResponse<T, never>
    >(): Promise<R> => {
      return Promise.resolve(mockPageResponse as R)
    })
    mockedAxios.get.mockImplementationOnce(<
      T = CountResponse | PageResponse,
      R = AxiosResponse<T, never>
    >(): Promise<R> => {
      return Promise.resolve(mockPageResponse as R)
    })

    const indexCollection = await client.fetchIndices('testOrg', 'testRepo')

    expect(axios.get).toHaveBeenCalledTimes(2)

    const singleImageIndexCollection =
      indexCollection.singleImageIndexCollection
    expect(singleImageIndexCollection.repository.organisation).toBe('testOrg')
    expect(singleImageIndexCollection.repository.name).toBe('testRepo')

    const multiImageIndexCollection = indexCollection.multiImageIndexCollection
    expect(multiImageIndexCollection.repository.organisation).toBe('testOrg')
    expect(multiImageIndexCollection.repository.name).toBe('testRepo')

    expect(singleImageIndexCollection.all()).toHaveLength(1)
    expect(multiImageIndexCollection.all()).toHaveLength(1)
  })

  it('should return empty collection when no indices found', async () => {
    const imageBuilder = new ImageBuilder()
    const indexBuilder = new IndexBuilder(imageBuilder)
    const client = new Client(indexBuilder)

    interface CountResponse {
      count: number
    }

    const mockCountResponse: AxiosResponse<CountResponse> = {
      data: {
        count: 0
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig
    }

    mockedAxios.get = jest.fn() as jest.MockedFunction<typeof axios.get>
    mockedAxios.get.mockResolvedValue(mockCountResponse)

    const indexCollection = await client.fetchIndices('testOrg', 'testRepo')

    expect(axios.get).toHaveBeenCalledTimes(1)

    const singleImageIndexCollection =
      indexCollection.singleImageIndexCollection
    const multiImageIndexCollection = indexCollection.multiImageIndexCollection
    expect(singleImageIndexCollection.all()).toHaveLength(0)
    expect(multiImageIndexCollection.all()).toHaveLength(0)
  })
})
