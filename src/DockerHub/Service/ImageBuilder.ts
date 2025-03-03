import { Lifecycle, scoped } from 'tsyringe'
import { DockerHubApiImage } from '../Remote/DockerHubApiImage.js'
import { Image } from '../Image.js'
import { Repository } from '../Repository.js'

@scoped(Lifecycle.ContainerScoped)
export class ImageBuilder {
  public buildFromDockerHubApiResponse(
    apiResponse: DockerHubApiImage,
    indexName: string,
    repository: Repository
  ): Image {
    return new Image(
      repository,
      indexName,
      apiResponse.architecture,
      apiResponse.digest
    )
  }
}
