import { CoreInterface } from '../Utils/GitHubAction/CoreInterface.js';
import { DownloaderInterface } from '../Utils/DownloaderInterface.js';
import { ExecInterface } from '../Utils/GitHubAction/ExecInterface.js';
import { IoInterface } from '../Utils/GitHubAction/IoInterface.js';
import { LoggerInterface } from '../Utils/LoggerInterface.js';
import { RegCtlBinaryBuilderInterface } from './Service/RegCtlBinaryBuilderInterface.js';
export declare class Action {
    private readonly regCtlBinaryBuilder;
    private readonly io;
    private readonly downloader;
    private readonly exec;
    private readonly core;
    private readonly logger;
    constructor(regCtlBinaryBuilder: RegCtlBinaryBuilderInterface, io: IoInterface, downloader: DownloaderInterface, exec: ExecInterface, core: CoreInterface, logger: LoggerInterface);
    run(): Promise<void>;
    post(): Promise<void>;
}
