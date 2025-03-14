import { Lifecycle, inject, scoped } from 'tsyringe'
import { ExecInterface } from './GitHubAction/ExecInterface.js'
import { RegClientConcurrencyLimiterInterface } from './RegClient/RegClientConcurrencyLimiterInterface.js'
import { RegClientCredentials } from './RegClient/RegClientCredentials.js'
import { RegClientInterface } from './RegClientInterface.js'
import { registerInterface } from '../DependencyInjection/Decorator/register-interface.js'

@scoped(Lifecycle.ContainerScoped)
@registerInterface('RegClientInterface', Lifecycle.ContainerScoped)
export class RegClient implements RegClientInterface {
  constructor(
    @inject('ExecInterface')
    private readonly exec: ExecInterface,
    @inject('RegClientConcurrencyLimiterInterface')
    private readonly concurrencyLimiter: RegClientConcurrencyLimiterInterface
  ) {}

  public async listTagsInRepository(repository: string): Promise<string[]> {
    const output = await this.exec.getExecOutput(
      'regctl',
      ['tag', 'ls', repository],
      { silent: true }
    )
    return output.stdout.trim().split('\n')
  }

  public async logIntoRegistry(
    credentials: RegClientCredentials
  ): Promise<void> {
    const args = ['registry', 'login']

    if (credentials.registry !== null) {
      args.push(credentials.registry)
    }

    args.push('-u', credentials.username, '--pass-stdin')

    await this.exec.exec('regctl', args, {
      input: Buffer.from(credentials.password)
    })
  }

  public async logoutFromRegistry(
    credentials: RegClientCredentials
  ): Promise<void> {
    const args = ['registry', 'logout']

    if (credentials.registry !== null) {
      args.push(credentials.registry)
    }

    await this.exec.exec('regctl', args)
  }

  public async copyImageFromSourceToTarget(
    sourceRepository: string,
    sourceTag: string,
    targetRepository: string,
    targetTag: string
  ): Promise<void> {
    const result = await this.concurrencyLimiter.execute(() =>
      this.exec.exec(
        'regctl',
        [
          'image',
          'copy',
          `${sourceRepository}:${sourceTag}`,
          `${targetRepository}:${targetTag}`
        ],
        {
          ignoreReturnCode: true
        }
      )
    )

    if (result !== 0) {
      throw new Error(
        `Failed to copy image from ${sourceRepository}:${sourceTag} to ${targetRepository}:${targetTag}`
      )
    }
  }
}
