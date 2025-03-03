import { Lifecycle, inject, scoped } from 'tsyringe'
import pLimit from 'p-limit'

@scoped(Lifecycle.ContainerScoped)
export class RegClientConcurrencyLimiter {
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
