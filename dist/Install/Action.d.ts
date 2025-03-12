import { Core } from '../Utils/GitHubAction/Core.js';
import { Downloader } from '../Utils/Downloader.js';
import { Exec } from '../Utils/GitHubAction/Exec.js';
import { Io } from '../Utils/GitHubAction/Io.js';
import { Logger } from '../Utils/Logger.js';
import { RegCtlBinaryBuilder } from './Service/RegCtlBinaryBuilder.js';
export declare class Action {
    private readonly regCtlBinaryBuilder;
    private readonly io;
    private readonly downloader;
    private readonly exec;
    private readonly core;
    private readonly logger;
    constructor(regCtlBinaryBuilder: RegCtlBinaryBuilder, io: Io, downloader: Downloader, exec: Exec, core: Core, logger: Logger);
    run(): Promise<void>;
    post(): Promise<void>;
}
