import { Crane } from '../Utils/Crane.js'
import { Docker } from '../Utils/Docker.js'
import { Image as DockerHubImage } from '../DockerHub/Image.js'
import { Logger } from '../Utils/Logger.js'
import { Repository } from './Repository.js'

export class Image {
  private readonly originalDigestAnnotation: string =
    'com.dockerhub.original-digest'

  constructor(
    public readonly repository: Repository,
    public readonly dockerHubImage: DockerHubImage
  ) {}

  public static fromDockerHubImage(
    repository: Repository,
    dockerHubImage: DockerHubImage
  ): Image {
    return new Image(repository, dockerHubImage)
  }

  public name(): string {
    return this.dockerHubImage.name
  }

  public async push(docker: Docker, crane: Crane, logger: Logger) {
    // Docker will use a local image for further actions,
    // even if the remote version differs.
    // This might lead to a false positive up-to-date evaluation.
    await docker.pull(
      `ghcr.io/${this.repository.repository()}`,
      this.dockerHubImage.name,
      this.dockerHubImage.architecture,
      false
    )

    if (await this.isUpToDate(docker)) {
      logger.info(
        `Image ghcr.io/${this.repository.repository()}:${this.dockerHubImage.name} is up to date, skipping push`
      )
      return
    }

    await docker.tag(
      this.dockerHubImage.repository.repository(),
      this.dockerHubImage.name,
      `ghcr.io/${this.repository.repository()}`,
      this.dockerHubImage.name
    )
    await docker.push(
      `ghcr.io/${this.repository.repository()}`,
      this.dockerHubImage.name
    )

    const annotations = {}
    const labels: { [key: string]: string } = {}
    labels[this.originalDigestAnnotation] = this.dockerHubImage.digest
    await crane.mutate(
      `ghcr.io/${this.repository.repository()}`,
      this.dockerHubImage.name,
      annotations,
      labels
    )
  }

  private async isUpToDate(docker: Docker): Promise<boolean> {
    const imageInformationSets = await docker.inspectImage(
      `ghcr.io/${this.repository.repository()}`,
      this.dockerHubImage.name
    )

    if (imageInformationSets === null) {
      return false
    }
    if (imageInformationSets.length === 0) {
      return false
    }

    const labels = imageInformationSets[0].Config.Labels || {}

    const originalDigest: string = labels['com.dockerhub.original-digest'] || ''

    return originalDigest === this.dockerHubImage.digest
  }
}
