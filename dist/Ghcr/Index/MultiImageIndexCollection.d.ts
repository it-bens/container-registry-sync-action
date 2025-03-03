import { Docker } from '../../Utils/Docker.js';
import { MultiImageIndexCollection as DockerHubMultiImageIndexCollection } from '../../DockerHub/Index/MultiImageIndexCollection.js';
import { SingleImageIndexCollection as DockerHubSingleImageIndexCollection } from '../../DockerHub/Index/SingleImageIndexCollection.js';
import { MultiImageIndex } from './MultiImageIndex.js';
import { Repository } from '../Repository.js';
export declare class MultiImageIndexCollection {
    readonly repository: Repository;
    length: number;
    private indices;
    constructor(repository: Repository);
    static fromDockerHubIndexCollection(repository: Repository, dockerHubIndexCollection: DockerHubMultiImageIndexCollection, dockerHubSingleImageIndexCollection: DockerHubSingleImageIndexCollection): MultiImageIndexCollection;
    add(index: MultiImageIndex): void;
    buildAndPushAllManifests(docker: Docker): Promise<void>;
}
