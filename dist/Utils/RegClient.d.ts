import { ExecInterface } from './GitHubAction/ExecInterface.js';
import { RegClientConcurrencyLimiterInterface } from './RegClient/RegClientConcurrencyLimiterInterface.js';
import { RegClientCredentials } from './RegClient/RegClientCredentials.js';
import { RegClientInterface } from './RegClientInterface.js';
export declare class RegClient implements RegClientInterface {
    private readonly exec;
    private readonly concurrencyLimiter;
    constructor(exec: ExecInterface, concurrencyLimiter: RegClientConcurrencyLimiterInterface);
    listTagsInRepository(repository: string): Promise<string[]>;
    logIntoRegistry(credentials: RegClientCredentials): Promise<void>;
    logoutFromRegistry(credentials: RegClientCredentials): Promise<void>;
    copyImageFromSourceToTarget(sourceRepository: string, sourceTag: string, targetRepository: string, targetTag: string): Promise<void>;
}
