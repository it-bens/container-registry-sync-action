import { Lifecycle, inject, scoped } from 'tsyringe'
import { Core } from './GitHubAction/Core.js'

@scoped(Lifecycle.ContainerScoped)
export class Logger {
  constructor(
    @inject(Core)
    private readonly core: Core
  ) {}

  public info(message: string): void {
    this.core.info(message)
  }
}
