import { RegClientConcurrencyLimiter } from '../../src/Utils/RegClientConcurrencyLimiter.js'

describe('RegClientConcurrencyLimiter', () => {
  it('should limit the number of concurrent executions', async () => {
    const limiter = new RegClientConcurrencyLimiter(2)
    let activeTasks = 0
    const task = async () => {
      activeTasks++
      expect(activeTasks).toBeLessThanOrEqual(2)
      await new Promise((resolve) => setTimeout(resolve, 100))
      activeTasks--
    }

    await Promise.all([
      limiter.execute(task),
      limiter.execute(task),
      limiter.execute(task)
    ])
  })

  it('should execute tasks in order', async () => {
    const limiter = new RegClientConcurrencyLimiter(1)
    const results: number[] = []
    const task = async (index: number) => {
      results.push(index)
    }

    await Promise.all([
      limiter.execute(() => task(1)),
      limiter.execute(() => task(2)),
      limiter.execute(() => task(3))
    ])

    expect(results).toEqual([1, 2, 3])
  })
})
