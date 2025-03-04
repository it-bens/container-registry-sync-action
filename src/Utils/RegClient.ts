import { Lifecycle, inject, scoped } from 'tsyringe'
import { Exec } from './GitHubAction/Exec.js'
import { RegClientConcurrencyLimiter } from './RegClientConcurrencyLimiter.js'
import { RegClientCredentials } from './RegClientCredentials.js'

@scoped(Lifecycle.ContainerScoped)
export class RegClient {
  constructor(
    @inject(Exec)
    private readonly exec: Exec,
    @inject(RegClientConcurrencyLimiter)
    private readonly concurrencyLimiter: RegClientConcurrencyLimiter
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
    await this.concurrencyLimiter.execute(() =>
      this.exec.exec('regctl', [
        'image',
        'copy',
        `${sourceRepository}:${sourceTag}`,
        `${targetRepository}:${targetTag}`
      ])
    )
  }
}
