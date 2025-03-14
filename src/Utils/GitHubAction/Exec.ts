import * as exec from '@actions/exec'
import { Lifecycle, scoped } from 'tsyringe'
import { ExecInterface } from './ExecInterface.js'
import { registerInterface } from '../../DependencyInjection/Decorator/register-interface.js'

@scoped(Lifecycle.ContainerScoped)
@registerInterface('ExecInterface', Lifecycle.ContainerScoped)
export class Exec implements ExecInterface {
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
