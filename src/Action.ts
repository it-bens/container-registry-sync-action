import { Lifecycle, inject, scoped } from 'tsyringe'
import { Inputs } from './Inputs.js'
import { Action as InstallAction } from './Install/Action.js'
import { LoggerInterface } from './Utils/LoggerInterface.js'
import { Action as LoginAction } from './Login/Action.js'
import { RegClientInterface } from './Utils/RegClientInterface.js'
import { TagFilterInterface } from './Utils/TagFilterInterface.js'
import { TagSorterInterface } from './Utils/TagSorterInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class Action {
  constructor(
    @inject(InstallAction)
    private readonly installAction: InstallAction,
    @inject(LoginAction)
    private readonly loginAction: LoginAction,
    @inject('RegClientInterface')
    private readonly regClient: RegClientInterface,
    @inject('TagFilterInterface')
    private readonly tagFilter: TagFilterInterface,
    @inject('TagSorterInterface')
    private readonly tagSorter: TagSorterInterface,
    @inject('LoggerInterface')
    private readonly logger: LoggerInterface
  ) {}

  async run(inputs: Inputs) {
    await this.installAction.run()
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
    await this.installAction.post()
  }
}
