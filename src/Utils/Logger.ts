import * as core from '@actions/core'

export class Logger {
  public info(message: string): void {
    core.info(message)
  }
}
