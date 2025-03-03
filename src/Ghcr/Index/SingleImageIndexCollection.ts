import { Crane } from '../../Utils/Crane.js'
import { Docker } from '../../Utils/Docker.js'
import { SingleImageIndexCollection as DockerHubSingleImageIndexCollection } from '../../DockerHub/Index/SingleImageIndexCollection.js'
import { Repository } from '../Repository.js'
import { SingleImageIndex } from './SingleImageIndex.js'

export class SingleImageIndexCollection {
  private indices: SingleImageIndex[] = []

  constructor(public readonly repository: Repository) {}

  public static fromDockerHubIndexCollection(
    repository: Repository,
    dockerHubIndexCollection: DockerHubSingleImageIndexCollection
  ) {
    const indexCollection = new SingleImageIndexCollection(repository)

    for (const dockerHubIndex of dockerHubIndexCollection.all()) {
      indexCollection.add(
        SingleImageIndex.fromDockerHubIndex(repository, dockerHubIndex)
      )
    }

    return indexCollection
  }

  public add(index: SingleImageIndex) {
    this.indices.push(index)
  }

  public getImageCount(): number {
    return this.indices.length
  }

  public async pushAllImages(docker: Docker, crane: Crane) {
    await Promise.all(
      this.indices.map((index) => index.pushImage(docker, crane))
    )
  }
}
