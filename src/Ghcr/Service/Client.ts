import { Lifecycle, scoped } from 'tsyringe'
import { ImageInformation } from '../Remote/ImageInformation.js'
import { Manifest } from '../Remote/Manifest.js'
import axios from 'axios'

@scoped(Lifecycle.ContainerScoped)
export class Client {
  public async fetchOriginalDockerHubDigest(
    repository: string,
    tag: string
  ): Promise<string | null> {
    const authToken: string = await this.fetchToken(repository)

    const manifest: Manifest | null = await this.fetchManifest(
      repository,
      tag,
      authToken
    )
    if (manifest === null) {
      return null
    }

    const topLayer: ImageInformation = await this.fetchTopLayer(
      repository,
      manifest.config.digest,
      authToken
    )
    const labels = topLayer.config.Labels || {}

    return labels['com.dockerhub.original-digest'] || null
  }

  private async fetchTopLayer(
    repository: string,
    topLayerDigest: string,
    authToken: string
  ): Promise<ImageInformation> {
    const response = await axios.get(
      `https://ghcr.io/v2/${repository}/blobs/${topLayerDigest}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/vnd.docker.distribution.manifest.v2+json'
        },
        validateStatus: function () {
          return true
        }
      }
    )

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch top layer for ${repository}:${topLayerDigest}, that contains the label information`
      )
    }

    return response.data
  }

  private async fetchToken(repository: string): Promise<string> {
    const response = await axios.get(`https://ghcr.io/token`, {
      params: { scope: `repository:${repository}:pull` },
      validateStatus: function () {
        return true
      }
    })

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch authentication token for repository ${repository}`
      )
    }
    if (!response.data.token) {
      throw new Error(
        `Authentication token not found in response for repository ${repository}`
      )
    }
    if (!response.data.token.length) {
      throw new Error(
        `Authentication token is empty in response for repository ${repository}`
      )
    }

    return response.data.token
  }

  private async fetchManifest(
    repository: string,
    tag: string,
    authToken: string
  ): Promise<Manifest | null> {
    const response = await axios.get(
      `https://ghcr.io/v2/${repository}/manifests/${tag}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/vnd.docker.distribution.manifest.v2+json'
        },
        validateStatus: function () {
          return true
        }
      }
    )

    if (response.status === 404) {
      return null
    }

    if (response.status !== 200) {
      throw new Error(`Failed to fetch manifest for ${repository}:${tag}`, {
        cause: response.status
      })
    }

    return response.data
  }
}
