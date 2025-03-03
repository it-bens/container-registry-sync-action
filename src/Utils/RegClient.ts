import { Lifecycle, inject, scoped } from 'tsyringe'
import { Exec } from './GitHubAction/Exec.js'
import { RegClientConcurrencyLimiter } from './RegClientConcurrencyLimiter.js'

@scoped(Lifecycle.ContainerScoped)
export class RegClient {
  constructor(
    @inject(Exec)
    private readonly exec: Exec,
    @inject(RegClientConcurrencyLimiter)
    private readonly concurrencyLimiter: RegClientConcurrencyLimiter
  ) {}

  public async listTagsInRepository(repository: string): Promise<string[]> {
    const output = await this.exec.getExecOutput('regctl', [
      'tag',
      'ls',
      repository
    ])
    return output.stdout.trim().split('\n')
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
