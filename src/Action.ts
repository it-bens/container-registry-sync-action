import { Lifecycle, inject, scoped } from 'tsyringe'
import { Inputs } from './Inputs.js'
import { Logger } from './Utils/Logger.js'
import { RegClient } from './Utils/RegClient.js'
import { TagFilter } from './Utils/TagFilter.js'
import { TagSorter } from './Utils/TagSorter.js'

@scoped(Lifecycle.ContainerScoped)
export class Action {
  constructor(
    @inject(RegClient)
    private readonly regClient: RegClient,
    @inject(TagFilter)
    private readonly tagFilter: TagFilter,
    @inject(TagSorter)
    private readonly tagSorter: TagSorter,
    @inject(Logger)
    private readonly logger: Logger
  ) {}

  async run(inputs: Inputs) {
    const sourceRepositoryTags = await this.regClient.listTagsInRepository(
      inputs.sourceRepository
    )
    this.logger.info(
      `${sourceRepositoryTags.length.toString()} tags were found in the source repository.`
    )

    let filteredSourceRepositoryTags = this.tagFilter.filter(
      sourceRepositoryTags,
      inputs.tags
    )
    filteredSourceRepositoryTags = this.tagSorter.sortTags(
      filteredSourceRepositoryTags
    )
    this.logger.info(
      `${filteredSourceRepositoryTags.length.toString()} tags match the tags filter.`
    )

    this.logger.info(
      `The following tags will be copied from ${inputs.sourceRepository} to ${inputs.targetRepository}: ${filteredSourceRepositoryTags.join(', ')}.`
    )
    for (const tag of filteredSourceRepositoryTags) {
      await this.regClient.copyImageFromSourceToTarget(
        inputs.sourceRepository,
        tag,
        inputs.targetRepository,
        tag
      )
    }
  }
}
