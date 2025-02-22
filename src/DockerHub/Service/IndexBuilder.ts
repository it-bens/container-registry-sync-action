import { DockerHubApiIndex } from '../Remote/DockerHubApiIndex.js'
import { Image } from '../Image.js'
import { ImageBuilder } from './ImageBuilder.js'
import { MultiImageIndex } from '../Index/MultiImageIndex.js'
import { Repository } from '../Repository.js'
import { SingleImageIndex } from '../Index/SingleImageIndex.js'

export class IndexBuilder {
  constructor(private readonly imageBuilder: ImageBuilder) {}

  public buildMultiImageIndexFromDockerHubApiResponse(
    apiResponse: DockerHubApiIndex,
    repository: Repository
  ): MultiImageIndex {
    const images: Image[] = []
    for (const imageDataset of apiResponse.images) {
      images.push(
        this.imageBuilder.buildFromDockerHubApiResponse(
          imageDataset,
          apiResponse.name,
          repository
        )
      )
    }

    return new MultiImageIndex(
      repository,
      apiResponse.name,
      apiResponse.digest,
      images
    )
  }

  public buildSingleImageIndexFromDockerHubApiResponse(
    apiResponse: DockerHubApiIndex,
    repository: Repository
  ): SingleImageIndex {
    if (apiResponse.images.length !== 1) {
      throw new Error(
        'Cannot build a single-image index from an DockerHub API response with multiple images'
      )
    }

    const image = this.imageBuilder.buildFromDockerHubApiResponse(
      apiResponse.images[0],
      apiResponse.name,
      repository
    )

    return new SingleImageIndex(
      repository,
      apiResponse.name,
      apiResponse.digest,
      image
    )
  }
}
