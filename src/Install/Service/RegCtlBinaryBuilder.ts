import { inject, injectable } from 'tsyringe'
import { Core } from '../../Utils/GitHubAction/Core.js'
import { RegCtlBinary } from '../RegCtlBinary.js'
import path from 'path'

@injectable()
export class RegCtlBinaryBuilder {
  constructor(
    @inject('ENV_HOME')
    private readonly home: string,
    @inject(Core)
    private readonly core: Core
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
