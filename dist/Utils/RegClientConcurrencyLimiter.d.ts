export declare class RegClientConcurrencyLimiter {
    private readonly limit;
    constructor(maxConcurrent?: number);
    execute<T>(fn: () => Promise<T>): Promise<T>;
}
