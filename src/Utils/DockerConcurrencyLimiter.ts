import { Lifecycle, inject, scoped } from 'tsyringe'

@scoped(Lifecycle.ContainerScoped)
export class DockerConcurrencyLimiter {
  private running = 0

  constructor(
    @inject('DockerConcurrency')
    private readonly maxConcurrent: number = 2
  ) {}

  public async execute<T>(operation: () => Promise<T>): Promise<T> {
    while (this.running >= this.maxConcurrent) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    this.running++
    try {
      return await operation()
    } finally {
      this.running--
    }
  }
}
