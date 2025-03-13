import { It, Mock } from 'moq.ts'
import { RegClientConcurrencyLimiterInterface } from '../../../src/Utils/RegClient/RegClientConcurrencyLimiterInterface.js'

export function setupRegClientConcurrencyLimiterInterface(): Mock<RegClientConcurrencyLimiterInterface> {
  const mockedRegClientConcurrencyLimiter =
    new Mock<RegClientConcurrencyLimiterInterface>()

  mockedRegClientConcurrencyLimiter
    .setup((concurrencyLimiter) => concurrencyLimiter.execute(It.IsAny))
    .returnsAsync(undefined)

  return mockedRegClientConcurrencyLimiter
}
