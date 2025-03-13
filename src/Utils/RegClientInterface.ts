import { RegClientCredentials } from './RegClient/RegClientCredentials.js'

export interface RegClientInterface {
  listTagsInRepository(repository: string): Promise<string[]>
  logIntoRegistry(credentials: RegClientCredentials): Promise<void>
  logoutFromRegistry(credentials: RegClientCredentials): Promise<void>
  copyImageFromSourceToTarget(
    sourceRepository: string,
    sourceTag: string,
    targetRepository: string,
    targetTag: string
  ): Promise<void>
}
