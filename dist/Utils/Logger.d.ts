import { Core } from './GitHubAction/Core.js';
export declare class Logger {
    private readonly core;
    constructor(core: Core);
    info(message: string): void;
}
