import { Inputs } from './Inputs.js';
import { Action as InstallAction } from './Install/Action.js';
import { Logger } from './Utils/Logger.js';
import { Action as LoginAction } from './Login/Action.js';
import { RegClient } from './Utils/RegClient.js';
import { TagFilter } from './Utils/TagFilter.js';
import { TagSorter } from './Utils/TagSorter.js';
export declare class Action {
    private readonly installAction;
    private readonly loginAction;
    private readonly regClient;
    private readonly tagFilter;
    private readonly tagSorter;
    private readonly logger;
    constructor(installAction: InstallAction, loginAction: LoginAction, regClient: RegClient, tagFilter: TagFilter, tagSorter: TagSorter, logger: Logger);
    run(inputs: Inputs): Promise<void>;
    post(inputs: Inputs): Promise<void>;
}
