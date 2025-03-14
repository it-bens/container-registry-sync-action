import { Lifecycle, inject, scoped } from 'tsyringe'
import { CoreInterface } from '../../Utils/GitHubAction/CoreInterface.js'
import { RegCtlBinary } from '../RegCtlBinary.js'
import { RegCtlBinaryBuilderInterface } from './RegCtlBinaryBuilderInterface.js'
import path from 'path'
import { registerInterface } from '../../DependencyInjection/Decorator/register-interface.js'

@scoped(Lifecycle.ContainerScoped)
@registerInterface('RegCtlBinaryBuilderInterface', Lifecycle.ContainerScoped)
export class RegCtlBinaryBuilder implements RegCtlBinaryBuilderInterface {
  constructor(
    @inject('ENV_HOME')
    private readonly home: string,
    @inject('CoreInterface')
    private readonly core: CoreInterface
  ) {}

  public build(version: string): RegCtlBinary {
    const installDir = path.join(this.home, '.regctl', 'bin')

    return new RegCtlBinary(
      installDir,
      version,
      this.core.platform(),
      this.core.platformArch()
    )
  }
}
