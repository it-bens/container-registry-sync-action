import { Crane } from './Utils/Crane.js';
import { Docker } from './Utils/Docker.js';
import { Client as DockerHubClient } from './DockerHub/Service/Client.js';
import { IndexFilterAgainstGhcrInformation } from './DockerHub/Service/IndexFilterAgainstGhcrInformation.js';
import { Inputs } from './Inputs.js';
import { Logger } from './Utils/Logger.js';
import { TagFilter } from './DockerHub/Service/TagFilter.js';
export declare class Action {
    private readonly dockerHubClient;
    private readonly tagFilter;
    private readonly indexFilterAgainstGhcrInformation;
    private readonly docker;
    private readonly crane;
    private readonly logger;
    constructor(dockerHubClient: DockerHubClient, tagFilter: TagFilter, indexFilterAgainstGhcrInformation: IndexFilterAgainstGhcrInformation, docker: Docker, crane: Crane, logger: Logger);
    run(inputs: Inputs): Promise<void>;
    private fetchDockerHubIndices;
    private filterSingleImageDockerHubIndices;
    private filterMultiImageDockerHubIndices;
    private buildSingleImageGhcrIndices;
    private buildMultiImageGhcrIndices;
}
