import { Docker } from '../../Utils/Docker.js'
import { MultiImageIndexCollection as DockerHubMultiImageIndexCollection } from '../../DockerHub/Index/MultiImageIndexCollection.js'
import { SingleImageIndexCollection as DockerHubSingleImageIndexCollection } from '../../DockerHub/Index/SingleImageIndexCollection.js'
import { MultiImageIndex } from './MultiImageIndex.js'
import { Repository } from '../Repository.js'

export class MultiImageIndexCollection {
  public length: number = 0
  private indices: MultiImageIndex[] = []

  constructor(public readonly repository: Repository) {}

  public static fromDockerHubIndexCollection(
    repository: Repository,
    dockerHubIndexCollection: DockerHubMultiImageIndexCollection,
    dockerHubSingleImageIndexCollection: DockerHubSingleImageIndexCollection
  ) {
    const indexCollection = new MultiImageIndexCollection(repository)

    for (const dockerHubIndex of dockerHubIndexCollection.all()) {
      indexCollection.add(
        MultiImageIndex.fromDockerHubIndex(
          repository,
          dockerHubIndex,
          dockerHubSingleImageIndexCollection
        )
      )
    }

    return indexCollection
  }

  public add(index: MultiImageIndex) {
    this.indices.push(index)
    this.length = this.indices.length
  }

  public async buildAndPushAllManifests(docker: Docker) {
    await Promise.all(
      this.indices.map((index) => index.buildAndPushManifest(docker))
    )
  }
}
