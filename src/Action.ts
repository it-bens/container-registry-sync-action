import { Lifecycle, inject, scoped } from 'tsyringe'
import { Inputs } from './Inputs.js'
import { Logger } from './Utils/Logger.js'
import { Action as LoginAction } from './Login/Action.js'
import { RegClient } from './Utils/RegClient.js'
import { TagFilter } from './Utils/TagFilter.js'
import { TagSorter } from './Utils/TagSorter.js'

@scoped(Lifecycle.ContainerScoped)
export class Action {
  constructor(
    @inject(LoginAction)
    private readonly loginAction: LoginAction,
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
    await this.loginAction.run(inputs)

    const sourceRepositoryTags = await this.regClient.listTagsInRepository(
      inputs.sourceRepository
    )
    this.logger.logTagsFound(sourceRepositoryTags.length, 'source')

    let filteredSourceRepositoryTags = this.tagFilter.filter(
      sourceRepositoryTags,
      inputs.tags
    )
    filteredSourceRepositoryTags = this.tagSorter.sortTags(
      filteredSourceRepositoryTags
    )
    this.logger.logTagsMatched(filteredSourceRepositoryTags.length, 'source')

    this.logger.logTagsToBeCopied(
      filteredSourceRepositoryTags,
      inputs.sourceRepository,
      inputs.targetRepository
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

  async post(inputs: Inputs) {
    await this.loginAction.post(inputs)
  }
}
