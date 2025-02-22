import { Crane } from '../../Utils/Crane.js'
import { Docker } from '../../Utils/Docker.js'
import { SingleImageIndex as DockerHubSingleImageIndex } from '../../DockerHub/Index/SingleImageIndex.js'
import { Image } from '../Image.js'
import { Logger } from '../../Utils/Logger.js'
import { Repository } from '../Repository.js'

export class SingleImageIndex {
  constructor(
    public readonly repository: Repository,
    public readonly name: string,
    public readonly image: Image
  ) {}

  public static fromDockerHubIndex(
    repository: Repository,
    dockerHubIndex: DockerHubSingleImageIndex
  ) {
    return new SingleImageIndex(
      repository,
      dockerHubIndex.name,
      Image.fromDockerHubImage(repository, dockerHubIndex.image)
    )
  }

  public async pushImage(docker: Docker, crane: Crane, logger: Logger) {
    await this.image.push(docker, crane, logger)
  }
}
