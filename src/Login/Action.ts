import { Lifecycle, inject, scoped } from 'tsyringe'
import { CoreInterface } from '../Utils/GitHubAction/CoreInterface.js'
import { Inputs } from '../Inputs.js'
import { LoggerInterface } from '../Utils/LoggerInterface.js'
import { RegClientCredentialsBuilderInterface } from './Service/RegClientCredentialsBuilderInterface.js'
import { RegClientInterface } from '../Utils/RegClientInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class Action {
  constructor(
    @inject('RegClientCredentialsBuilderInterface')
    private readonly credentialsBuilder: RegClientCredentialsBuilderInterface,
    @inject('RegClientInterface')
    private readonly regClient: RegClientInterface,
    @inject('LoggerInterface')
    private readonly logger: LoggerInterface,
    @inject('CoreInterface')
    private readonly core: CoreInterface
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
