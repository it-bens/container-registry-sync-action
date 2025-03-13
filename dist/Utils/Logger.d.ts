import { CoreInterface } from './GitHubAction/CoreInterface.js';
import { LoggerInterface } from './LoggerInterface.js';
export declare class Logger implements LoggerInterface {
    private readonly core;
    constructor(core: CoreInterface);
    logLoggingOutFromRepository(repository: string): void;
    logSkipLoginToRepository(repository: string): void;
    logTagsFound(tagCount: number, repository: string): void;
    logTagsMatched(tagCount: number, repository: string): void;
    logTagsToBeCopied(tags: string[], sourceRepository: string, targetRepository: string): void;
    logRegCtlCouldNotBeDeleted(path: string): void;
    logRegCtlDownloaded(fileUrl: string, directory: string): void;
    logRegCtlInstalled(installationPath: string, version: string): void;
    logRegCtlNotInstalledYet(): void;
}
