import { Lifecycle, scoped } from 'tsyringe'
import { Inputs } from '../../Inputs.js'
import { RegClientCredentials } from '../../Utils/RegClient/RegClientCredentials.js'
import { RegClientCredentialsBuilderInterface } from './RegClientCredentialsBuilderInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class RegClientCredentialsBuilder
  implements RegClientCredentialsBuilderInterface
{
  public build(inputs: Inputs): {
    source: RegClientCredentials
    target: RegClientCredentials
  } {
    const sourceRegistry =
      inputs.sourceRepository.split('/').length === 2
        ? null
        : inputs.sourceRepository.split('/')[0]
    const targetRegistry =
      inputs.targetRepository.split('/').length === 2
        ? null
        : inputs.targetRepository.split('/')[0]

    return {
      source: {
        registry: sourceRegistry,
        username: inputs.sourceRepositoryUsername,
        password: inputs.sourceRepositoryPassword
      },
      target: {
        registry: targetRegistry,
        username: inputs.targetRepositoryUsername,
        password: inputs.targetRepositoryPassword
      }
    }
  }
}
