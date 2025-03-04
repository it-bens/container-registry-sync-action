import { Inputs } from '../Inputs.js';
import { Logger } from '../Utils/Logger.js';
import { RegClient } from '../Utils/RegClient.js';
import { RegClientCredentialsBuilder } from './Service/RegClientCredentialsBuilder.js';
export declare class Action {
    private readonly credentialsBuilder;
    private readonly regClient;
    private readonly logger;
    constructor(credentialsBuilder: RegClientCredentialsBuilder, regClient: RegClient, logger: Logger);
    run(inputs: Inputs): Promise<void>;
}
