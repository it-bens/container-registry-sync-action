export interface LoggerInterface {
  logLoggingOutFromRepository(repository: string): void
  logSkipLoginToRepository(repository: string): void
  logTagsFound(tagCount: number, repository: string): void
  logTagsMatched(tagCount: number, repository: string): void
  logTagsToBeCopied(
    tags: string[],
    sourceRepository: string,
    targetRepository: string
  ): void
  logRegCtlCouldNotBeDeleted(path: string): void
  logRegCtlInstalled(installationPath: string, version: string): void
  logRegCtlNotInstalledYet(): void
}
