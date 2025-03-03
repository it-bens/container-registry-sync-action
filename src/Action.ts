import { Lifecycle, inject, scoped } from 'tsyringe'
import { Crane } from './Utils/Crane.js'
import { Docker } from './Utils/Docker.js'
import { Client as DockerHubClient } from './DockerHub/Service/Client.js'
import { IndexCollectionCollection as DockerHubIndexCollectionCollection } from './DockerHub/Index/IndexCollectionCollection.js'
import { MultiImageIndexCollection as DockerHubMultiImageIndexCollection } from './DockerHub/Index/MultiImageIndexCollection.js'
import { SingleImageIndexCollection as DockerHubSingleImageIndexCollection } from './DockerHub/Index/SingleImageIndexCollection.js'
import { MultiImageIndexCollection as GhcrMultiImageIndexCollection } from './Ghcr/Index/MultiImageIndexCollection.js'
import { Repository as GhcrRepository } from './Ghcr/Repository.js'
import { SingleImageIndexCollection as GhcrSingleImageIndexCollection } from './Ghcr/Index/SingleImageIndexCollection.js'
import { IndexFilterAgainstGhcrInformation } from './DockerHub/Service/IndexFilterAgainstGhcrInformation.js'
import { Inputs } from './Inputs.js'
import { Logger } from './Utils/Logger.js'
import { TagFilter } from './DockerHub/Service/TagFilter.js'

@scoped(Lifecycle.ContainerScoped)
export class Action {
  constructor(
    @inject(DockerHubClient)
    private readonly dockerHubClient: DockerHubClient,
    @inject(TagFilter)
    private readonly tagFilter: TagFilter,
    @inject(IndexFilterAgainstGhcrInformation)
    private readonly indexFilterAgainstGhcrInformation: IndexFilterAgainstGhcrInformation,
    @inject(Docker)
    private readonly docker: Docker,
    @inject(Crane)
    private readonly crane: Crane,
    @inject(Logger)
    private readonly logger: Logger
  ) {}

  async run(inputs: Inputs) {
    const dockerHubIndices = await this.fetchDockerHubIndices(inputs)
    const filteredSingleImageDockerHubIndices =
      await this.filterSingleImageDockerHubIndices(
        inputs,
        dockerHubIndices.singleImageIndexCollection
      )
    const filteredMultiImageDockerHubIndices =
      await this.filterMultiImageDockerHubIndices(
        inputs,
        dockerHubIndices.multiImageIndexCollection
      )

    await filteredSingleImageDockerHubIndices.pullAllImages(this.docker)

    const ghcrSingleImageIndices = this.buildSingleImageGhcrIndices(
      inputs,
      filteredSingleImageDockerHubIndices
    )

    await ghcrSingleImageIndices.pushAllImages(this.docker, this.crane)

    const ghcrMultiImageIndices = this.buildMultiImageGhcrIndices(
      inputs,
      filteredMultiImageDockerHubIndices,
      dockerHubIndices.singleImageIndexCollection
    )

    await ghcrMultiImageIndices.buildAndPushAllManifests(this.docker)
  }

  private async fetchDockerHubIndices(
    inputs: Inputs
  ): Promise<DockerHubIndexCollectionCollection> {
    const dockerHubIndices = await this.dockerHubClient.fetchIndices(
      inputs.dockerHubOrganisation,
      inputs.dockerHubRepository
    )
    this.logger.info(
      `${dockerHubIndices.singleImageIndexCollection.length.toString()} indices with one image were found Docker Hub.`
    )
    this.logger.info(
      `${dockerHubIndices.multiImageIndexCollection.length.toString()} indices with multiple images were found Docker Hub.`
    )

    return dockerHubIndices
  }

  private async filterSingleImageDockerHubIndices(
    inputs: Inputs,
    singleImageIndexCollection: DockerHubSingleImageIndexCollection
  ): Promise<DockerHubSingleImageIndexCollection> {
    let filteredSingleImageDockerHubIndices =
      this.tagFilter.filterSingleImageIndexCollection(
        singleImageIndexCollection,
        inputs.tags
      )
    this.logger.info(
      `${filteredSingleImageDockerHubIndices.length.toString()} indices with one image match the tags filter.`
    )

    const ghcrRepository = new GhcrRepository(
      inputs.ghcrOrganisation,
      inputs.ghcrRepository
    )
    filteredSingleImageDockerHubIndices =
      await this.indexFilterAgainstGhcrInformation.withoutIndicesThatAreUpToDate(
        filteredSingleImageDockerHubIndices,
        ghcrRepository.repository()
      )
    this.logger.info(
      `${filteredSingleImageDockerHubIndices.length.toString()} indices with one image are not up-to-date in the GitHub Container Registry.`
    )

    return filteredSingleImageDockerHubIndices
  }

  private async filterMultiImageDockerHubIndices(
    inputs: Inputs,
    multiImageIndexCollection: DockerHubMultiImageIndexCollection
  ): Promise<DockerHubMultiImageIndexCollection> {
    const filteredMultiImageDockerHubIndices =
      this.tagFilter.filterMultiImageIndexCollection(
        multiImageIndexCollection,
        inputs.tags
      )
    this.logger.info(
      `${filteredMultiImageDockerHubIndices.length.toString()} indices with multiple images match the tags filter.`
    )

    return filteredMultiImageDockerHubIndices
  }

  private buildSingleImageGhcrIndices(
    inputs: Inputs,
    singleImageDockerHubIndices: DockerHubSingleImageIndexCollection
  ): GhcrSingleImageIndexCollection {
    const repository = new GhcrRepository(
      inputs.ghcrOrganisation,
      inputs.ghcrRepository
    )

    const ghcrSingleImageIndices =
      GhcrSingleImageIndexCollection.fromDockerHubIndexCollection(
        repository,
        singleImageDockerHubIndices
      )

    this.logger.info(
      `${ghcrSingleImageIndices.getImageCount().toString()} images will be pushed to the GitHub Container Registry.`
    )

    return ghcrSingleImageIndices
  }

  private buildMultiImageGhcrIndices(
    inputs: Inputs,
    multiImageIndexCollection: DockerHubMultiImageIndexCollection,
    singleImageDockerHubIndices: DockerHubSingleImageIndexCollection
  ): GhcrMultiImageIndexCollection {
    const repository = new GhcrRepository(
      inputs.ghcrOrganisation,
      inputs.ghcrRepository
    )

    const ghcrMultiImageIndices =
      GhcrMultiImageIndexCollection.fromDockerHubIndexCollection(
        repository,
        multiImageIndexCollection,
        singleImageDockerHubIndices
      )

    this.logger.info(
      `${ghcrMultiImageIndices.length.toString()} index manifests will be created and pushed to the GitHub Container Registry.`
    )

    return ghcrMultiImageIndices
  }
}
