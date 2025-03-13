import * as io from '@actions/io'
import { Lifecycle, scoped } from 'tsyringe'
import { IoInterface } from './IoInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class Io implements IoInterface {
  public async mkdirP(path: string): Promise<void> {
    await io.mkdirP(path)
  }
}
