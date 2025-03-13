export interface RegClientConcurrencyLimiterInterface {
  execute<T>(fn: () => Promise<T>): Promise<T>
}
