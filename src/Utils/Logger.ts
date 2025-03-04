import { Lifecycle, inject, scoped } from 'tsyringe'
import { Core } from './GitHubAction/Core.js'

@scoped(Lifecycle.ContainerScoped)
export class Logger {
  constructor(
    @inject(Core)
    private readonly core: Core
  ) {}

  public logLoggingOutFromRepository(repository: string): void {
    this.core.info(`Logging out from ${repository} repository.`)
  }

  public logSkipLoginToRepository(repository: string): void {
    this.core.info(`Skipping login to ${repository} repository.`)
  }

  public logTagsFound(tagCount: number, repository: string): void {
    this.core.info(
      `${tagCount.toString()} tags were found in the ${repository} repository.`
    )
  }

  public logTagsMatched(tagCount: number, repository: string): void {
    this.core.info(
      `${tagCount.toString()} tags match the tags filter in the ${repository} repository.`
    )
  }

  public logTagsToBeCopied(
    tags: string[],
    sourceRepository: string,
    targetRepository: string
  ): void {
    const startingText = `The following tags will be copied from ${sourceRepository} to ${targetRepository}: `
    let message = startingText

    for (const tag of tags) {
      if ((message + tag + ', ').length > 1000) {
        this.core.info(message.slice(0, -2)) // Remove the trailing comma and space
        message = tag + ', '
      } else {
        message += tag + ', '
      }
    }

    if (message.length > startingText.length) {
      this.core.info(message.slice(0, -2)) // Log the remaining tags
    }
  }
}
