import { Index as DockerHubIndex } from '../../DockerHub/Index.js';
import { Repository } from '../Repository.js';
import { Index } from '../Index.js';
import { ImageBuilder } from './ImageBuilder.js';
export declare class IndexBuilder {
    private readonly imageBuilder;
    constructor(imageBuilder: ImageBuilder);
    buildFromDockerHubIndex(dockerHubIndex: DockerHubIndex, repository: Repository): Index;
}
