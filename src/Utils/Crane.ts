import * as exec from '@actions/exec'
import { Lifecycle, scoped } from 'tsyringe'

@scoped(Lifecycle.ContainerScoped)
export class Crane {
  public async mutate(
    repository: string,
    tag: string,
    annotations: { [key: string]: string },
    labels: { [key: string]: string }
  ): Promise<void> {
    const args = ['mutate']

    for (const [key, value] of Object.entries(annotations)) {
      args.push('--annotation', `${key}=${value}`)
    }

    for (const [key, value] of Object.entries(labels)) {
      args.push('--label', `${key}=${value}`)
    }

    args.push(`${repository}:${tag}`)
    await exec.exec('crane', args)
  }
}
