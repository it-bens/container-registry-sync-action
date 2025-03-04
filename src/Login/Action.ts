import { Lifecycle, inject, scoped } from 'tsyringe'
import { Inputs } from '../Inputs.js'
import { Logger } from '../Utils/Logger.js'
import { RegClient } from '../Utils/RegClient.js'
import { RegClientCredentialsBuilder } from './Service/RegClientCredentialsBuilder.js'

@scoped(Lifecycle.ContainerScoped)
export class Action {
  constructor(
    @inject(RegClientCredentialsBuilder)
    private readonly credentialsBuilder: RegClientCredentialsBuilder,
    @inject(RegClient)
    private readonly regClient: RegClient,
    @inject(Logger)
    private readonly logger: Logger
  ) {}

  async run(inputs: Inputs): Promise<void> {
    const regClientCredentials = this.credentialsBuilder.build(inputs)

    if (!inputs.loginToSourceRepository) {
      this.logger.info('Skipping login to source repository.')
    } else if (
      regClientCredentials.source.username === '' ||
      regClientCredentials.source.password === ''
    ) {
      throw new Error(
        'Source repository credentials (username and/or password) are missing.'
      )
    } else {
      await this.regClient.logIntoRegistry(regClientCredentials.source)
    }

    if (!inputs.loginToTargetRepository) {
      this.logger.info('Skipping login to target repository.')
    } else if (
      regClientCredentials.target.username === '' ||
      regClientCredentials.target.password === ''
    ) {
      throw new Error(
        'Target repository credentials (username and/or password) are missing.'
      )
    } else {
      await this.regClient.logIntoRegistry(regClientCredentials.target)
    }
  }
}
