import { CoreInterface } from '../Utils/GitHubAction/CoreInterface.js';
import { DownloaderInterface } from '../Utils/DownloaderInterface.js';
import { ExecInterface } from '../Utils/GitHubAction/ExecInterface.js';
import { IoInterface } from '../Utils/GitHubAction/IoInterface.js';
import { LoggerInterface } from '../Utils/LoggerInterface.js';
import { RegCtlBinaryBuilderInterface } from './Service/RegCtlBinaryBuilderInterface.js';
import { RegCtlVersionBuilderInterface } from './Service/RegCtlVersionBuilderInterface.js';
import { Summary } from '../Summary/Summary.js';
export declare class Action {
    private readonly regCtlBinaryBuilder;
    private readonly io;
    private readonly downloader;
    private readonly exec;
    private readonly core;
    private readonly regCtlVersionBuilder;
    private readonly logger;
    private readonly summary;
    constructor(regCtlBinaryBuilder: RegCtlBinaryBuilderInterface, io: IoInterface, downloader: DownloaderInterface, exec: ExecInterface, core: CoreInterface, regCtlVersionBuilder: RegCtlVersionBuilderInterface, logger: LoggerInterface, summary: Summary);
    run(): Promise<void>;
    post(): Promise<void>;
}
