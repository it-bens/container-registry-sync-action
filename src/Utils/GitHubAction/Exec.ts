import * as exec from '@actions/exec'
import { Lifecycle, scoped } from 'tsyringe'

@scoped(Lifecycle.ContainerScoped)
export class Exec {
  public exec(
    commandLine: string,
    args?: string[],
    options?: exec.ExecOptions
  ): Promise<number> {
    return exec.exec(commandLine, args, options)
  }

  public getExecOutput(
    commandLine: string,
    args?: string[],
    options?: exec.ExecOptions
  ): Promise<exec.ExecOutput> {
    return exec.getExecOutput(commandLine, args, options)
  }
}
