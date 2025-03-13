import { RegClientConcurrencyLimiterInterface } from './RegClientConcurrencyLimiterInterface.js';
export declare class RegClientConcurrencyLimiter implements RegClientConcurrencyLimiterInterface {
    private readonly limit;
    constructor(maxConcurrent?: number);
    execute<T>(fn: () => Promise<T>): Promise<T>;
}
