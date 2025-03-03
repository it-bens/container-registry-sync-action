import * as core from '@actions/core'
import { Lifecycle, scoped } from 'tsyringe'

@scoped(Lifecycle.ContainerScoped)
export class Logger {
  public info(message: string): void {
    core.info(message)
  }
}
