import { Inputs } from './Inputs.js';
import { Action as InstallAction } from './Install/Action.js';
import { LoggerInterface } from './Utils/LoggerInterface.js';
import { Action as LoginAction } from './Login/Action.js';
import { RegClientInterface } from './Utils/RegClientInterface.js';
import { TagFilterInterface } from './Utils/TagFilterInterface.js';
import { TagSorterInterface } from './Utils/TagSorterInterface.js';
export declare class Action {
    private readonly installAction;
    private readonly loginAction;
    private readonly regClient;
    private readonly tagFilter;
    private readonly tagSorter;
    private readonly logger;
    constructor(installAction: InstallAction, loginAction: LoginAction, regClient: RegClientInterface, tagFilter: TagFilterInterface, tagSorter: TagSorterInterface, logger: LoggerInterface);
    run(inputs: Inputs): Promise<void>;
    post(inputs: Inputs): Promise<void>;
}
