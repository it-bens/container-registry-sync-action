import { Exec } from './GitHubAction/Exec.js';
import { RegClientConcurrencyLimiter } from './RegClientConcurrencyLimiter.js';
export declare class RegClient {
    private readonly exec;
    private readonly concurrencyLimiter;
    constructor(exec: Exec, concurrencyLimiter: RegClientConcurrencyLimiter);
    listTagsInRepository(repository: string): Promise<string[]>;
    copyImageFromSourceToTarget(sourceRepository: string, sourceTag: string, targetRepository: string, targetTag: string): Promise<void>;
}
