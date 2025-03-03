import { Repository } from '../Repository.js';
import { IndexCollection as DockerHubIndexCollection } from '../../DockerHub/IndexCollection.js';
import { IndexBuilder } from './IndexBuilder.js';
import { IndexCollection } from '../IndexCollection.js';
export declare class IndexCollectionBuilder {
    private readonly indexBuilder;
    constructor(indexBuilder: IndexBuilder);
    buildFromDockerHubIndexCollection(repository: Repository, dockerHubIndexCollection: DockerHubIndexCollection): IndexCollection;
}
