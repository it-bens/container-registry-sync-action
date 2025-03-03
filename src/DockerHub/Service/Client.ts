import { Lifecycle, inject, scoped } from 'tsyringe'
import { DockerHubApiIndex } from '../Remote/DockerHubApiIndex.js'
import { IndexBuilder } from './IndexBuilder.js'
import { IndexCollectionCollection } from '../Index/IndexCollectionCollection.js'
import { MultiImageIndexCollection } from '../Index/MultiImageIndexCollection.js'
import { Repository } from '../Repository.js'
import { SingleImageIndexCollection } from '../Index/SingleImageIndexCollection.js'
import axios from 'axios'
import { sprintf } from '../../Utils/sprintf.js'

@scoped(Lifecycle.ContainerScoped)
export class Client {
  private readonly urlTemplate: string =
    'https://hub.docker.com/v2/repositories/%s/tags'

  constructor(
    @inject(IndexBuilder)
    private readonly indexBuilder: IndexBuilder
  ) {}

  public async fetchIndices(
    organisationName: string,
    repositoryName: string
  ): Promise<IndexCollectionCollection> {
    const repository: Repository = new Repository(
      organisationName,
      repositoryName
    )
    const singleImageIndexCollection: SingleImageIndexCollection =
      new SingleImageIndexCollection(repository)
    const multiImageIndexCollection: MultiImageIndexCollection =
      new MultiImageIndexCollection(repository)
    const pageSize = 100

    const pageCount = await this.fetchPageCount(
      repository.repository(),
      pageSize
    )
    if (pageCount === 0) {
      return new IndexCollectionCollection(
        singleImageIndexCollection,
        multiImageIndexCollection
      )
    }

    const fetchTagPagePromises: Promise<void>[] = []
    for (let page = 1; page <= pageCount; page++) {
      fetchTagPagePromises.push(
        this.fetchTagPage(
          repository,
          page,
          pageSize,
          singleImageIndexCollection,
          multiImageIndexCollection
        )
      )
    }

    await Promise.all(fetchTagPagePromises)

    return new IndexCollectionCollection(
      singleImageIndexCollection,
      multiImageIndexCollection
    )
  }

  private async fetchPageCount(
    repository: string,
    pageSize: number
  ): Promise<number> {
    const url: string = sprintf(this.urlTemplate, repository)

    const response = await axios.get(url)
    const count = response.data.count
    return Math.ceil(count / pageSize)
  }

  private async fetchTagPage(
    repository: Repository,
    page: number,
    pageSize: number,
    singleImageIndexCollection: SingleImageIndexCollection,
    multiImageIndexCollection: MultiImageIndexCollection
  ) {
    const url: string = sprintf(this.urlTemplate, repository.repository())

    const response = await axios.get(url, {
      params: { page, page_size: pageSize }
    })
    const datasets: DockerHubApiIndex[] = response.data.results
    for (const dataset of datasets) {
      if (dataset.images.length === 1) {
        singleImageIndexCollection.add(
          this.indexBuilder.buildSingleImageIndexFromDockerHubApiResponse(
            dataset,
            repository
          )
        )
        continue
      }

      if (dataset.images.length > 1) {
        multiImageIndexCollection.add(
          this.indexBuilder.buildMultiImageIndexFromDockerHubApiResponse(
            dataset,
            repository
          )
        )
      }
    }
  }
}
