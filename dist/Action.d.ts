import { CoreInterface } from './Utils/GitHubAction/CoreInterface.js';
import { Inputs } from './Inputs.js';
import { Action as InstallAction } from './Install/Action.js';
import { LoggerInterface } from './Utils/LoggerInterface.js';
import { Action as LoginAction } from './Login/Action.js';
import { PrinterInterface } from './Summary/Service/PrinterInterface.js';
import { RegClientInterface } from './Utils/RegClientInterface.js';
import { Summary } from './Summary/Summary.js';
import { TagFilterInterface } from './Utils/TagFilterInterface.js';
import { TagSorterInterface } from './Utils/TagSorterInterface.js';
export declare class Action {
    private readonly installAction;
    private readonly loginAction;
    private readonly core;
    private readonly regClient;
    private readonly tagFilter;
    private readonly tagSorter;
    private readonly logger;
    private readonly summary;
    private readonly summaryPrinter;
    constructor(installAction: InstallAction, loginAction: LoginAction, core: CoreInterface, regClient: RegClientInterface, tagFilter: TagFilterInterface, tagSorter: TagSorterInterface, logger: LoggerInterface, summary: Summary, summaryPrinter: PrinterInterface);
    run(inputs: Inputs): Promise<void>;
    post(inputs: Inputs): Promise<void>;
}
