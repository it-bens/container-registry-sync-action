import { Crane } from '../Utils/Crane.js'
import { Docker } from '../Utils/Docker.js'
import { Image as DockerHubImage } from '../DockerHub/Image.js'
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

  public async push(docker: Docker, crane: Crane) {
    // Docker will use a local image for further actions,
    // even if the remote version differs.
    // This might lead to a false positive up-to-date evaluation.
    await docker.pull(
      `ghcr.io/${this.repository.repository()}`,
      this.dockerHubImage.name,
      this.dockerHubImage.architecture,
      false
    )

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
}
