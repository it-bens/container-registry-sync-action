import * as core from '@actions/core'
import { Lifecycle, scoped } from 'tsyringe'

@scoped(Lifecycle.ContainerScoped)
export class Core {
  public info(message: string): void {
    core.info(message)
  }

  public setFailed(message: string): void {
    core.setFailed(message)
  }
}
