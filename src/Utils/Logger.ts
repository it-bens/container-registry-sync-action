import { Lifecycle, inject, scoped } from 'tsyringe'
import { CoreInterface } from './GitHubAction/CoreInterface.js'
import { LoggerInterface } from './LoggerInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class Logger implements LoggerInterface {
  constructor(
    @inject('CoreInterface')
    private readonly core: CoreInterface
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

  public logRegCtlCouldNotBeDeleted(path: string): void {
    this.core.error(`regctl could not be deleted from ${path}`)
  }

  public logRegCtlInstalled(installationPath: string, version: string): void {
    this.core.info(
      `regctl version ${version} was installed to ${installationPath}`
    )
  }

  public logRegCtlNotInstalledYet(): void {
    this.core.info('regctl is not installed yet but it will be installed now.')
  }
}
