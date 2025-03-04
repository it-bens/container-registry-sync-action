import { Exec } from './GitHubAction/Exec.js';
import { RegClientConcurrencyLimiter } from './RegClientConcurrencyLimiter.js';
import { RegClientCredentials } from './RegClientCredentials.js';
export declare class RegClient {
    private readonly exec;
    private readonly concurrencyLimiter;
    constructor(exec: Exec, concurrencyLimiter: RegClientConcurrencyLimiter);
    listTagsInRepository(repository: string): Promise<string[]>;
    logIntoRegistry(credentials: RegClientCredentials): Promise<void>;
    logoutFromRegistry(credentials: RegClientCredentials): Promise<void>;
    copyImageFromSourceToTarget(sourceRepository: string, sourceTag: string, targetRepository: string, targetTag: string): Promise<void>;
}
