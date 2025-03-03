export declare class DockerConcurrencyLimiter {
    private readonly maxConcurrent;
    private running;
    constructor(maxConcurrent?: number);
    execute<T>(operation: () => Promise<T>): Promise<T>;
}
