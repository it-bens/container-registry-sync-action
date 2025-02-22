import { Docker } from '../../Utils/Docker.js'
import { MultiImageIndex as DockerHubMultiImageIndex } from '../../DockerHub/Index/MultiImageIndex.js'
import { SingleImageIndexCollection as DockerHubSingleImageIndexCollection } from '../../DockerHub/Index/SingleImageIndexCollection.js'
import { Image } from '../Image.js'
import { Repository } from '../Repository.js'

export class MultiImageIndex {
  constructor(
    public readonly repository: Repository,
    public readonly name: string,
    public readonly images: Image[],
    private readonly dockerHubSingleImageIndexCollection: DockerHubSingleImageIndexCollection
  ) {}

  public static fromDockerHubIndex(
    repository: Repository,
    dockerHubIndex: DockerHubMultiImageIndex,
    dockerHubSingleImageIndexCollection: DockerHubSingleImageIndexCollection
  ) {
    const images: Image[] = []
    for (const image of dockerHubIndex.images) {
      images.push(Image.fromDockerHubImage(repository, image))
    }

    return new MultiImageIndex(
      repository,
      dockerHubIndex.name,
      images,
      dockerHubSingleImageIndexCollection
    )
  }

  public async buildAndPushManifest(docker: Docker) {
    const images: { repository: string; digest: string }[] = this.images.map(
      (imageFromMultiImageIndex) => {
        const singleImageIndices = this.dockerHubSingleImageIndexCollection
          .allImages()
          .filter(
            (dockerHubImageFromSingleImageIndex) =>
              dockerHubImageFromSingleImageIndex.digest ===
              imageFromMultiImageIndex.dockerHubImage.digest
          )

        if (singleImageIndices.length === 0) {
          throw new Error(
            `Image ${imageFromMultiImageIndex.name()} not found in collection of all GHCR images`
          )
        }

        const singleImageIndex = singleImageIndices[0]

        return {
          repository: `ghcr.io/${imageFromMultiImageIndex.repository.repository()}`,
          digest: singleImageIndex.digest
        }
      }
    )

    await docker.deleteManifest(
      `ghcr.io/${this.repository.repository()}`,
      this.name,
      false
    )
    await docker.createManifest(
      `ghcr.io/${this.repository.repository()}`,
      this.name,
      images
    )
    await docker.pushManifest(
      `ghcr.io/${this.repository.repository()}`,
      this.name
    )
  }
}
