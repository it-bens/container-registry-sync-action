import * as core from '@actions/core'
import { Lifecycle, scoped } from 'tsyringe'

@scoped(Lifecycle.ContainerScoped)
export class Core {
  public getInput(name: string, options?: core.InputOptions): string {
    return core.getInput(name, options)
  }

  public info(message: string): void {
    core.info(message)
  }

  public setFailed(message: string): void {
    core.setFailed(message)
  }
}
