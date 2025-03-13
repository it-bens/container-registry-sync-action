import { Lifecycle, inject, scoped } from 'tsyringe'
import { RegClientConcurrencyLimiterInterface } from './RegClientConcurrencyLimiterInterface.js'
import pLimit from 'p-limit'

@scoped(Lifecycle.ContainerScoped)
export class RegClientConcurrencyLimiter
  implements RegClientConcurrencyLimiterInterface
{
  private readonly limit: ReturnType<typeof pLimit>

  constructor(
    @inject('RegClientConcurrency')
    maxConcurrent: number = 2
  ) {
    this.limit = pLimit(maxConcurrent)
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    return this.limit(fn)
  }
}
