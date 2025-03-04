import { Lifecycle, inject, scoped } from 'tsyringe'
import { Core } from '../Utils/GitHubAction/Core.js'
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
    private readonly logger: Logger,
    @inject(Core)
    private readonly core: Core
  ) {}

  async run(inputs: Inputs): Promise<void> {
    const regClientCredentials = this.credentialsBuilder.build(inputs)

    if (!inputs.loginToSourceRepository) {
      this.logger.logSkipLoginToRepository('source')
    } else if (
      regClientCredentials.source.username === '' ||
      regClientCredentials.source.password === ''
    ) {
      this.core.setFailed(
        'Source repository credentials (username and/or password) are missing.'
      )
    } else {
      await this.regClient.logIntoRegistry(regClientCredentials.source)
    }

    if (!inputs.loginToTargetRepository) {
      this.logger.logSkipLoginToRepository('target')
    } else if (
      regClientCredentials.target.username === '' ||
      regClientCredentials.target.password === ''
    ) {
      this.core.setFailed(
        'Target repository credentials (username and/or password) are missing.'
      )
    } else {
      await this.regClient.logIntoRegistry(regClientCredentials.target)
    }
  }

  async post(inputs: Inputs): Promise<void> {
    if (inputs.loginToSourceRepository) {
      this.logger.logLoggingOutFromRepository('source')
      await this.regClient.logoutFromRegistry(
        this.credentialsBuilder.build(inputs).source
      )
    }

    if (inputs.loginToTargetRepository) {
      this.logger.logLoggingOutFromRepository('target')
      await this.regClient.logoutFromRegistry(
        this.credentialsBuilder.build(inputs).target
      )
    }
  }
}
