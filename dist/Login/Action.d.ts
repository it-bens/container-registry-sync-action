import { CoreInterface } from '../Utils/GitHubAction/CoreInterface.js';
import { Inputs } from '../Inputs.js';
import { LoggerInterface } from '../Utils/LoggerInterface.js';
import { RegClientCredentialsBuilderInterface } from './Service/RegClientCredentialsBuilderInterface.js';
import { RegClientInterface } from '../Utils/RegClientInterface.js';
export declare class Action {
    private readonly credentialsBuilder;
    private readonly regClient;
    private readonly logger;
    private readonly core;
    constructor(credentialsBuilder: RegClientCredentialsBuilderInterface, regClient: RegClientInterface, logger: LoggerInterface, core: CoreInterface);
    run(inputs: Inputs): Promise<void>;
    post(inputs: Inputs): Promise<void>;
}
